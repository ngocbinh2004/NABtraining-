import { Fragment } from 'react'
import { cx } from 'class-variance-authority'
import { IAnnouncement } from 'interfaces/announcement_type'
import { useRouter } from 'next/router'
import { getYearMonthDay } from 'helpers/beautifyDate'
import Image from '@/molecules/media/Image'
import Text from '@/atoms/Text'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AnnouncementProps {
  announcements: IAnnouncement[] | undefined
  isFirstPage?: boolean
}

const Announcement: React.FC<AnnouncementProps> = ({
  announcements,
  isFirstPage = true,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
      setIsMediumScreen(window.innerWidth < 1440 && window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-full border border-white background-card boxBlurShadow px-6 py-4">
      {!announcements || announcements.length === 0 ? (
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/8 flex justify-end">
            <Image
              classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
              alt="star logo"
              url="/assets/yellow_star.png"
              imageClassNames="h-full rounded-t px-2 py-1"
              objectFit="object-contain"
            />
          </div>
          <div className="w-7/8">
            <Text
              size="unset"
              classNames="font-tertiary text-white text-center w-full text-[26px] leading-[30px] pt-[30px]"
            >
              {t('ComingSoon.title')}
            </Text>
          </div>
        </div>
      ) : (
        <div>
          {announcements.map((item, index) => (
            <Fragment key={index}>
              {isMobile && (
                <>
                  <div key={index} className="flex flex-col my-2 gap-2">
                    <Link
                      href={`/announcement/announcement-content?id=${item.id}&category=${item.category}`}
                      className="font-semibold text-lg text-white truncate flex-1 min-w-0"
                    >
                      {item.title}
                    </Link>
                    <div className="flex justify-between items-end w-full">
                      <div
                        className={cx(
                          'flex items-center w-[78px] h-[26px] p-1',
                          index === 0 && isFirstPage
                            ? 'bg-[#F3F3F3]'
                            : 'background-green'
                        )}
                      >
                        <Image
                          alt="logo"
                          url="/assets/yellow_star.png"
                          width={16}
                          height={20}
                          classNames="ml-1 mr-2"
                        />
                        <p
                          className={cx(
                            'font-normal text-sm category_mobile',
                            index === 0 && isFirstPage
                              ? 'text-[#212121]'
                              : 'text-white'
                          )}
                        >
                          {item.category}
                        </p>
                      </div>
                      <div className="flex items-center font-normal text-base text-white">
                        {getYearMonthDay(item.create_dt, router.locale)}
                      </div>
                    </div>
                    {announcements && index !== announcements.length - 1 && (
                      <hr className="w-full border border-[#D9D9D9] mt-2" />
                    )}
                  </div>
                </>
              )}
              {!isMobile && (
                <>
                  <div
                    key={index}
                    className="flex flex-wrap justify-between items-center my-6 mx-10 gap-6"
                  >
                    <div
                      className={cx(
                        'flex flex-row items-center flex-wrap',
                        isMediumScreen
                          ? 'w-[85%]'
                          : isSmallScreen
                            ? 'w-[82%]'
                            : 'w-[85%]'
                      )}
                    >
                      <div
                        className={cx(
                          'flex items-center flex-shrink-0 w-[112px] h-[40px] p-1 mr-2',
                          index === 0 && isFirstPage
                            ? 'bg-[#F3F3F3]'
                            : 'background-green'
                        )}
                      >
                        <Image
                          alt="logo"
                          url="/assets/yellow_star.png"
                          width={16}
                          height={20}
                          classNames="ml-1 mr-2"
                        />
                        <div
                          className={cx(
                            'flex items-center justify-center font-semibold text-base category_desktop',
                            index === 0 && isFirstPage
                              ? 'text-black'
                              : 'text-white'
                          )}
                        >
                          {item.category}
                        </div>
                      </div>
                      <Link
                        href={`/announcement/announcement-content?id=${item.id}&category=${item.category}`}
                        className="ml-2 font-semibold text-lg text-white truncate flex-1 min-w-0"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <div className="flex items-center font-normal text-lg text-white min-w-[100px] text-right">
                      {getYearMonthDay(item.create_dt, router.locale)}
                    </div>

                    {announcements && index !== announcements.length - 1 && (
                      <hr className="w-full border border-[#D9D9D9]" />
                    )}
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Announcement
