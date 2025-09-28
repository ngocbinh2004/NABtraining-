import { cx } from 'class-variance-authority'

interface Props {
  isActive?: boolean
  children?: React.ReactNode
  classNames?: string
  onClick?: (...args: any) => any
}

export default function TrAnimated({ classNames, children, onClick }: Props) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={cx(
        'wl-tr-animated lg:w-full md:py-4 md:px-8',
        'transition-all duration-300 ease-in-out',
        'lg:hover:bg-linear-card lg:hover:shadow-tr-item-active',
        classNames
      )}
      aria-label="show detail"
    >
      {children}
    </div>
  )
}
