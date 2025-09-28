import Icon from '@/atoms/Icon'
import Text from '@/atoms/Text'
import Tooltip from '@/atoms/Tooltip'
import { cx } from 'class-variance-authority'

interface LabelContentProps {
  label?: string
  content?: string
  classNames?: string
  isHoverable?: boolean
  hoverableText?: string
}

interface TitleProps {
  title: string
  classNames?: string
}

function TicketLabelContent({ classNames, label, content }: LabelContentProps) {
  return (
    <div className={cx('wl-label-content', 'flex flex-col', classNames)}>
      <Text size="card-label" classNames={cx(label ? 'text-white' : 'hidden')}>
        {label}
      </Text>
      <Text
        size="card-content"
        classNames={cx(label ? 'text-white' : 'hidden')}
      >
        {content}
      </Text>
    </div>
  )
}

function TicketTitle({ title }: TitleProps) {
  return (
    <Text
      size="unset"
      classNames={cx(
        'wl-label-title',
        'font-primary font-medium text-[24px] leading-[31px]',
        'text-white'
      )}
    >
      {title}
    </Text>
  )
}

export const Ticket = {
  LabelContent: TicketLabelContent,
  LabelTitle: TicketTitle,
}

export function BuyTicketLabelContent({
  classNames,
  label,
  content,
}: LabelContentProps) {
  return (
    <div className={cx('wl-label-content', 'flex flex-col', classNames)}>
      <Text
        size="unset"
        classNames={cx(
          'font-secondary font-normal text-[24px] leading-[33.6px]',
          label ? 'text-white' : 'hidden'
        )}
      >
        {label}
      </Text>
      <Text
        size="unset"
        classNames={cx(
          'font-secondary font-semibold',
          'text-[36px]',
          content ? 'text-white' : 'hidden'
        )}
      >
        {content}
      </Text>
    </div>
  )
}

function AccountLabelContent({
  classNames,
  label,
  content,
  isSmall,
  isHoverable,
  hoverableText,
}: LabelContentProps & { isSmall?: boolean }) {
  return (
    <div className={cx('wl-label-content', 'flex flex-col', classNames)}>
      <div className="flex items-center">
        <Text
          size="unset"
          classNames={cx(
            'font-primary text-[16px] leading-[26px]',
            label ? 'text-white' : 'hidden'
          )}
        >
          {label}
        </Text>
        {isHoverable && hoverableText && <Tooltip text={hoverableText} />}
      </div>
      <Text
        size="unset"
        classNames={cx(
          'font-primary',
          'text-[24px] leading-[31px]',
          isSmall ? 'md:text-[20px] md:leading-[21px]' : '',
          label ? 'text-white' : 'hidden'
        )}
      >
        {content}
      </Text>
    </div>
  )
}

function AccountTitle({ title }: TitleProps) {
  return (
    <Text
      size="unset"
      classNames={cx(
        'wl-label-title',
        'font-primary font-medium text-[20px] leading-[26px]',
        'text-white'
      )}
    >
      {title}
    </Text>
  )
}

export const Account = {
  LabelContent: AccountLabelContent,
  LabelTitle: AccountTitle,
}
