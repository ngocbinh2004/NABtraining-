import { cx } from 'class-variance-authority'
import { A11y, Controller, Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

interface Props {
  name: string
  children?: React.ReactNode[]
}

const SWIPER_MODULES = [A11y, Controller, Pagination, Autoplay]

export default function MediaCarousel({ name, children }: Props) {
  if (!children) return null

  return (
    <div
      className={cx(
        'wl-media-carousel',
        'w-full relative',
        'drop-shadow-media'
      )}
    >
      <Swiper
        slidesPerView={1}
        direction="horizontal"
        modules={SWIPER_MODULES}
        mousewheel={{
          forceToAxis: true,
        }}
        className={cx(name, 'w-full py-4')}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return (
              '<span class="pagination ' +
              className +
              '">' +
              '</span>'
            )
          },
        }}
        speed={500}
        loop={true}
        updateOnWindowResize
        autoplay={true}
      >
        {children && children?.length > 0 && (
          <>
            {children.map((card, idx) => (
              <SwiperSlide key={idx} className="w-fit ">
                {card}
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
    </div>
  )
}
