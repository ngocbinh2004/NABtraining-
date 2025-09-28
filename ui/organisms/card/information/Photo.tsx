import { cx } from 'class-variance-authority'

import CardWrapper from '@/organisms/card/Wrapper'
import Image from '@/molecules/media/Image'
import Text from '@/atoms/Text'

interface Props {
  classNames?: string
  url: string
  title: string
  content?: string
  date: string
  eventName?: string
  eventUrl?: string
}
export default function CardPhoto({
  url,
  title,
  content,
  date,
  classNames,
  eventName,
  eventUrl,
}: Props) {
  return (
    <CardWrapper
      classNames={cx('wl-card-news', 'flex flex-col', 'p-4', classNames)}
      name={title}
      key={title}
    >
      <div className="relative ">
        <Image
          withShadow
          classNames="min-w-full min-h-[200px] h-[200px] rounded mb-4"
          // classNames="min-w-full min-h-[283px] h-[283px] rounded mb-4"
          alt={title}
          url={url}
          withZoom
        />
        {/* <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2 rounded-card-photo-overlay bg-black-900 min-h-[56px] h-auto pt-3">
          {eventUrl && (
            <Image
              isCircle
              alt={eventName || title}
              url={eventUrl}
              classNames="h-8 w-8 min-h-8 min-w-8"
            />
          )}
          <Text
            size="unset"
            classNames="font-primary font-medium text-[24px] leading-[31.2px] text-white"
          >
            {eventName}
          </Text>
        </div> */}
      </div>
      <Text
        size="unset"
        classNames="font-primary font-bold text-[20px] leading-[26px] text-white text-left mt-2"
      >
        {title}
      </Text>
      <Text
        size="unset"
        classNames="font-primary font-normal text-[20px] leading-[26px] text-white mt-2"
      >
        {content}
      </Text>
      <Text
        size="unset"
        classNames="font-primary font-normal text-[14px] leading-[18px] text-gray-350 mt-4 flex justify-end"
      >
        {date}
      </Text>
    </CardWrapper>
  )
}
