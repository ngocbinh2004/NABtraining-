import { useState, useEffect, useRef } from 'react'
import { cx } from 'class-variance-authority'

import Text from '@/atoms/Text'
import Link from '@/atoms/Link'
import Icon from '@/atoms/Icon'

interface Props {
  menu: string
  handleClick?: (...args: any) => any
  showHeader?: boolean
  items: {
    menu: string
    href?: string
    onClick?: () => void
    subitems?: {
      menu: string
      href: string
    }[]
  }[]
}

export default function MenuDropdown({
  menu,
  items,
  handleClick,
  showHeader = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isHover, setIsHover] = useState(false)
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

  useEffect(() => {
    if (showHeader === false) {
      setIsOpen(false)
      setOpenSubmenu(null)
    }
  }, [showHeader])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLInputElement>(null)

  const toggleDropdown = () => setIsOpen((open) => !open)

  const handleSubmenuClick = (submenu: string) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu)
  }

  const handleMouseEnter = (item: { menu: string }) => {
    if (!isMobile && !isSmallScreen) {
      setOpenSubmenu(item.menu) // Open the submenu on hover (only on desktop)
      setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && !isSmallScreen) {
      setIsHover(false)
      setOpenSubmenu(null)
    }
  }

  const handleClickItem = (item: { menu: string, href?: string; onClick?: () => void; subitems?: any[] }, closeDropdown: boolean = true) => {
    if (item.subitems) {
      setOpenSubmenu(openSubmenu === item.menu ? null : item.menu)
    } else {
      // Fix: Close dropdown if no subitems and navigate to the link
      if (item.onClick) {
        item.onClick()
      } else if (handleClick) handleClick()
      setIsOpen(false)
      setOpenSubmenu(null)
    }
  }

  useEffect(() => {
    const handleHideDropdown = (ev: MouseEvent) => {
      const target = ev.target as Element
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false)
        setOpenSubmenu(null)
      }
    }

    document.addEventListener('click', handleHideDropdown)
    return () => {
      document.removeEventListener('click', handleHideDropdown)
    }
  }, [])

  return (
    <div
      className={cx(
        'wl-menu__wrapper wl-menu--has-dropdown',
        'flex flex-col lg:flex-row',
        'lg:relative',
      )}
      ref={dropdownRef}
    >
      <div
        className={cx(
          'flex gap-2 wl-menu lg:w-auto',
          isMobile || isSmallScreen ? 'w-[320px] justify-start items-start' : 'w-full',
        )}
        role="button"
        onClick={toggleDropdown}
      >
        <Text
          size="menu"
          classNames={cx(
            "text-white text-[16px]",
            isMobile || isSmallScreen ? "text-left" : ""
          )}
        >
          {menu}
        </Text>
        <Icon
          icon="caret"
          width={18}
          height={18}
          classNames={cx(
            'text-white ml-0.2 transition-transform duration-500',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </div>
      <div
        className={cx(
          isOpen ? 'block' : 'hidden',
          'w-[320px] lg:w-[240px]',
          'lg:absolute lg:top-[43px] lg:mt-0',
          isMobile || isSmallScreen ? 'pl-[20px] pr-[20px]' : ''
        )}
      >
        <ul
          className={cx('w-full flex flex-col')}
        >
          {items.length > 0 &&
            items.map((item) => (
              <li key={item.menu}>
                <div
                  className={cx(
                    !isMobile && !isSmallScreen ? 'border-b border-[#002116]' : ''
                  )}
                  role="button"
                  onClick={() =>
                    item.subitems
                      ? handleSubmenuClick(item.menu)
                      : handleClickItem(item)
                  }
                  onMouseEnter={() => item.subitems && handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.subitems ? '#' : item.href || ''}
                    classNames={cx(
                      'flex items-center justify-between',
                      'min-h-[52px] pl-[20px] pr-[20px]',
                      isMobile || isSmallScreen ? 'bg-[#002116] text-white' : 'bg-white text-black hover:bg-[#009465] hover:text-white',
                      openSubmenu === item.menu && !isMobile && !isSmallScreen
                        ? 'text-[#004f36] hover:text-white'
                        : ''
                    )}
                  >
                    <Text
                      size="menu"
                      classNames={cx(
                        'text-center',
                        openSubmenu === item.menu && !isMobile && !isSmallScreen
                          ? 'font-bold text-[19px]'
                          : 'text-[16px]'
                      )}
                    >
                      {item.menu}
                    </Text>
                    {item.subitems && (
                      <Icon
                        icon="caret"
                        width={18}
                        height={18}
                        classNames={cx(
                          'text-white ml-0.2 transition-transform duration-500 lg:hidden',
                          openSubmenu === item.menu ? 'rotate-180' : ''
                        )}
                      />
                    )}
                  </Link>
                  {item.subitems && (
                    <ul
                      className={cx(
                        'w-full lg:w-[240px]',
                        'lg:absolute lg:left-full lg:-mt-[52px]',
                        openSubmenu === item.menu || isHover
                          ? 'lg:block'
                          : 'hidden',
                        isMobile || isSmallScreen ? 'flex flex-col pl-[20px] pr-[20px]' : ''
                      )}
                    >
                      {item.subitems.map((subitem) => (
                        <li key={subitem.menu}>
                          <div
                            role="button"
                            onClick={() => handleClickItem(subitem, false)}
                            className={cx(
                              !isMobile && !isSmallScreen ? 'border-b border-[#002116]' : ''
                            )}>
                            <Link
                              href={subitem.href}
                              classNames={cx(
                                'flex items-center',
                                'min-h-[52px] pl-[20px] pr-[20px]',
                                isMobile || isSmallScreen ? 'bg-[#002116] text-white' : 'bg-white text-black hover:bg-[#009465] hover:text-white',
                              )}
                            >
                              <Text
                                size="menu"
                                classNames=" text-center text-[16px]"
                              >
                                {subitem.menu}
                              </Text>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
