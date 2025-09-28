import { cx } from 'class-variance-authority'

import Text from '@/atoms/Text'
import { EventPill } from '@/atoms/Pill'
import Image from '@/molecules/media/Image'

interface Props {
  eventName: string
  image?: string
  title?: string
  status?: string
}

export function RecordRanking({
  eventName,
  image,
  title = 'Ranking Records',
  status,
}: Props) {
  return (
    <div className="wl-title-record-ranking my-8 flex flex-col lg:flex-row items-center justify-center gap-6">
      {image && (
        <Image
          alt={eventName}
          isCircle
          url={image}
          width={95}
          height={95}
          withZoom
        />
      )}
      <div className="flex flex-col items-center lg:items-start w-fit">
        <Text size="h2" classNames="font-medium text-black">
          {eventName}
        </Text>
        <Text size="h1" classNames="text-green mb-2">
          {title}
        </Text>
        {status && <EventPill status={status} />}
      </div>
    </div>
  )
}

export function TeamInformation({
  eventName,
  image,
  title = 'Team Information',
}: Props) {
  return (
    <div className="wl-title-team-information my-8 flex flex-col items-center">
      {image && (
        <Image
          alt={eventName}
          isCircle
          url={image}
          classNames="mb-6"
          width={158}
          height={158}
          withZoom
        />
      )}
      <Text size="h2" classNames="font-medium text-center text-black mb-2">
        {eventName}
      </Text>
      <Text size="h1" classNames="text-green text-center">
        {title}
      </Text>
    </div>
  )
}

export function EventInformation({
  eventName,
  image,
  children,
  status,
}: Props & { children: React.ReactNode }) {
  return (
    <div className="wl-title-event-information my-8 flex flex-col items-center">
      {image && (
        <Image
          alt={eventName}
          isCircle
          url={image}
          classNames="mb-6"
          width={158}
          height={158}
          withZoom
        />
      )}
      <Text size="h1" classNames="text-green text-center mb-2">
        {eventName}
      </Text>
      {status && <EventPill status={status} />}
      <div className="mb-8"></div>
      {children}
    </div>
  )
}

export function InformationList({
  title,
  type,
}: {
  title?: string
  type: string
}) {
  return (
    <div
      className={cx(
        'wl-title-information mt-8 flex flex-col items-center',
        `wl-title-information-${type}`
      )}
      key={type}
    >
      <Text size="h1" classNames="text-black text-center mb-10 capitalize">
        {title}
      </Text>
    </div>
  )
}

export function TitleLeft({
  children,
  name,
}: {
  children: React.ReactNode
  name: string
}) {
  return (
    <div className={cx(`wl-title-left-${name}`, 'w-full lg:px-[100px]')}>
      <Text
        size="h1"
        classNames="text-black lg:w-[80%] lg:mx-auto mb-12 text-left capitalize"
      >
        {children}
      </Text>
    </div>
  )
}
