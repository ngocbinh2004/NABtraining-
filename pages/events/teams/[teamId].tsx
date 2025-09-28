import { useMemo } from 'react'
import { useRouter } from 'next/router'
import type { NextApiResponse, NextApiRequest } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// helpers
import { getTeam, getUserTeam } from 'helpers/api'
import { beautifyDate } from 'helpers/beautifyDate'
// ui
import Text from '@/atoms/Text'
import TeamIntroduction from '@/organisms/table/TeamIntroduction'
import TeamLineup from '@/organisms/table/TeamLineup'
// constants
import { Teams } from 'interfaces/team_type'
import { UserTeam } from 'interfaces/user_team_type'

interface Props {
  team?: Teams
  userTeams?: UserTeam[]
}

export default function TeamDetail({ team, userTeams }: Props) {
  const { query } = useRouter()
  const teamId = query?.teamId

  // State
  const teamIntroduction = useMemo(() => {
    return (
      <TeamIntroduction
        introduction={{
          name: team?.name,
          established: !!team?.established
            ? beautifyDate(new Date(+team?.established), true)
            : '',
          description: team?.description ?? 'N/A',
          abbreviation: team?.abbreviation ?? 'N/A',
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
      <div className="">{teamIntroduction}</div>
      <div className="">{userTeams && <TeamLineup lineup={userTeams} />}</div>
    </main>
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
      team: teams?.data?.data?.[0] || null,
      userTeams: userTeams?.data?.data || null,
      ...(await serverSideTranslations(locale)),
    },
  }
}
