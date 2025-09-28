import { useRouter } from 'next/router'
import { useState, useEffect, } from 'react'
import { useTranslation } from 'next-i18next'
import CardWrapper from '@/organisms/card/Wrapper'
import { cx } from 'class-variance-authority'
// ui
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'
// constants
import { IRefereeIntroductionType } from 'interfaces/referees_introduction_types'

interface Props {
  card: IRefereeIntroductionType
}

export default function AlbumRefereesIntroduction({ card }: Props) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)
  const { t } = useTranslation()

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
  const roles = ['CHIEF_REFEREE', 'CONSULTANT', 'UMPIRE']
  return (
    <CardWrapper
      classNames={cx(
        'wl-card-photo flex flex-col items-center justify-center border border-white background-card boxBlurShadow',
        isMobile || isSmallScreen ? 'w-[156px] h-[226px]'
          : isMediumScreen ? 'w-[250px] h-[357px]' : 'w-[282px] h-[402px]',
      )}
      noPadding
      name={card.name}
      key={card.id}
    >
      {card.profile_photo ? (
        <Image
          url={card.profile_photo}
          alt={card.name}
          classNames={cx(
            'object-cover rounded-none',
            isMobile || isSmallScreen ? 'w-[120px] h-[162px] mt-2'
              : isMediumScreen ? 'w-[190px] h-[257px]' : 'w-[204px] h-[276px]',
          )}
          withZoom={false}
        />
      ) : (
        <div className={cx(
          'object-cover rounded-none flex items-center justify-center bg-white',
          isMobile ? 'w-[120px] h-[162px] mt-2'
            : isMediumScreen ? 'w-[190px] h-[257px]' : 'w-[204px] h-[276px]',
        )}>
          <Text classNames="text-center text-gray-500">No Image Available</Text>
        </div>
      )}
      <div className={cx(
        'flex flex-row justify-between items-center  w-4/5 border-t border-white pt-2 overflow-hidden',
        isMobile ? 'mt-4' : 'mt-6'
      )}>
        {roles.includes(card.role) && (
          <Text
            size="unset"
            classNames={cx(
              'font-normal text-white truncate whitespace-nowrap overflow-hidden',
              isMobile ? 'text-[16px] max-w-[40%]' : 'text-[20px] max-w-[45%]',
            )}
          >
            {t(`RefereeIntroduction.${card.role}`)}
          </Text>
        )}
        {card.name && (
          <Text
            size="unset"
            classNames={cx(
              'font-bold text-white truncate whitespace-nowrap overflow-hidden',
              isMobile ? 'text-[16px] max-w-[50%]' : 'text-[20px] max-w-[55%]',
            )}
          >
            {card.name}
          </Text>
        )}
      </div>
    </CardWrapper>
  )
}