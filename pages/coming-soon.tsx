import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from '@/molecules/media/Image'

interface Props {}

export default function ComingSoon({}: Props) {
  const { t } = useTranslation()
  const [isBigScreen, setIsBigScreen] = useState(false)
  //check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsBigScreen(window.innerWidth >= 1800)

    }
    handleResize() // Check initially
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative w-full flex justify-center items-center ">
      <div className='hidden 2xl:block absolute top-0 left-0 z-0 opacity-60'>
        <Image
          alt="background"
          url="assets/logo-behind.png"
          classNames={cx(isBigScreen ? 'h-[400px] w-[400px]' : 'h-[220px] w-[220px]')}
          imageClassNames="h-full w-full"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="container relative mx-auto z-10 items-center justify-center flex flex-col bg-[#]">
        <div className="flex flex-col items-center justify-center w-full lg:w-[960px] py-10 mt-6 lg:mt-10 px-8 lg:px-32 border border-white boxBlurShadow">
          <Image
            alt="logo"
            url="/assets/white-logo-yellow-star.png"
            classNames="h-[40px] w-[115px] lg:h-[78px] lg:w-[225px]"
            imageClassNames="h-full w-full"
            objectFit="cover"
            quality={100}
          />
          <div className="mt-6 pt-6 lg:pt-10 w-full border-t border-gray-250">
            <p className="text-2xl lg:text-[40px] font-bold text-white text-center">
              {t('ComingSoon.title')}
            </p>
            <p className="text-left lg:text-center font-normal text-base lg:text-lg text-white mt-2 lg:mt-6">
              {t('ComingSoon.content')}
            </p>
            <div className="mt-10 flex justify-center items-center h-12 w-full space-x-2">
              <Link href="/" className="w-full">
                <button className="text-white px-5 py-2 border border-white h-12 lg:h-[51px] w-full">
                  <span className="font-semibold text-base lg:text-[18px] text-nowrap">
                    {t('ComingSoon.back_to_home')}
                  </span>
                </button>
              </Link>
              <Link href="/schedule/schedule" className="w-full">
                <button className="text-white px-5 py-2 bg-[#009919] h-12 lg:h-[51px] w-full ">
                  <span className="font-semibold text-base lg:text-[18px] text-nowrap">
                    {t('ComingSoon.recent_events')}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
