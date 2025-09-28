import { cx } from 'class-variance-authority'
// ui
import { EventPill } from '@/atoms/Pill'
import Line from '@/atoms/Line'
import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import { Account } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'
// constants
import { eventStatus } from 'constants/gameStatus'

interface Props {
  name?: string
  classNames?: string
  gridClassNames?: string
  title: string
  url?: string
  status?: string
  isCancelLoading?: boolean
  isRemoveLoading?: boolean
  contents?: {
    label: string
    content: string
    isSmall?: boolean
    isHoverable?: boolean
    hoverableText?: string
  }[]
  onCancelEvent?: (...args: any) => any
  onUncanceledEvent?: (...args: any) => any
  onRemove?: (...args: any) => any
  onUpdateEvent?: (...args: any) => any
  onMatchClick?: (...args: any) => any
  isOwner?: boolean
  onDetailClick?: (...args: any) => any
  onRankTableClick?: (...args: any) => any
}

export default function CardEditGame({
  name,
  title,
  url,
  classNames,
  contents,
  gridClassNames,
  isCancelLoading,
  isRemoveLoading,
  isOwner,
  status,
  onCancelEvent,
  onUncanceledEvent,
  onRemove,
  onUpdateEvent,
  onMatchClick,
  onDetailClick,
  onRankTableClick,
}: Props) {
  return (
    <CardWrapper
      classNames={cx(
        classNames,
        'wl-card-edit-account',
        'flex flex-col justify-between',
        'w-full relative'
      )}
      name={name}
    >
      {status && (
        <div className="absolute top-0 right-2">
          <EventPill status={status} />
        </div>
      )}

      <div className="wl-card-edit-account__content">
        <div className="wl-card-edit-account__title flex gap-2">
          {url && (
            <Image
              withShadow
              width={32}
              height={32}
              alt={title}
              url={url}
              isCircle
              withZoom
            />
          )}
          <Account.LabelTitle title={title} />
        </div>
        <Line classNames="my-4" />
        <div className={gridClassNames}>
          {contents?.length &&
            contents?.length > 0 &&
            contents.map(
              ({ label, content, isSmall, isHoverable, hoverableText }) => (
                <Account.LabelContent
                  key={label}
                  label={label}
                  content={content}
                  isSmall={isSmall}
                  isHoverable={isHoverable}
                  hoverableText={hoverableText}
                />
              )
            )}
        </div>
      </div>
      <div className="wl-card-edit-account__footer flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
        {isOwner ? (
          <>
            {status !== eventStatus.CANCELED &&
              status !== eventStatus.COMPLETED && (
                <>
                  {/* <Button
                    size="sm"
                    type="ghost"
                    onClick={onRemove}
                    isLoading={isRemoveLoading}
                    disabled={isRemoveLoading}
                  >
                    Remove Event
                  </Button> */}
                  <Button
                    size="sm"
                    type="ghost"
                    onClick={onCancelEvent}
                    isLoading={isCancelLoading}
                    disabled={isCancelLoading}
                  >
                    Cancel Event
                  </Button>
                  <Button size="sm" type="primary" onClick={onUpdateEvent}>
                    Update Detail
                  </Button>
                  <Button size="sm" type="primary" onClick={onMatchClick}>
                    Match
                  </Button>
                  <Button size="sm" type="primary" onClick={onRankTableClick}>
                    Rank Table
                  </Button>
                </>
              )}
            {status === eventStatus.CANCELED && (
              <>
                <Button
                  size="sm"
                  type="primary"
                  onClick={onUncanceledEvent}
                  isLoading={isCancelLoading}
                  disabled={isCancelLoading}
                >
                  Uncancel event
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              size="sm"
              type="primary"
              onClick={onDetailClick}
              ariaLabel="View game detail"
            >
              View Detail
            </Button>
          </>
        )}
      </div>
    </CardWrapper>
  )
}
