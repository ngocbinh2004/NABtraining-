import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'
import { useState, useEffect, } from 'react'
// helpers
import { getYearMonthDay } from 'helpers/beautifyDate'
// ui
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'
import CardWrapper from '@/organisms/card/Wrapper'

interface Props {
  classNames?: string
  imageUrl?: string
  title?: string
  id: number
  date?: string
  isCompact?: boolean
  url: string
}

// @TODO: confirm the style and remove the comments
export default function CardNews({
  imageUrl,
  title,
  id,
  date,
  classNames,
  url,
}: Props) {
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    if (url && url.length > 0) {
      window.open(url, '_blank')
    } else {
      router.push(`/information/news/${id}`)
    }
  }

  return (
    <a href={url?.length > 0 ? url : `/information/news/${id}`} onClick={handleClick}>
      <CardWrapper
        classNames={cx(
          'wl-card-news',
          isMobile ? 'flex flex-col w-[296px] h-[317px]'
            : isMediumScreen ? 'flex flex-row w-[435px] h-[140px]' : 'flex flex-row w-[516px] h-[140px]',
          classNames
        )}
        noPadding
        name={title}
        key={title}
      >
        {imageUrl && (
          <Image
            classNames={cx(
              'flex-shrink-0',
              isMobile ? 'w-[296px] h-[211px]' : 'w-[196px] h-[140px]',
            )}
            alt={title || 'news image'}
            url={imageUrl.replace(/#/g, '%23')}
            imageClassNames="h-full w-full object-cover"
            objectFit="object-cover"
          />
        )}
        <div className={cx(
          'flex flex-col justify-top mt-2',
          isMobile || isSmallScreen ? '' : 'px-4'
        )}>
          {date && (
            <Text
              size="unset"
              classNames={cx(
                'font-normal text-white mb-2',
                isMobile ? 'text-[16px] mt-2' : 'text-[18px]',
              )}
            >
              {getYearMonthDay(date, router.locale)}
            </Text>
          )}
          {title && (
            <Text
              size="unset"
              classNames={cx(
                'font-bold text-white',
                isMobile ? 'line-clamp-2 text-[18px] leading-[26px]' : 'line-clamp-3 text-[20px] leading-[30px]',
              )}
            >
              {title}
            </Text>
          )}
        </div>
      </CardWrapper>
    </a>
  )
}