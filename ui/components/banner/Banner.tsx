import { useEffect, useState } from 'react'
import Image from '@/molecules/media/Image'
import { IBanner } from 'interfaces/banner_type'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { cx } from 'class-variance-authority'

interface BannerProps {
  banners: IBanner[]
}

export const Banner: React.FunctionComponent<BannerProps> = ({ banners }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0)
  const [currentBanner, setCurrentBanner] = useState<IBanner>(banners[0])
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

  const handleChangeCurrentBanner = (type: string) => {
    switch (type) {
      case 'next':
        currentBannerIndex < banners.length - 1
          ? setCurrentBannerIndex(currentBannerIndex + 1)
          : setCurrentBannerIndex(0)
        break
      case 'prev':
        currentBannerIndex > 0
          ? setCurrentBannerIndex(currentBannerIndex - 1)
          : setCurrentBannerIndex(banners.length - 1)
        break
      default:
        break
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex < banners.length - 1 ? prevIndex + 1 : 0
      )
    }, 5000) // 5 seconds

    return () => clearInterval(interval) // Clear interval on unmount
  }, [banners.length])

  useEffect(() => {
    if (banners.length > 0) {
      setCurrentBanner(banners[currentBannerIndex])
    }
  }, [currentBannerIndex, banners])

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full h-0 pb-[37.5%] relative">
        <Image
          url={currentBanner.image ?? ''}
          alt={currentBanner.name || 'Banner Image'}
          classNames="w-full h-0 pb-[37.5%]"
          quality={100}
        />
        {!isMobile && !isSmallScreen && (
          <div
            className="absolute left-[0%] w-[400px] h-0 pb-[20%] bg-no-repeat bg-contain opacity-60 z-[-1]"
            style={{ backgroundImage: "url('/assets/logo-behind.png')" }}
          ></div>
        )}
      </div>
      <div className={cx(
        'container mx-auto flex justify-end items-center px-2 py-1 p-3',
        isMobile ? '' : 'mt-4'
      )}>
        <div className="flex items-center mr-2">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`h-2 rounded-full mx-1.5 ${currentBannerIndex == index
                ? 'w-4 bg-[#087C4E]'
                : 'bg-[#BCBCBC] w-2'
                }`}
            />
          ))}
        </div>
        <button
          onClick={() => handleChangeCurrentBanner('prev')}
          className="bg-[#009919] p-1 w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center mr-3"
        >
          <IoChevronBack className="text-white" />
        </button>
        <button
          onClick={() => handleChangeCurrentBanner('next')}
          className="bg-[#009919] p-1 w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center"
        >
          <IoChevronForward className="text-white" />
        </button>
      </div>
    </div>
  )
}