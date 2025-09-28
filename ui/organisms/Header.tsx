import { useState, useEffect, useRef } from 'react'
import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Image from '@/molecules/media/Image'
// hooks
import { useOverflowBody } from 'hooks/useOverflowBody'
// ui
import MenuDropdown from '@/molecules/MenuDropdown'
import MenuItem from '@/molecules/MenuItem'
import Line from '@/atoms/Line'
import Link from '@/atoms/Link'
import { FaEarthAsia } from 'react-icons/fa6'
import { MdMenu } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import Icon from '@/atoms/Icon'

export default function Header() {
  const { push, pathname, asPath, query, locale } = useRouter()

  // State
  const [showHeader, setShowHeader] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [currentLang, setCurrentLang] = useState(locale === 'en' ? 'EN' : 'CN')

  const smallScreenLangButtonRef = useRef<HTMLButtonElement>(null)
  const smallScreenLangMenuRef = useRef<HTMLDivElement>(null)
  const largeScreenLangButtonRef = useRef<HTMLButtonElement>(null)
  const largeScreenLangMenuRef = useRef<HTMLDivElement>(null)

  const handleMenuClick = () => setShowHeader(false)
  const { t } = useTranslation()

  const changeLanguage = (newLang: 'en' | 'cn') => {
    setCurrentLang(newLang === 'en' ? 'EN' : 'CN')
    push({ pathname, query }, asPath, { locale: newLang })
    setShowLangMenu(false)
  }
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isSmallLaptop, setIsSmallLaptop] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
      setIsSmallLaptop(window.innerWidth < 1126 && window.innerWidth >= 1024)
      setIsMediumScreen(window.innerWidth < 1440 && window.innerWidth >= 1126)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile && !isSmallScreen && showHeader) {
      setShowHeader(false)
    }
  }, [isMobile, isSmallScreen, showHeader])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideSmallScreenMenu =
        smallScreenLangButtonRef.current &&
        !smallScreenLangButtonRef.current.contains(event.target as Node) &&
        smallScreenLangMenuRef.current &&
        !smallScreenLangMenuRef.current.contains(event.target as Node)

      const isOutsideLargeScreenMenu =
        largeScreenLangButtonRef.current &&
        !largeScreenLangButtonRef.current.contains(event.target as Node) &&
        largeScreenLangMenuRef.current &&
        !largeScreenLangMenuRef.current.contains(event.target as Node)

      if (isOutsideSmallScreenMenu && isOutsideLargeScreenMenu) {
        setShowLangMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showHeader &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowHeader(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHeader])

  useOverflowBody({ hideOverflow: showHeader })
  return (
    <div
      className={cx(
        'wl-header fixed top-0 left-0',
        'flex flex-col items-center justify-center',
        'px-0 w-full z-40',
        showHeader
          ? 'h-full overflow-y-auto bg-transparent'
          : 'bg-black lg:h-[72px] h-[56px]'
      )}
    >
      {showHeader && (
        <>
          <div className="fixed top-0 left-0 w-[320px] h-[56px] bg-black z-[20]" />
          <div className="fixed top-14 left-0 w-[320px] bottom-0 bg-[#002116] z-[10]" />
          <div className="fixed top-0 left-0 w-full h-[56px] bg-black opacity-80 z-[19]" />
          <div className="fixed top-14 left-0 w-full bottom-0 bg-black opacity-80 z-[9]" />
        </>
      )}
      <div
        className={cx(
          'wl-header__content flex flex-col lg:flex-row justify-between w-full h-full 2xl:px-35 pr-[10px]',
          isMobile
            ? 'lg:pl-[2%] lg:pr-[2%]'
            : `${currentLang === 'EN' ? 'lg:pl-[6%] lg:pr-[6%]' : 'lg:pl-[8%] lg:pr-[8%]'}`
        )}
      >
        <div
          className={cx(
            'ml-4 w-[92px] flex flex-row',
            showHeader ? 'mt-[12px] z-[25] fixed' : 'h-full items-center z-0'
          )}
        >
          <Link href="/" label="Go to home">
            <Image
              alt="tpvl-logo"
              url="/assets/tpvl-logo.png"
              height={32}
              width={92}
              quality={100}
            />
          </Link>
        </div>
        <button
          ref={smallScreenLangButtonRef}
          onClick={() => setShowLangMenu(!showLangMenu)}
          className={cx(
            'lg:hidden flex ml-4 right-[83px]',
            showHeader ? 'mt-[16px] fixed' : 'h-full items-center absolute'
          )}
          aria-label="Change language"
        >
          <FaEarthAsia
            className="w-6 h-6 text-white"
            style={{ stroke: 'currentColor', strokeWidth: 3 }}
          />
          {showLangMenu && (
            <div
              ref={smallScreenLangMenuRef}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white text-white rounded shadow-lg"
            >
              <div className="flex flex-col p-2 text-[18px] text-black font-pingFang">
                <span
                  className={`cursor-pointer py-2 ${currentLang === 'EN' ? 'font-bold' : 'text-orange-500'
                    }`}
                  onClick={() => changeLanguage('cn')}
                >
                  繁體中文
                </span>
                <div className="w-full h-px bg-[#D9D9D9]"></div>
                <span
                  className={`cursor-pointer py-2 ${currentLang === 'CN' ? 'font-bold' : 'text-orange-500'
                    }`}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </span>
              </div>
            </div>
          )}
        </button>
        <button
          role="button"
          onClick={() => {
            setShowHeader(true)
          }}
          className={cx(
            'lg:hidden right-[15px]',
            showHeader ? 'mt-[4px] fixed' : 'h-full items-center absolute'
          )}
          aria-label="open navigation detail on mobile"
        >
          <MdMenu className="w-12 h-12 text-white" />
        </button>
        <button
          role="button"
          aria-label="close navigation detail on mobile"
          onClick={() => {
            setShowHeader(false)
          }}
          className={cx(
            'lg:hidden text-white mt-[8px] ml-[260px]',
            showHeader ? 'z-[25] fixed' : 'hidden absolute'
          )}
        >
          <IoClose className="w-12 h-12 text-white" />
        </button>
        <div
          className={cx(
            showHeader ? 'w-[320px]' : 'w-full',
            'flex lg:inline-flex flex-col lg:flex-row lg:w-full justify-between'
          )}
        >
          <div
            ref={mobileMenuRef}
            className={cx(
              'wl-header__content',
              showHeader ? 'mt-20 justify-start' : 'hidden lg:block',
              'flex lg:inline-flex flex-col lg:flex-row lg:w-full justify-between'
            )}
          >
            <div
              className={cx(
                'flex flex-col lg:flex-row z-10 text-[18px]',
                showHeader
                  ? 'wl-header__menu-wrapper items-start'
                  : 'items-center lg:w-auto',
                isMediumScreen
                  ? 'lg:gap-6 lg:ml-[15px]'
                  : isSmallLaptop
                    ? `${currentLang === 'EN'
                      ? 'lg:gap-[14px] lg:ml-[15px]'
                      : 'lg:gap-6 lg:ml-[15px]'
                    }`
                    : 'lg:ml-[60px] lg:gap-8 '
              )}
            >
              <Line classNames="hidden" />
              <MenuItem
                menu={t('MainPage.HeaderMenu.home')}
                href="/"
                handleClick={handleMenuClick}
              />
              <Line
                classNames={showHeader ? 'hidden' : ''}
                orientation={showHeader ? 'horizontal' : 'vertical'}
              />
              <MenuDropdown
                menu={t('MainPage.HeaderMenu.results')}
                handleClick={handleMenuClick}
                showHeader={showHeader}
                items={[
                  {
                    menu: t('MainPage.ResultsItem.record'),
                    href: '/record',
                  },
                  {
                    menu: t('MainPage.ResultsItem.player-introduction'),
                    href: '/player/player-ranking',
                  },
                  {
                    menu: t('MainPage.ResultsItem.competition-data'),
                    href: '/schedule/schedule?tab=result',
                  },
                ]}
              />
              <Line
                classNames={showHeader ? 'hidden' : ''}
                orientation={showHeader ? 'horizontal' : 'vertical'}
              />
              <MenuDropdown
                menu={t('MainPage.HeaderMenu.information')}
                handleClick={handleMenuClick}
                showHeader={showHeader}
                items={[
                  {
                    menu: t('MainPage.InformationItem.announcement'),
                    href: '/announcement/announcement',
                  },
                  {
                    menu: t('MainPage.InformationItem.schedule'),
                    href: '/schedule/schedule',
                  },
                  {
                    menu: t('MainPage.InformationItem.news'),
                    href: '/information/news',
                  },
                  {
                    menu: t('MainPage.InformationItem.photo'),
                    href: '/information/photo',
                  },
                  {
                    menu: t('MainPage.InformationItem.video'),
                    href: '/information/video',
                  },
                ]}
              />
              <Line
                classNames={showHeader ? 'hidden' : ''}
                orientation={showHeader ? 'horizontal' : 'vertical'}
              />
              <MenuItem
                menu={t('MainPage.HeaderMenu.teams')}
                href="/teams"
                handleClick={handleMenuClick}
              />
              <Line
                classNames={showHeader ? 'hidden' : ''}
                orientation={showHeader ? 'horizontal' : 'vertical'}
              />
              <MenuDropdown
                menu={t('MainPage.HeaderMenu.mall')}
                handleClick={handleMenuClick}
                showHeader={showHeader}
                items={[
                  {
                    menu: t('MainPage.MallItem.tickets'),
                    onClick: () => window.open('https://www.fami.tw/2025TPVLWARMUPMATCH', '_blank'),
                  },
                  { menu: t('MainPage.MallItem.store'), href: '/coming-soon' },
                ]}
              />
              <Line
                classNames={showHeader ? 'hidden' : ''}
                orientation={showHeader ? 'horizontal' : 'vertical'}
              />
              <MenuDropdown
                menu={t('MainPage.HeaderMenu.about')}
                handleClick={handleMenuClick}
                showHeader={showHeader}
                items={[
                  {
                    menu: t('MainPage.AboutItem.about'),
                    href: '/about/about-the-league',
                  },
                  {
                    menu: t('MainPage.AboutItem.organization'),
                    href: '/coming-soon',
                  },
                  {
                    menu: t('MainPage.AboutItem.rule'),
                    href: '/coming-soon',
                  },
                  {
                    menu: t('MainPage.AboutItem.referee'),
                    subitems: [
                      {
                        menu: t('MainPage.RefereeItem.training'),
                        href: '/referee/referee-list-course',
                      },
                      {
                        menu: t('MainPage.RefereeItem.introduction'),
                        href: '/referee/referees-introduction',
                      },
                    ],
                    href: '',
                  },
                  {
                    menu: t('MainPage.AboutItem.contact'),
                    href: '/about/contact-us',
                  },
                ]}
              />
              <Line classNames="hidden" />
            </div>
          </div>
        </div>
        <div
          className={cx(
            'hidden lg:flex flex-row justify-end items-center text-[18px] z-10'
          )}
        >
          <div className="relative">
            <button
              ref={largeScreenLangButtonRef}
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Change language"
              className="flex items-center gap-2"
            >
              <FaEarthAsia
                className="w-6 h-6 text-white"
                style={{ stroke: 'currentColor', strokeWidth: 3 }}
              />
              <span className="flex items-center text-white text-[16px] whitespace-nowrap">
                <span className="underline">
                  {currentLang === 'EN' ? 'English' : '繁體中文'}
                </span>
                <Icon
                  icon="caret"
                  width={18}
                  height={18}
                  classNames={cx(
                    'text-white ml-2 transition-transform duration-500',
                    showLangMenu ? 'rotate-180' : ''
                  )}
                />
              </span>
            </button>
            {showLangMenu && (
              <div
                ref={largeScreenLangMenuRef}
                className="absolute top-full right-0 mt-2 bg-white text-white rounded shadow-lg"
              >
                <div className="flex flex-col p-2 text-[18px] text-black font-pingFang">
                  <span
                    className={`cursor-pointer py-2 ${currentLang === 'EN' ? 'font-bold' : 'text-orange-500'
                      }`}
                    onClick={() => changeLanguage('cn')}
                  >
                    繁體中文
                  </span>
                  <div className="w-full h-px bg-[#D9D9D9]"></div>
                  <span
                    className={`cursor-pointer py-2 ${currentLang === 'CN' ? 'font-bold' : 'text-orange-500'
                      }`}
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
