import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import type { NextApiResponse, NextApiRequest } from 'next'

// helpers
import { getTeam, getUserTeam } from 'helpers/api'
import { beautifyDate } from 'helpers/beautifyDate'
// ui
import Text from '@/atoms/Text'
import TeamIntroduction from '@/organisms/table/TeamIntroduction'
import TeamLineup from '@/organisms/table/TeamLineup'
import Tab from '@/molecules/tab/Tab'
// constants
import { Teams } from 'interfaces/team_type'
import { UserTeam } from 'interfaces/user_team_type'

interface Props {
  team?: Teams
  userTeams?: UserTeam[]
}

const TABS = [
  { name: 'Introduction', id: '1' },
  { name: 'Team Lineup', id: '2' },
]

export default function TeamDetail({ team, userTeams }: Props) {
  const { query } = useRouter()
  const teamId = query?.teamId

  // State
  const [activeTab, setActiveTab] = useState('1')

  const teamIntroduction = useMemo(() => {
    return (
      <TeamIntroduction
        introduction={{
          name: team?.name,
          established: !!team?.established
            ? beautifyDate(new Date(+team?.established), true)
            : '',
          description: team?.description ?? 'N/A',
        }}
      />
    )
  }, [team])

  // UI
  if (!teamId) return null
  return (
    <main className="wl-team-detail container mx-auto mt-[56px]">
      <div className="wl-title-team-information my-8 flex flex-col items-center">
        <Text size="h1" classNames="text-white text-center">
          Team Information
        </Text>
      </div>
      <Tab
        type="text"
        name="tab-team-detail"
        onClick={(tabId) => setActiveTab(tabId)}
        activeTab={activeTab}
        tabs={TABS}
      >
        <div className={activeTab === '1' ? '' : 'hidden'}>
          {teamIntroduction}
        </div>
        <div className={activeTab === '2' ? '' : 'hidden'}>
          {userTeams && <TeamLineup lineup={userTeams} />}
        </div>
      </Tab>
    </main>
  )
}

export const getServerSideProps = async ({
  res,
  query,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
}) => {
  const teamId = query?.teamId
  const teams = await getTeam(`?id=${teamId}`)
  const userTeams = await getUserTeam(`?team_id=${teamId}`)

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      team: teams?.data?.data?.[0],
      userTeams: userTeams?.data?.data,
    },
  }
}
