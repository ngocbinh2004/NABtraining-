import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useState, useEffect } from 'react'
export default function AboutTheLeague() {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  //check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth > 704 && window.innerWidth <= 1200)
      setIsMobile(window.innerWidth <= 704)
    }
    handleResize() // Check initially
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getPaddingClass = () => {
    if (isMobile) return 'px-1'
    if (isTablet) return 'px-4'
    return 'px-0'
  }

  return (
    <div className="w-full h-full py-[40px] flex justify-center">
      <div className={`w-full max-w-[1200px] mx-auto ${getPaddingClass()}`}>
        <Image
          src={
            isMobile
              ? '/assets/About_sm.png'
              : isTablet
                ? '/assets/About_md.png'
                : '/assets/About_lg.png'
          }
          alt="about the league"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          quality={100}
        />
      </div>
    </div>
  )
}
export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
