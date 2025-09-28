import { useState, useEffect, useMemo } from 'react'
import type { NextApiResponse, NextApiRequest } from 'next'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// helpers
import { getMatch } from 'helpers/api'
// ui
import Tab from '@/molecules/tab/Tab'
import { TeamInformation } from '@/components/PageTitle'
import GameRecord from '@/organisms/table/GameRecord'
import MatchSetScore from '@/organisms/table/MatchSetScore'

// constants
import { ISet, ISetRecord } from 'interfaces/set_type'
import { IMatches } from 'interfaces/match_type'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface IProps {
  match: IMatches
  tabsHeader?: { name: string; id: number; title: string; image: string }[]
  setRecordPerTeam: any
}
export default function GameRecordById({
  match,
  tabsHeader,
  setRecordPerTeam,
}: IProps) {
  // State
  const [activeTeam, setActiveTeam] = useState<number>()

  const matchData: IMatches = useMemo(() => {
    if (!match || !match?.match_set) {
      return match
    }

    const sortedSet = match?.match_set
      ? match.match_set.sort((a: ISet, b: ISet) =>
          a?.no && b?.no ? a?.no - b?.no : 1
        )
      : match.match_set
    return {
      ...match,
      match_set: sortedSet,
    }
  }, [match])

  // Effects
  useEffect(() => {
    if (match?.team1_id) setActiveTeam(match?.team1_id)
  }, [match?.team1_id])

  // UI
  if (!match?.id) {
    return (
      <div className="wl-game-record container mx-auto mt-12 w-full">
        <EmptyResult text="there are no match data" />
      </div>
    )
  }

  return (
    <div className="wl-game-record container mx-auto">
      <TeamInformation
        eventName={match?.name}
        title="Ranking Records"
        status={match?.status}
      />
      {tabsHeader ? (
        <Tab
          type="event"
          name="tab-game-record"
          onClick={(teamId) => setActiveTeam(teamId)}
          activeTab={activeTeam}
          tabs={tabsHeader}
        >
          {/* START: team match */}
          {matchData && (
            <div className="mt-10">
              <MatchSetScore matchData={[matchData]} />
            </div>
          )}
          {/* END: team match */}
          <GameRecord
            records={
              activeTeam && setRecordPerTeam
                ? setRecordPerTeam[activeTeam]
                : undefined
            }
          />
        </Tab>
      ) : (
        <div className="mt-12 w-full">
          <EmptyResult text="there are no match data" />
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({
  res,
  query,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const matchId = query?.id
  const matches = await getMatch(`?id=${matchId}`)
  const match = matches?.data?.data?.[0] || {}

  let setRecordPerTeam = null
  if (match && match?.match_set && match?.match_set?.length > 0) {
    setRecordPerTeam = match.match_set.reduce(
      (teamRecord: { [key: number]: ISetRecord[] }, set: ISet) => {
        // check if record exists
        const emptySetRecord =
          !set?.set_records ||
          !Array.isArray(set?.set_records) ||
          !set?.set_records?.length
        if (emptySetRecord) return teamRecord
        // grouped records by team
        const team1SetRecord = [...teamRecord[match?.team1_id]]
        const team2SetRecord = [...teamRecord[match?.team2_id]]
        set?.set_records?.forEach((record: ISetRecord) => {
          const inTeam1 = match.team1_id === record.user_team?.team_id
          if (inTeam1) team1SetRecord.push(record)

          const inTeam2 = match.team2_id === record.user_team?.team_id
          if (inTeam2) team2SetRecord.push(record)
        })
        return {
          ...teamRecord,
          [match.team1_id]: team1SetRecord,
          [match.team2_id]: team2SetRecord,
        }
      },
      {
        [match.team1_id || '']: [],
        [match.team2_id || '']: [],
      }
    )
  }

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      match,
      setRecordPerTeam,
      tabsHeader: match?.id
        ? [
            {
              name: match?.team1?.name,
              id: match?.team1?.id,
              title: match?.team1?.name,
              image: match?.team1?.logo,
            },
            {
              name: match?.team2?.name,
              id: match?.team2?.id,
              title: match?.team2?.name,
              image: match?.team2?.logo,
            },
          ]
        : null,
        ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
