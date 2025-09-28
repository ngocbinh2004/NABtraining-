import { cx } from 'class-variance-authority'
import { A11y, Controller, Mousewheel, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import Icon from '@/atoms/Icon'

import 'swiper/css'

interface Props {
  name: string
  slidesPerView?: number
  classNames?: string
  children?: React.ReactNode | React.ReactNode[]
  spaceBetween?: number
  isMobile?: boolean
}

const SWIPER_MODULES = [A11y, Controller, Mousewheel, Navigation]

export default function CardSlider({
  name,
  classNames,
  slidesPerView,
  children,
  spaceBetween,
  isMobile,
}: Props) {
  if (!children) return null

  return (
    <div
      className={cx(
        'wl-card-slider',
        'w-full relative',
        'px-0 md:px-0',
        classNames
      )}
    >
      <Swiper
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: slidesPerView ?? 'auto',
            spaceBetween: spaceBetween ?? 30,
          },
        }}
        direction="horizontal"
        modules={SWIPER_MODULES}
        mousewheel={{
          forceToAxis: true,
        }}
        className={cx(name, 'w-full py-4')}
        navigation={{
          nextEl: `#next-${name}.wl-card-slider__button-next`,
          prevEl: `#prev-${name}.wl-card-slider__button-prev`,
          disabledClass: 'wl-card-slider__button-disabled',
        }}
        watchOverflow
        updateOnWindowResize
      >
        {Array.isArray(children) && children?.length > 0 && (
          <>
            {children.map((card, idx) => (
              <SwiperSlide key={idx} className="w-fit">
                {card}
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
    </div>
  )
}
