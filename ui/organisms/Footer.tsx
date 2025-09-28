import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Line from '@/atoms/Line'
import Image from '@/molecules/media/Image'
import Text from '@/atoms/Text'
import {
  FaFacebookSquare,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import BackgroundPattern from '../../assets/Background_Pattern.svg'
import { cx } from 'class-variance-authority'

export default function Footer() {
  const router = useRouter()
  const { t } = useTranslation()
  const now = new Date()
  const year = now?.getFullYear()
  const menuItems = [
    { label: t('MainPage.FooterMenu.contact'), href: '/coming-soon' },
    { label: t('MainPage.FooterMenu.policy'), href: '/privacy-policy' },
    { label: t('MainPage.FooterMenu.terms'), href: '/coming-soon' },
  ]
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
    <div className="w-full">
      <div className={cx('relative w-full background-green',
        isMobile ? 'h-[170px]' : 'h-[227px]',
      )}>
        <Image
          alt="background-pattern"
          url={BackgroundPattern}
          width={isMobile ? 67 : 227}
          height={isMobile ? 67 : 227}
          imageClassNames="absolute top-0 left-0"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Link href="/">
            <Image
              alt="tpvl-logo"
              url="/assets/tpvl-logo.png"
              height={isMobile ? 36 : 50}
              width={isMobile ? 104 : 144}
            />
          </Link>
          <div className="flex flex-row justify-center items-center mt-4">
            {menuItems.map((item, index) => (
              <Fragment key={item.label}>
                <Link
                  href={item.href}
                  className={cx('text-white text-center',
                    isMobile && router.locale === 'en' ? 'text-[14px] mx-[5px]'
                      : isMobile && router.locale === 'cn' ? 'text-[14px] mx-[14px]'
                        : 'text-[16px] mx-[18px]',
                  )}
                >
                  {item.label}
                </Link>
                {index < 2 && (
                  <Line
                    orientation="vertical"
                    classNames={cx('xl:block border-l border-white mx-2', isMobile ? 'h-4' : 'h-5')}
                  />
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex flex-row items-center mt-6">
            <a
              href="https://www.facebook.com/TPVL2025"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookSquare className={cx('text-white', isMobile ? 'mx-4' : 'mx-6')} size={isMobile ? 20 : 25} />
            </a>
            <a
              href="https://www.instagram.com/tpvl2025.official/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className={cx('text-white', isMobile ? 'mx-4' : 'mx-6')} size={isMobile ? 20 : 25} />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className={cx('text-white', isMobile ? 'mx-4' : 'mx-6')} size={isMobile ? 20 : 25} />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black h-[38px] md:h-[42px] flex items-center justify-center">
        <Text classNames={cx('text-white text-[12px]')} size="footer">
          TPVL {year} {t('MainPage.FooterMenu.content')}
        </Text>
      </div>
    </div>
  )
}
