import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { NextApiResponse, NextApiRequest } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// hooks
import { useEventScore } from 'hooks/useEventScore'
import { useMatches } from 'hooks/useMatches'
// helpers
import { splitName } from 'helpers/splitName'
import { getEvent } from 'helpers/api'
// ui
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'
import Tab from '@/molecules/tab/Tab'
import MatchSetScore from '@/organisms/table/MatchSetScore'
import CardWrapper from '@/organisms/card/Wrapper'
import GameRecordList from '@/organisms/table/GameRecordList'
import GameRecord from '@/organisms/table/GameRecord'
import { RecordRanking } from '@/components/PageTitle'
// constants
import { Events } from 'interfaces/event_type'
import { ISet, ISetRecord } from 'interfaces/set_type'
import { IMatches } from 'interfaces/match_type'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface IProps {
  events?: Events[]
  tabsHeader?: { name: string; id: any }[]
}

export default function Record({ events, tabsHeader }: IProps) {
  // State
  const [selectedEvent, setSelectedEvent] = useState<number>(
    events?.[0]?.id || -1
  )
  const [activeTeam, setActiveTeam] = useState<string>()
  // Query
  const { data } = useEventScore(`event_id=${selectedEvent}`, !!selectedEvent)
  const currentTeam = !!activeTeam && data?.data?.[activeTeam]
  const { data: team1MatchData } = useMatches(
    `event_id=${selectedEvent}&team1_id=${currentTeam?.team_id}`,
    !!selectedEvent && !!currentTeam?.team_id
  )
  const { data: team2MatchData } = useMatches(
    `event_id=${selectedEvent}&team2_id=${currentTeam?.team_id}`,
    !!selectedEvent && !!currentTeam?.team_id
  )

  const matchData = useMemo(() => {
    if (!currentTeam) {
      return []
    }

    const filterMatchWithSet = ({ match_set: sets }: IMatches) =>
      sets && sets?.length > 0

    const allMatches = [
      ...(team2MatchData?.data || []),
      ...(team1MatchData?.data || []),
    ]
    if (allMatches?.length === 0) {
      return []
    }
    const matches = allMatches
      ?.filter(filterMatchWithSet)
      ?.map((match: IMatches) => {
        const sortedSet = match?.match_set
          ? match.match_set.sort((a: ISet, b: ISet) =>
              a?.no && b?.no ? a?.no - b?.no : 1
            )
          : match.match_set
        return {
          ...match,
          match_set: sortedSet,
        }
      })

    return matches
  }, [team1MatchData, team2MatchData, currentTeam])

  // Var
  const [firstName, lastName] = splitName(activeTeam || '')
  const gameRecords =
    currentTeam?.team_id && currentTeam?.sets?.length > 0
      ? currentTeam?.sets.reduce((records: ISetRecord[], set: ISet) => {
          if (!set?.set_records?.length) return records

          return set?.set_records?.filter(
            (record: ISetRecord) =>
              record?.user_team?.team_id === currentTeam?.team_id
          )
        }, [])
      : undefined

  // Function
  const handleTabChange = (id: number) => {
    setSelectedEvent(id)

    if (activeTeam) setActiveTeam(undefined)
  }

  // UI
  const recordRangking =
    events?.find((event: Events) => event.id === selectedEvent) || events?.[0]

  if (!recordRangking)
    return (
      <div className="wl-game-record container mx-auto">
        <div className="mt-12 w-full">
          <EmptyResult text="there are no record ranking" />
        </div>
      </div>
    )

  return (
    <div className="wl-game-record container mx-auto mt-[56px] gap-[88px]">
      <RecordRanking
        status={recordRangking?.status}
        eventName={recordRangking.name}
        image={recordRangking.image}
        title="Ranking Records"
      />
      <Tab
        type="button"
        name="tab-record"
        onClick={handleTabChange}
        activeTab={selectedEvent || events?.[0]?.id}
        tabs={tabsHeader}
      >
        <div className="mt-[56px]">
          {/* START: Record List */}
          <div className={activeTeam ? 'hidden' : ''}>
            <GameRecordList
              teams={data?.data}
              setActiveTeam={setActiveTeam}
              activeTeam={activeTeam}
            />
            {/* END: Record List */}
          </div>
          {/* START: Record Detail - onClick */}
          <div className={activeTeam ? '' : 'hidden'}>
            <CardWrapper
              noPadding
              classNames="flex flex-col lg:flex-row justify-center items-center p-8 gap-8 lg:gap-[96px]"
            >
              <div className="flex">
                {currentTeam?.logo && (
                  <Image
                    alt={currentTeam.name}
                    url={currentTeam.logo}
                    classNames="mr-6"
                    width={99}
                    height={99}
                    isCircle
                    withShadow
                    withZoom
                  />
                )}
                <div className="flex flex-col items-center justify-center">
                  <Text
                    size="unset"
                    classNames="font-primary font-semibold text-[20px] leading-[26px] text-white grow-0"
                  >
                    {firstName}
                  </Text>
                  <Text
                    size="unset"
                    classNames="font-primary font-semibold text-[32px] leading-[42px] text-white grow-0"
                  >
                    {lastName}
                  </Text>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-20">
                <div className="flex gap-4 items-center">
                  <Text size="body5">GP</Text>
                  <Text
                    size="unset"
                    classNames="text-primary text-bold text-[36px] leading-[47px]"
                  >
                    {currentTeam?.gp}
                  </Text>
                </div>
                <div className="flex gap-4 items-center">
                  <Text size="body5">Win</Text>
                  <Text
                    size="unset"
                    classNames="text-primary text-bold text-[36px] leading-[47px]"
                  >
                    {currentTeam?.win}
                  </Text>
                </div>

                <div className="flex gap-4 items-center">
                  <Text size="body5">Lose</Text>
                  <Text
                    size="unset"
                    classNames="text-primary text-bold text-[36px] leading-[47px]"
                  >
                    {currentTeam?.lose}
                  </Text>
                </div>

                <div className="flex gap-4 items-center">
                  <Text size="body5">PCT</Text>
                  <Text
                    size="unset"
                    classNames="text-primary text-bold text-[36px] leading-[47px]"
                  >
                    {currentTeam?.pct}
                  </Text>
                </div>
              </div>
            </CardWrapper>
            {matchData && !!activeTeam && (
              <CardWrapper classNames="text-body2 md:text-body3 text-center">
                {/* START: Team matches */}
                <MatchSetScore matchData={matchData} />
                {/* END: Team matches */}
              </CardWrapper>
            )}
            <GameRecord records={gameRecords} />
          </div>
          {/* END: Record Detail - onClick */}
        </div>
      </Tab>
    </div>
  )
}

export const getServerSideProps = async ({
  res,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const events = await getEvent('?limit=10&page=1')
  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      events: events?.data?.data,
      tabsHeader:
        events?.data?.total > 0
          ? events?.data?.data?.map(({ id, name }: Events) => ({
              name,
              id,
            }))
          : [],
      ...(await serverSideTranslations(locale)),
    },
  }
}
