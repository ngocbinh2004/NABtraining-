import { useRouter } from 'next/router'
import { useState, useEffect, } from 'react'
// helpers
import { getYearMonthDay } from 'helpers/beautifyDate'
import CardWrapper from '@/organisms/card/Wrapper'
import { cx } from 'class-variance-authority'
// ui
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'
// constants
import { IAlbum } from 'interfaces/album_type'

interface Props {
  album: IAlbum
}

export default function CardAlbum({ album }: Props) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
      setIsMediumScreen(window.innerWidth < 1440 && window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const firstPhoto = album.photos.length > 0 ? album.photos[0].image : null
  return (
    <CardWrapper
      classNames={cx(
        'wl-card-photo flex flex-col',
        isMobile ? 'w-[280px] h-[271px]'
          : isMediumScreen ? 'w-[270px] h-[292px]' : 'w-[336px] h-[292px]',
      )}
      noPadding
      name={album.name}
      key={album.name}
    >
      {firstPhoto ? (
        <Image
          url={firstPhoto}
          alt={album.name}
          classNames={cx(
            'object-cover rounded-none',
            isMobile ? 'w-[280px] h-[200px]'
              : isMediumScreen ? 'w-[270px] h-[211px]' : 'w-[336px] h-[211px]',
          )}
        />
      ) : (
        <div className={cx(
          'object-cover rounded-none items-center justify-center bg-white',
          isMobile ? 'w-[280px] h-[200px]'
            : isMediumScreen ? 'w-[270px] h-[211px]' : 'w-[336px] h-[211px]',
        )}>
          <Text classNames="text-gray-500">No Image Available</Text>
        </div>
      )}

      <div className={cx(
        'flex flex-col justify-top mt-2',
        isMobile || isSmallScreen ? '' : 'px-4'
      )}>
        {album.create_dt && (
          <Text
            size="unset"
            classNames={cx(
              'font-normal text-white mb-2',
              isMobile ? 'text-[16px] mt-2' : 'text-[18px]',
            )}
          >
            {getYearMonthDay(album.create_dt, router.locale)}
          </Text>
        )}
        {album.name && (
          <Text
            size="unset"
            classNames={cx(
              'font-bold text-white line-clamp-2',
              isMobile ? 'text-[18px] leading-[26px]' : 'text-[20px] leading-[30px]',
            )}
          >
            {album.name}
          </Text>
        )}
      </div>
    </CardWrapper>
  )
}