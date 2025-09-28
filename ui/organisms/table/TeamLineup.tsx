// ui
import Text from '@/atoms/Text'
import CardTeamLineUp from '@/organisms/card/TeamLineup'
import CardSlider from '@/organisms/CardSlider'

// constants
import { UserTeam } from 'interfaces/user_team_type'
import { TEAM_ROLE } from 'constants/role'

interface Props {
  lineup?: UserTeam[]
}

export default function TeamLineup({ lineup }: Props) {
  const playerLineup =
    lineup && lineup?.length > 0
      ? lineup?.filter((member) => member?.role === TEAM_ROLE.PLAYER)
      : lineup ?? []

  const coachLineup =
    lineup && lineup?.length > 0
      ? lineup?.filter((member) => member?.role !== TEAM_ROLE.PLAYER)
      : lineup ?? []

  return (
    <div className="wl-events-team-detail flex flex-col items-center mt-8 gap-10">
      {/* START: coach */}
      <div className="wl-events-team-detail__coach flex flex-col w-full gap-4">
        <Text size="h3">Coach</Text>
        <MemberLineup members={coachLineup} role="coach" />
      </div>
      {/* END: coach */}

      {/* START: player */}
      <div className="wl-events-team-detail__player flex flex-col w-full gap-4">
        <Text size="h3">Player</Text>
        <MemberLineup members={playerLineup} role="player" />
      </div>
      {/* END: player */}
    </div>
  )
}

function MemberLineup({
  members,
  role,
}: {
  members?: UserTeam[]
  role: string
}) {
  return (
    <>
      <CardSlider classNames="md:hidden" name={role}>
        {members &&
          members?.length > 0 &&
          members.map((member) => (
            <CardTeamLineUp key={member.id} userTeam={member} />
          ))}
      </CardSlider>
      <div className="wl-events-team-detail__member hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members &&
          members?.length > 0 &&
          members.map((member) => (
            <CardTeamLineUp key={member.id} userTeam={member} />
          ))}
      </div>
    </>
  )
}
