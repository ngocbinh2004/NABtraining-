import { cx } from 'class-variance-authority'
// helpers
import { isAdmin } from 'helpers/role'
// ui
import { EventPill } from '@/atoms/Pill'
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import CardWrapper from '@/organisms/card/Wrapper'

interface Props {
  classNames?: string
  url?: string
  title: string
  content: string
  isOpen?: boolean
  handleMore: (...args: any) => any
  handleRegister: (...args: any) => any
  status?: string
}

export default function CardCompetition({
  title,
  content,
  classNames,
  handleMore,
  handleRegister,
  isOpen,
  url,
  status,
}: Props) {
  // @TODO: uncomment this on next phase
  const canRegister = false
  // const canRegister = isAdmin() && isOpen
  return (
    <CardWrapper
      classNames={cx(
        'wl-card-competition',
        'flex flex-col lg:flex-row gap-8',
        'w-full h-full pt-11 pb-10 px-4',
        'relative',
        classNames
      )}
      name={title}
    >
      {status && (
        <div className="absolute top-2 right-2">
          <EventPill status={status} />
        </div>
      )}
      {url && (
        <Image
          withShadow
          classNames="lg:w-[30%] lg:max-w-[30%] lg:min-w-[30%] h-auto "
          alt={title}
          url={url}
          withZoom
        />
      )}
      <div className="flex flex-col w-full">
        <div className="flex flex-col h-full">
          <Text
            size="card-title"
            classNames={cx(
              'text-white mb-1',
              url ? '' : 'text-center',
              'text-lg'
            )}
          >
            {title}
          </Text>
          <Text
            size="body3"
            classNames={cx('text-white mb-6', url ? '' : 'text-center')}
          >
            {content}
          </Text>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="sm" type="ghost" onClick={handleMore}>
            More
          </Button>
          {canRegister && (
            <Button size="sm" type="primary" onClick={handleRegister}>
              Register
            </Button>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
