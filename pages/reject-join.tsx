import { useRouter } from 'next/router'

import { useTeams } from 'hooks/useTeams'

import Button from '@/atoms/Button'
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'

export default function RejectJoin() {
  const { query, push } = useRouter()
  const { data: team, isSuccess } = useTeams(`id=${query?.team}`, !!query?.team)

  return (
    <div className="wl-reject-join w-screen mt-[56px] flex flex-col items-center gap-10 container mx-auto">
      <Image
        isCircle
        url={team?.data?.[0]?.logo}
        alt="team-logo"
        width={90}
        height={90}
        withZoom
      />
      <Text size="h1">
        {`You have rejected the invitation to team ${
          isSuccess ? `"${team?.data?.[0]?.name}"` : ''
        }`}
      </Text>
      <div className="flex flex-col md:flex-row w-full lg:items-center justify-center gap-4">
        <Button size="lg" type="secondary" onClick={() => push('/')}>
          Go to Home
        </Button>
        <Button size="lg" type="primary" onClick={() => push('/user/teams')}>
          View your teams
        </Button>
      </div>
    </div>
  )
}
