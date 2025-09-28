import { cx } from 'class-variance-authority'
import { A11y, Controller, Mousewheel, Navigation } from 'swiper'
import { Swiper } from 'swiper/react'

import Icon from '@/atoms/Icon'

import 'swiper/css'

interface Props {
  name: string
  type: 'button' | 'text' | 'event' | 'horizontal-bar'
  children?: React.ReactNode
  slidePerView?: number
}

const SWIPER_MODULES = [A11y, Controller, Mousewheel, Navigation]

export default function TabHeader({
  name,
  children,
  type,
  slidePerView,
}: Props) {
  return (
    <div
      className={cx(
        'wl-tab__header',
        `wl-tab__header--${type}`,
        'w-full relative px-[48px]'
      )}
    >
      <button
        id={`prev-${name}`}
        className="wl-tab__header__button-prev swiper-button"
      >
        <Icon icon="chevron-right" height={20} width={20} />
      </button>
      <div
        id={`next-${name}`}
        className="wl-tab__header__button-next swiper-button"
      >
        <Icon icon="chevron-left" height={20} width={20} />
      </div>

      <Swiper
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: type === 'button' ? 16 : type === 'event' ? 0 : 0,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: slidePerView ?? 'auto',
            spaceBetween:
              type === 'button'
                ? 32
                : type === 'event'
                ? 64
                : type === 'horizontal-bar'
                ? 0
                : 16,
          },
        }}
        direction="horizontal"
        modules={SWIPER_MODULES}
        mousewheel={{
          forceToAxis: true,
        }}
        className={cx(
          name,
          'w-full py-4',
          type === 'text' ? 'flex justify-between' : ''
        )}
        navigation={{
          nextEl: `#next-${name}.wl-tab__header__button-next`,
          prevEl: `#prev-${name}.wl-tab__header__button-prev`,
          disabledClass: 'wl-tab__header__button-disabled',
        }}
        watchOverflow
        updateOnWindowResize
      >
        {children}
      </Swiper>
    </div>
  )
}
