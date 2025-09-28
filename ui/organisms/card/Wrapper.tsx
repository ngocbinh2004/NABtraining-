import { cx } from 'class-variance-authority'

interface Props {
  children: React.ReactNode
  classNames?: string
  name?: string
  noPadding?: boolean
  noWrapper?: boolean
}

export default function CardWrapper({
  children,
  classNames,
  noPadding,
  name,
}: Props) {
  return (
    <div
      className={cx(
        'wl-card__wrapper',
        // 'h-full',
        noPadding ? '' : 'py-6 px-4',
        'bg-transparent',
        classNames
      )}
      key={name}
    >
      {children}
    </div>
  )
}
