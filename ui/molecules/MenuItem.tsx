import { useState, useEffect } from 'react'
import Text from '@/atoms/Text'
import Link from '@/atoms/Link'
import { cx } from 'class-variance-authority'

interface Props {
  menu: string
  href: string
  target?: string
  handleClick?: (...args: any) => any
}

export default function MenuItem({ href, menu, target, handleClick }: Props) {
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
    <div className={cx(
      'wl-menu flex',
      isMobile || isSmallScreen ? 'w-full justify-start items-start' : 'lg:max-w-[30%] justify-center items-center',
    )} onClick={handleClick}>
      <Link href={href} target={target}>
        <Text
          size="menu"
          classNames={cx(
            "text-white text-[16px]",
            isMobile || isSmallScreen ? "text-start" : "text-center"
          )}
        >
          {menu}
        </Text>
      </Link>
    </div>
  )
}
