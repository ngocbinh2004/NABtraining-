import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/atoms/Icon'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import RefereesIntroduction from '@/components/referees-introduction/Referees-Introduction'

// helpers
import { getRefereeIntroduction } from 'helpers/api'

import { IRefereeIntroductionType } from 'interfaces/referees_introduction_types'
import Title from '@/components/common/Title'

interface IProps {
  refereesIntroduction?: {
    data?: IRefereeIntroductionType[]
    total: number
  }
}

export default function RefereesIntroductionOverview({ refereesIntroduction }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <div className="wl-home">
      {!isMobile && !isSmallScreen && (
        <div
          className="absolute left-[0%] w-[400px] h-0 pb-[20%] bg-no-repeat bg-contain opacity-60 z-[-1]"
          style={{ backgroundImage: "url('/assets/logo-behind.png')" }}
        ></div>
      )}
      <div className="container mx-auto">
        <div className="flex justify-center p-4">
          <div className="w-full">
            <div className="flex justify-start items-center mt-4 mb-1 lg:mb-6">
              <Title
                title_text={t('RefereeIntroduction.title')}
                fallback="Referee Introduction"
                isMobile={isMobile}
              />
            </div>
            {refereesIntroduction && (
              <RefereesIntroduction
                refereeIntroduction={refereesIntroduction.data}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  locale,
}: {
  query?: { [key: string]: string }
  locale: string
}) => {
  const RefereesIntroduction = await getRefereeIntroduction()
  return {
    props: {
      refereesIntroduction: RefereesIntroduction?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
