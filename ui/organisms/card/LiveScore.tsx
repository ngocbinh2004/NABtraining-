import { beautifyISODate } from 'helpers/beautifyDate'
// ui
import CardWrapper from '@/organisms/card/Wrapper'
import Text from '@/atoms/Text'
import Line from '@/atoms/Line'
import Image from '@/molecules/media/Image'
// constants
import { ISet } from 'interfaces/set_type'

export interface Props {
  set: ISet
}

export default function CardLiveScore({ set }: Props) {
  return (
    <CardWrapper
      classNames="wl-card-live-score flex flex-col rounded-none min-w-[300px] justify-center"
      name={`wl-card-live-score-${set.id}`}
    >
      <div className="flex justify-between">
        <Text
          size="unset"
          classNames="font-primary font-seminold text-[16px] leading-[21px] text-white text-center lg:text-left"
        >
          {set?.match?.name}
          <br />
          {set.updated_dt && beautifyISODate(set.updated_dt)}
        </Text>
        <div className="px-4 py-2 bg-gray-700/30">{set?.no}</div>
      </div>
      <Line classNames="my-4" />
      <div className=" w-full flex justify-center lg:justify-start items-center">
        <div className=" w-[50%] flex justify-between items-center">
          {set?.team1?.logo && (
            <Image
              withShadow
              isCircle
              url={set.team1?.logo}
              alt={set.team1?.name}
              classNames="mr-6"
              width={48}
              height={48}
              withZoom
            />
          )}
          <Text classNames="font-primary font-medium text-white flex-grow text-right">
            {set?.team1_score}&nbsp;:
          </Text>
        </div>
        {set?.team2?.name && (
          <div className=" w-[50%] flex justify-between items-center">
            <Text classNames="font-primary font-medium text-gray-400 flex-grow text-left">
              &nbsp;{`${set?.team2_score}`}
            </Text>
            {set?.team2?.logo && (
              <Image
                url={set.team2?.logo}
                alt={set.team2?.name}
                classNames="ml-6"
                width={48}
                height={48}
                withShadow
                isCircle
                withZoom
              />
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
