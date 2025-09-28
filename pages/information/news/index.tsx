import type { NextApiResponse, NextApiRequest } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'
import { cx } from 'class-variance-authority'
// helpers
import { getNews } from 'helpers/api'
// ui
import CardNews from '@/organisms/card/information/News'
import Pagination from '@/molecules/Pagination'

import Image from '@/molecules/media/Image'
import CardEmpty from '@/organisms/card/information/CardEmpty'
import ImageSlider from '@/components/news/ImageSlider'
// constants
import { INews } from 'interfaces/news_type'
import { useEffect, useState } from 'react'
import Title from '@/components/common/Title'

const PAGE_SIZE = 12

interface IProps {
  news?: {
    data?: INews[]
    total: number
  }
  total: number
  images?: INews[]
}

export default function News({ news, images }: IProps) {
  const router = useRouter()
  const { page = 1 } = router?.query
  const [currentNews, setCurrentNews] = useState<INews[]>([])
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const { t } = useTranslation()

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

  const handlePageChange = (nextPage: number) => {
    setCurrentNews([])
    router.push(`/information/news?page=${nextPage}`)
  }

  useEffect(() => {
    const setNews = () => {
      setCurrentNews(news?.data || [])
    }
    setNews()
  }, [news])

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
  }

  const sortedNews = news?.data?.slice().sort((a, b) => {
    return sortOrder === 'newest'
      ? new Date(b.create_dt).getTime() - new Date(a.create_dt).getTime()
      : new Date(a.create_dt).getTime() - new Date(b.create_dt).getTime()
  })

  return (
    <>
      {images && images.length > 0 && <ImageSlider images={images} />}
      <div className="wl-home container mx-auto">
        <div className={cx(
          'flex justify-between items-center p-4',
          images && images.length > 0 ? ' ' : 'mt-4',
        )}>
          <div className="flex items-center">
            <Title
              title_text={t('NewsPage.title')}
              fallback="News"
              isMobile={isMobile}
            />
          </div>
          <div className="flex flex-row items-center">
            <h1 className="mr-2 text-white text-[16px]">
              {sortOrder === 'newest'
                ? t('NewsPage.new_old')
                : t('NewsPage.old_new')}
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
          {currentNews && currentNews.length > 0 ? (
            <>
              <div className="w-full border border-white background-card boxBlurShadow flex justify-center px-6 py-4">
                <div className="flex flex-col items-center">
                  <div className={cx(
                    'grid  mt-[20px] mb-[20px]',
                    isMobile || isSmallScreen ? 'grid-cols-1 gap-x-[20px] gap-y-[20px]' : 'grid-cols-2 gap-x-[40px] gap-y-[40px]',
                  )}>
                    {sortedNews?.map((n: INews, index) => (
                      <Fragment key={n.title}>
                        <CardNews
                          id={n.id}
                          url={n.url}
                          imageUrl={n.image}
                          title={n.title}
                          date={n.create_dt}
                        />
                        {isMobile || isSmallScreen ? (
                          <                          >
                            {index < sortedNews.length - 1 && sortedNews.length > 1 && (
                              <div className={cx(
                                ' flex justify-center',
                              )}>
                                <div className="w-full h-[1px] bg-white"></div>
                              </div>
                            )}
                          </>
                        ) : (
                          <                          >
                            {(index + 1) % 2 === 0 && index < sortedNews.length - 1 && sortedNews.length > 2 && (
                              <div className={cx(
                                ' flex justify-center col-span-2',
                              )}>
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
                  totalResult={news?.total || 0}
                  size={PAGE_SIZE}
                  page={+page}
                  handleChange={(nextPage) => handlePageChange(nextPage)}
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
  res,
  query,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const page = query?.page || 1
  const news = await getNews(`?limit=${PAGE_SIZE}&page=${page}`)
  const images = await getNews(`?type=FEATURED`)

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      news: news?.data,
      images: images?.data?.data,
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
