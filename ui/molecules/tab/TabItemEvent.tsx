import { cx } from 'class-variance-authority'

import Image from '@/molecules/media/Image'
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'

interface TabEventProps {
  active?: boolean
  title?: string
  subtitle?: string
  id?: string | number
  image?: string
  onClick: (...args: any) => any
}

export default function TabItemEvent({
  onClick,
  image,
  active,
  title,
  subtitle,
}: TabEventProps) {
  return (
    <button
      className={cx(
        'wl-tab__item-game',
        'bg-transparent outline-none',
        'text-tab-item',
        active ? 'text-white' : 'text-white-500'
      )}
      role="button"
      onClick={onClick}
    >
      <div className="flex gap-8 w-full">
        {image && (
          <Image
            alt={title ?? 'team-image'}
            url={image}
            isCircle
            imageClassNames={active ? '' : 'drop-shadow-event-inactive'}
            width={55}
            height={55}
            withZoom
          />
        )}
        <div className="flex flex-col gap-1">
          <Text
            size="body2"
            classNames="font-normal text-gray-250"
            breakWord="unset"
          >
            {subtitle}
          </Text>
          <Text size="body3" classNames="font-semibold" breakWord="unset">
            {title}
          </Text>
        </div>
      </div>
      <Line classNames={cx(active ? 'visible' : 'invisible', 'mt-4')} />
    </button>
  )
}
