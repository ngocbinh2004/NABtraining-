import React, { useState, useEffect } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import Image from '@/molecules/media/Image'
import { INews } from 'interfaces/news_type'
import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'

interface ImageSliderProps {
  images: INews[] | undefined
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const router = useRouter()

  const handleImageClick = () => {
    if (currentImage.url) {
      window.open(currentImage.url, '_blank') // or use router.push(currentImage.url) for internal routes
    } else if (currentImage.id) {
      router.push(`/information/news/${currentImage.id}`)
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  const currentImage = images[currentImageIndex];

  const handleChangeCurrentBanner = (type: string) => {
    switch (type) {
      case 'next':
        setCurrentImageIndex((prevIndex) =>
          prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case 'prev':
        setCurrentImageIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : images.length - 1
        );
        break;
      default:
        break;
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className={cx(
          'w-full h-0 relative cursor-pointer',
          isMobile ? 'pb-[134%]' : 'pb-[37.5%]'
        )}
        onClick={handleImageClick}
      >
        <Image
          url={currentImage.image ?? ''}
          alt="News Image"
          classNames={cx(
            'w-full h-0',
            isMobile ? 'pb-[134%]' : 'pb-[37.5%]'
          )}
          quality={100}
        />
      </div>
      <div className="container mx-auto flex justify-end items-center px-2 py-1 p-3">
        <div className="flex items-center mr-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full mx-1.5 ${currentImageIndex === index
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

export default ImageSlider
