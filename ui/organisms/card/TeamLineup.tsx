import { cx } from 'class-variance-authority'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import CardWrapper from '@/organisms/card/Wrapper'

import { UserTeam } from 'interfaces/user_team_type'
import { TEAM_ROLE } from 'constants/role'

interface Props {
  userTeam: UserTeam
  classNames?: string
}

export default function CardTeamLineUp({ userTeam, classNames }: Props) {
  const isPlayer = userTeam?.role === TEAM_ROLE.PLAYER
  const playerDetail = []
  if (userTeam?.user?.height_cm)
    playerDetail.push(`${userTeam?.user?.height_cm}cm`)
  if (userTeam?.user?.weight_kg)
    playerDetail.push(`${userTeam?.user?.weight_kg}kg`)
  if (userTeam?.user?.gender) playerDetail.push(`${userTeam?.user?.gender}`)

  return (
    <CardWrapper
      classNames={cx('wl-card-team-lineup w-full h-full py-6', classNames)}
      name={`team-lineup-${userTeam?.id}`}
      key={userTeam?.id}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {userTeam?.user?.profile_picture && (
          <Image
            withShadow
            width={150}
            height={150}
            alt={userTeam?.user?.name || ''}
            url={userTeam?.user?.profile_picture}
            withZoom
          />
        )}
        <div className="flex flex-col items-center">
          <Text
            size="unset"
            classNames="font-primary font-semibold text-[20px] leading-[26px] text-white grow-0"
            breakWord="words"
          >
            {userTeam?.user?.name}
          </Text>
          <Text
            size="unset"
            classNames="capitalize font-primary font-semibold text-[32px] leading-[42px] text-white grow-0"
            breakWord="words"
          >
            {`${isPlayer ? userTeam?.position || '' : userTeam?.role}`
              .toLowerCase()
              .replace('_', ' ')}
          </Text>
          {isPlayer && (
            <Text classNames="capitalized" breakWord="words">
              {playerDetail?.join(' / ')}
            </Text>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
