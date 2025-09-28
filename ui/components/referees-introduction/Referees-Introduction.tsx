import { Fragment } from 'react'
import { IRefereeIntroductionType } from 'interfaces/referees_introduction_types'
import { useRouter } from 'next/router'
import Image from '@/molecules/media/Image'
import Text from '@/atoms/Text'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import AlbumRefereesIntroduction from '@/organisms/card/referees_introduction/refereesIntroductionList'

interface RefereeIntroductionProps {
  refereeIntroduction: IRefereeIntroductionType[] | undefined
}

const RefereesIntroduction: React.FC<RefereeIntroductionProps> = ({
  refereeIntroduction
}) => {
  const { t } = useTranslation()
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
  return (
    <div className="w-full">
      {!refereeIntroduction || refereeIntroduction.length === 0 ? (
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/8 flex justify-end">
            <Image
              classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
              alt="star logo"
              url="/assets/yellow_star.png"
              imageClassNames="h-full rounded-t px-2 py-1"
              objectFit="object-contain"
            />
          </div>
          <div className="w-7/8">
            <Text
              size="unset"
              classNames="font-tertiary text-white text-center w-full text-[26px] leading-[30px] pt-[30px]"
            >
              {t('ComingSoon.title')}
            </Text>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[24px] items-center justify-center">
          {refereeIntroduction.map((item, index) => (
            <Fragment key={index}>
              <div className='flex flex-col items-center justify-center'>
                <AlbumRefereesIntroduction
                  key={index}
                  card={item}
                ></AlbumRefereesIntroduction>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default RefereesIntroduction
