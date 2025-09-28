import { cx } from 'class-variance-authority'

interface Props {
  icon:
    | 'logo-large'
    | 'logo-small'
    | 'play'
    | 'table-arrow'
    | 'caret'
    | 'user'
    | 'ticket'
    | 'hoverable-info'
    | 'about'
    | 'chevron-right'
    | 'chevron-left'
    | 'close'
    | 'hamburger'
    | 'star'
    | 'top-arrow'
    | 'eye-opened'
    | 'eye-closed'
    | 'facebook'
    | 'instagram'
    | 'youtube'
    | 'x-twitter'
    | 'linkedin'
    | 'referee-icon'
    | 'order-referee'
    | 'referee-register-arrow'
    | 'angle-up'
    | 'angle-down'
    | 'angle-double-down'
    | 'referee-next-arrow-right'
    | 'referee-copy'
    | 'visa-card'
    | 'jkos-pay'
    | 'visa-card-gray'
    | 'logo-no-fill'
    | 'attach-file'
    | 'delete-session'
    | 'dropdown-arrow'
    | 'logo-tpvl-small'
    | 'logo-tpvl-signup'
    | 'signup-check'
  classNames?: string
  height: number
  width: number
}

export default function Icon({ icon, classNames, width, height }: Props) {
  return (
    <svg
      role="presentation"
      aria-hidden="true"
      className={cx(['wl-icon', classNames])}
      width={width}
      height={height}
    >
      <use xlinkHref={`/assets/app-icons.svg#${icon}`}></use>
    </svg>
  )
}
