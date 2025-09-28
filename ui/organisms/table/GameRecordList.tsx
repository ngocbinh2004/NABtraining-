import { EventScores } from 'interfaces/event_score_type'

import Icon from '@/atoms/Icon'
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'
import TrAnimated from '@/organisms/TrAnimated'
import Image from '@/molecules/media/Image'

import EmptyResult from '@/components/EmptyRecord'

interface Props {
  teams: EventScores
  setActiveTeam: (...args: any) => any
  activeTeam?: string
}

export default function GameRecordList({
  teams,
  setActiveTeam,
  activeTeam,
}: Props) {
  return (
    <div className="wl-table-game-record-list w-full mt-[72px] mb-10 px-[30px] lg:px-0 overflow-x-auto">
      <div className="wl-table-game-record-list__header min-w-screen lg:min-w-full flex gap-5 md:gap-[30px] flex-grow">
        <div className="basis-[50px] mr-[30px] invisible">
          <Text size="h3" breakWord="unset">
            No
          </Text>
        </div>
        <div className="w-[100px] md:w-[200px] lg:w-[40%] text-left flex shrink-0">
          <Text size="h3" breakWord="unset">
            Team
          </Text>
        </div>
        <div className="w-14 lg:w-[10%] text-right shrink-0">
          <Text size="h3" breakWord="unset">
            GP
          </Text>
        </div>
        <div className="w-14 lg:w-[10%] text-right shrink-0">
          <Text size="h3" breakWord="unset">
            Win
          </Text>
        </div>
        <div className="w-14 lg:w-[10%] text-right shrink-0">
          <Text size="h3" breakWord="unset">
            Lose
          </Text>
        </div>
        <div className="w-14 lg:w-[10%] text-right shrink-0">
          <Text size="h3" breakWord="unset">
            PCT
          </Text>
        </div>
      </div>
      <Line classNames="wl-table-game-record-list__line w-full mt-8 mb-[56px]" />
      <div className="wl-table-game-record-list__content w-full flex flex-col">
        {teams && Object.keys(teams).length > 0 ? (
          Object.entries(teams).map(([name, team], idx) => (
            <TrAnimated
              isActive={activeTeam === team.team_id}
              key={team.team_id}
              classNames="wl-table-game-record-list__tr flex gap-5 md:gap-[30px]"
              onClick={() => setActiveTeam(name)}
            >
              <div className="basis-[50px] mr-[30px]">
                <Text size="h3" breakWord="unset">
                  {idx + 1}
                </Text>
              </div>
              <div className="w-[100px] md:w-[200px] lg:w-[40%] text-left flex flex-col md:flex-row shrink-0">
                {team.logo && (
                  <>
                    <Image
                      classNames="block mb-4 md:hidden"
                      width={50}
                      height={50}
                      alt={name}
                      url={team.logo}
                      withShadow
                      isCircle
                    />
                    <Image
                      classNames="hidden md:block mr-6"
                      width={30}
                      height={30}
                      alt={name}
                      url={team.logo}
                      withShadow
                      isCircle
                    />
                  </>
                )}
                <Text breakWord="words" classNames="w-full">
                  {name}
                </Text>
                <div className="wl-tr-animated__arrow translate-x-0 opacity-0 w-fit">
                  <Icon
                    icon="table-arrow"
                    width={26}
                    height={27}
                    classNames="text-white"
                  />
                </div>
              </div>
              <div className="w-14 lg:w-[10%] text-right shrink-0">
                <Text>{team.gp}</Text>
              </div>
              <div className="w-14 lg:w-[10%] text-right shrink-0">
                <Text>{team.win}</Text>
              </div>
              <div className="w-14 lg:w-[10%] text-right  shrink-0">
                <Text>{team.lose}</Text>
              </div>
              <div className="w-14 lg:w-[10%] text-right  shrink-0">
                <Text>{team.pct}</Text>
              </div>
            </TrAnimated>
          ))
        ) : (
          <EmptyResult />
        )}
      </div>
    </div>
  )
}
