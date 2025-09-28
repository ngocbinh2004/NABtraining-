import React, { useState, useEffect } from 'react'
import Icon from '@/atoms/Icon'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function IntroduceSignUp() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="wl-home">
      <div className="container mx-auto">
        <div className="flex justify-center p-4">
          <div className="w-full lg:max-w-[720px]">
            <div className="w-full h-30 lg:h-[42px] flex justify-start items-center mt-4 gap-2 lg:gap-3">
              <Icon
                icon="referee-icon"
                height={isMobile ? 28 : 32}
                width={isMobile ? 28 : 32}
              />
              <p className="font-secondary font-semibold lg:font-bold text-green text-2xl lg:text-[32px]">
                {t('SignUp.Introduction.title')}
              </p>
            </div>

            <div className="w-full justify-start items-center pl-10 mt-1 lg:mt-2">
              <p className="font-secondary font-semibold text-black text-lg lg:text-xl">
                {t('SignUp.Introduction.description')}
              </p>
              <p className="font-secondary font-normal text-[#FF5900] text-base">
                {t('SignUp.Introduction.confirm_agreement')}
              </p>
            </div>

            <div className="w-full bg-white text-justify mt-3 lg:mt-6 p-6 lg:py-10 lg:px-16 gap-6 lg:gap-10">
              <div className="relative">
                <div className="max-h-[400px] lg:max-h-[560px] overflow-y-scroll p-4 no-scrollbar">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: `${t(
                        'SignUp.Introduction.content_condition_1'
                      )} ${t('SignUp.Introduction.content_condition_2')} ${t(
                        'SignUp.Introduction.content_condition_3'
                      )} ${t('SignUp.Introduction.content_condition_4')} ${t(
                        'SignUp.Introduction.content_condition_5'
                      )} ${t('SignUp.Introduction.content_condition_6')} ${t(
                        'SignUp.Introduction.content_condition_7'
                      )} ${t('SignUp.Introduction.content_condition_8')} ${t(
                        'SignUp.Introduction.content_condition_9'
                      )}`,
                    }}
                  />
                </div>

                <div className="blur-bottom p-4"></div>
              </div>

              <div className="w-full flex flex-col lg:flex-row justify-center items-center mt-6 gap-2 lg:gap-4">
                <button
                  className="w-full h-[51px] lg:h-[60px] border border-green hover:text-white bg-white hover:bg-[#004F36] font-medium text-base lg:text-lg"
                  onClick={() => router.push('/login')}
                >
                  {t('SignUp.Introduction.back_button')}
                </button>
                <button
                  className="w-full h-[51px] lg:h-[60px] border border-green hover:text-white bg-white hover:bg-[#004F36] font-medium text-base lg:text-lg"
                  onClick={() => router.push('/sign-up')}
                >
                  {t('SignUp.Introduction.next_button')}
                </button>
              </div>
            </div>
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
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
