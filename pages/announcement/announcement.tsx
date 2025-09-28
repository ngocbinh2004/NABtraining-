import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/atoms/Icon'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Announcement from '@/components/announcement/Announcement'

import Pagination from '@/molecules/Pagination'

// helpers
import { getAnnouncement } from 'helpers/api'

import { IAnnouncement } from 'interfaces/announcement_type'
import Title from '@/components/common/Title'

const PAGE_SIZE = 10

interface IProps {
  announcements?: {
    data?: IAnnouncement[]
    total: number
  }
}

export default function AnnouncementOverview({ announcements }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { page = 1 } = router?.query
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
    <div className="wl-home">
      <div className="container mx-auto">
        <div className="flex justify-center p-4">
          <div className="w-full">
            <div className="flex justify-start items-center mt-4 mb-1 lg:mb-6">
              <Title
                title_text={t('MainPage.Announcement.announcement_title')}
                fallback="Announcement"
                isMobile={isMobile}
                />
            </div>

            {announcements && (
              <Announcement
                announcements={announcements.data}
                isFirstPage={Number(page) === 1}
              />
            )}
            {(announcements?.data?.length ?? 0) > 0 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  isMobile={isMobile}
                  size={PAGE_SIZE}
                  totalResult={announcements?.total ?? 0}
                  page={+page}
                  handleChange={(nextPage) =>
                    router.push(`/announcement/announcement?page=${nextPage}`)
                  }
                />
              </div>
            )}
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
  const page = query?.page || 1
  const announcements = await getAnnouncement(
    `?limit=${PAGE_SIZE}&page=${page}`
  )
  return {
    props: {
      announcements: announcements?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
