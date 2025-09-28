import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import CardWrapper from '@/organisms/card/Wrapper'

import { cx } from 'class-variance-authority'

interface Props {
  classNames?: string
  url?: string
  name?: string
  title?: string
  content?: string
  handleSeeMore?: (...args: any) => any
}

export default function CardTeam({
  title,
  name,
  content,
  classNames,
  handleSeeMore,
  url,
}: Props) {
  // const teamNames = content?.split(' ')
  // const lastTeamName = teamNames?.splice(-1, 1)

  return (
    <CardWrapper
      classNames={cx(
        'flex flex-col justify-between items-start gap-6',
        'w-full py-6',
        classNames
      )}
      name={name}
    >
      <div
        className={cx(
          'wl-card-team',
          'flex flex-col justify-center items-center',
          'min-h-[100px] w-full'
        )}
        key={name}
      >
        {url && (
          <Image
            withShadow
            isCircle
            width={100}
            height={100}
            alt={title || name || ''}
            url={url}
            withZoom
          />
        )}
        {title && (
          <Text
            size="unset"
            classNames="font-primary font-normal text-[16px] leading-[21px] text-gray-250 text-center mb-1"
            breakWord="all"
          >
            {`/ ${title}`}
          </Text>
        )}
        {/* <Text
            size="unset"
            classNames="font-primary font-semibold text-[20px] leading-[26px] text-white grow-0"
            breakWord="all"
          >
            {content}
          </Text> */}
        {/* <Text
            size="unset"
            classNames="font-primary font-semibold text-[32px] leading-[42px] text-white grow-0"
            breakWord="all"
          >
            {lastTeamName}
          </Text> */}
        <Text
          size="unset"
          classNames="font-primary font-semibold text-[32px] leading-[42px] text-white grow-0 text-center"
          breakWord="all"
        >
          {content}
        </Text>
      </div>
      {handleSeeMore && (
        <div className="flex w-full justify-center">
          <Button size="sm" type="primary" onClick={handleSeeMore}>
            See More
          </Button>
        </div>
      )}
    </CardWrapper>
  )
}
