import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/atoms/Icon'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OtherAnnouncement from '@/components/announcement/OtherAnnouncement'

// helpers
import { getAnnouncement } from 'helpers/api'

import { IAnnouncement } from 'interfaces/announcement_type'

interface IProps {
  announcement?: IAnnouncement
  otherAnnouncements?: IAnnouncement[]
}

export default function AnnouncementContent({
  announcement,
  otherAnnouncements,
}: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!hasMounted) return null // prevent hydration mismatch

  return (
    <div className="wl-home">
      <div className="container mx-auto">
        <div className="flex justify-center p-4">
          <div className="w-full">
            <div className="flex items-center mt-4">
              <div className="flex items-center justify-center h-full">
                <Icon
                  icon="referee-icon"
                  height={isMobile ? 18 : 32}
                  width={isMobile ? 18 : 32}
                  classNames="shrink-0"
                />
              </div>
              <p className="font-semibold text-white text-2xl lg:text-[28px] ml-2 my-4">
                {announcement?.title}
              </p>
            </div>

            <div
              className="w-full modify-content border border-white background-card boxBlurShadow text-white text-justify font-normal text-base lg:text-lg mt-0.75 lg:mt-1 p-6 lg:px-14 lg:py-6 break-words overflow-hidden"
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {announcement && (
                <p
                  dangerouslySetInnerHTML={{ __html: announcement.contents }}
                />
              )}
            </div>
            <div className="flex justify-start items-center mt-4">
              <Icon
                icon="referee-icon"
                height={isMobile ? 18 : 32}
                width={isMobile ? 18 : 32}
              />
              <p className="font-semibold text-white text-2xl lg:text-[28px] ml-2 my-4">
                {t('MainPage.Announcement.other_announcements')}
              </p>
            </div>
            <OtherAnnouncement
              isHorizontal={isMobile || isSmallScreen}
              announcements={otherAnnouncements || []}
            />
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
  const id = query?.id
  const category = query?.category

  const announcement = await getAnnouncement(`?id=${id}`)
  const relatedResponse = await getAnnouncement(`?category=${category}`)
  let otherAnnouncements: IAnnouncement[] = relatedResponse?.data?.data || []
  otherAnnouncements = otherAnnouncements
    .filter((item: IAnnouncement) => item.id !== Number(id))
    .slice(0, 3)
  return {
    props: {
      announcement: announcement?.data.data[0],
      otherAnnouncements,
      ...(await serverSideTranslations(locale)),
    },
  }
}
