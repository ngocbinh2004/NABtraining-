import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'
// helpers
import { getYearMonthDay } from 'helpers/beautifyDate'
// ui
import Text from '@/atoms/Text'
import Pill from '@/atoms/Pill'
import CardWrapper from '@/organisms/card/Wrapper'
import Video from '@/molecules/media/Video'
// constants
import { IVideo } from 'interfaces/video_type'
import { videoStatus } from 'constants/gameStatus'

import FullScreenVideoPlayer from '@/organisms/card/information/FullScreenVideoPlayer'

interface Props {
  noShadow?: boolean
  clickZoom?: boolean
  video: IVideo
  index?: number
}
export default function CardVideo({
  video,
  noShadow,
  clickZoom = false,
  index,
}: Props) {
  if (noShadow)
    return (
      <div className="wl-card-video video-home">
        <Content
          noShadow={noShadow}
          clickZoom={clickZoom}
          video={video}
          index={index}
        />
      </div>
    )

  return (
    <CardWrapper
      classNames="wl-card-video video-vertical"
      name={video.name}
      key={video.name}
      noWrapper={noShadow}
    >
      <Content
        noShadow={noShadow}
        clickZoom={clickZoom}
        video={video}
        index={index}
      />
    </CardWrapper>
  )
}

function Content({
  video: { url, name, create_dt: date, description, status },
  noShadow = false,
  clickZoom = false,
  index,
}: Props) {
  const router = useRouter()
  const isLive = videoStatus.LIVE === status

  return (
    <>
      {/* Start Video screen */}
      <div className="relative">
        <Video
          title={name}
          classNames={cx(
            'min-w-full rounded-none',
            noShadow ? 'h-[211px]' : 'min-h-[283px] h-[283px]'
          )}
          url={url}
          description={description ? description : ''}
        />
        {/* Background overload */}
        <FullScreenVideoPlayer
          clickZoom={clickZoom}
          url={url}
          description={description || ''}
          index={index}
        />
      </div>
      {/* End video screen */}

      {/* Video Info */}
      <div className={cx('flex flex-col gap-2 mx-0', noShadow ? 'mt-4' : '')}>
        <div className="flex justify-between items-center w-full">
          <Text
            size="unset"
            classNames={cx(
              'text-white font-normal',
              noShadow
                ? 'text-base lg:text-lg leading-[21px] text-black'
                : 'text-base lg:text-lg leading-[18px] text-gray-350 mt-1 basis-[90px] shrink-0'
            )}
          >
            {getYearMonthDay(date, router.locale)}
          </Text>
          {isLive && <Pill classNames="text-[16px]">Live</Pill>}
        </div>
        <Text
          size="unset"
          classNames={cx(
            'text-left text-white line-clamp-2',
            noShadow
              ? 'text-lg lg:text-xl leading-[20.5px]'
              : 'text-lg lg:text-xl leading-[26px]'
          )}
        >
          {name}
        </Text>
      </div>
    </>
  )
}
