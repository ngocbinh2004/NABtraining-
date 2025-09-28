import React, { useState, useEffect, Fragment } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CardVideo from '@/organisms/card/information/Video'
import CardEmpty from '@/organisms/card/information/CardEmpty'
import Video from '@/molecules/media/Video'
import Image from '@/molecules/media/Image'
import Pagination from '@/molecules/Pagination'
import { cx } from 'class-variance-authority'

// helpers
import { getVideos } from 'helpers/api'
import { IVideo } from 'interfaces/video_type'
import Title from '@/components/common/Title'

const PAGE_SIZE = 12

interface IProps {
  videos?: {
    data?: IVideo[]
    total: number
  }
}

export default function VideoOverview({ videos }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { page = 1 } = router?.query
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
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

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
  }

  const sortedVideos = videos?.data?.slice().sort((a, b) => {
    return sortOrder === 'newest'
      ? new Date(b.create_dt).getTime() - new Date(a.create_dt).getTime()
      : new Date(a.create_dt).getTime() - new Date(b.create_dt).getTime()
  })

  const modifiedVideos = sortedVideos?.map((video: IVideo) => {
    let modifiedDesc = video.description
    if (modifiedDesc) {
      modifiedDesc = modifiedDesc.replace(/width="\d+"/g, 'width="100%"')
      modifiedDesc = modifiedDesc.replace(/height="\d+"/g, 'height="211"')
    }
    return { ...video, description: modifiedDesc }
  })

  return (
    <>
      <div className="wl-home container mx-auto">
        <div className="flex justify-between items-center p-4 mt-4">
          <div className="flex items-center">
            <Title
              title_text={t('VideoPage.title')}
              fallback="Videos"
              isMobile={isMobile}
            />
          </div>
          <div className="flex flex-row items-center">
            <h1 className="mr-2 text-white text-[16px]">
              {sortOrder === 'newest'
                ? t('VideoPage.new_old')
                : t('VideoPage.old_new')}
            </h1>
            <div onClick={handleSortToggle} className="cursor-pointer">
              <Image
                url="/assets/filter.png"
                alt="filter icon"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
        <div className='p-4 mb-4'>
          {videos?.total && videos.total > 0 ? (
            <>
              <div className="w-full border border-white background-card boxBlurShadow flex justify-center px-4 lg:px-16">
                <div className="w-full flex flex-col items-center">
                  <div
                    className={cx(
                      'w-full grid',
                      isMobile || isSmallScreen
                        ? 'my-6 mx-0 grid-cols-1 gap-x-5 gap-y-5'
                        : 'my-8 grid-cols-3 gap-x-10 gap-y-10',
                    )}
                  >
                    {modifiedVideos?.map((video, index) => (
                      <Fragment key={index}>
                        <CardVideo
                          key={video.name}
                          video={video}
                          noShadow
                          clickZoom
                          index={index}
                        />
                        {isMobile || isSmallScreen ? (
                          <>
                            {index < modifiedVideos.length - 1 &&
                              modifiedVideos.length > 1 && (
                                <div className="flex justify-center col-span-1">
                                  <div className="w-full h-[1px] bg-white"></div>
                                </div>
                              )}
                          </>
                        ) : (
                          <>
                            {(index + 1) % 3 === 0 &&
                              index < modifiedVideos.length - 1 &&
                              modifiedVideos.length > 3 && (
                                <div className="flex justify-center col-span-3">
                                  <div className="w-full h-[1px] bg-white"></div>
                                </div>
                              )}
                          </>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <Pagination
                  isMobile={isMobile}
                  size={PAGE_SIZE}
                  totalResult={videos?.total || 0}
                  page={+page}
                  handleChange={(nextPage) =>
                    router.push(`/information/video?page=${nextPage}`)
                  }
                />
              </div>
            </>
          ) : (
            <div className="w-full border border-white background-card boxBlurShadow px-6 py-4">
              <CardEmpty />
            </div>
          )}
        </div>
      </div>
    </>
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
  const videos = await getVideos(`?limit=${PAGE_SIZE}&page=${page}`)
  return {
    props: {
      videos: videos?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
