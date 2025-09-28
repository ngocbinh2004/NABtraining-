
import { NextApiResponse } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'
// helpers
import { getNews } from 'helpers/api'
// var
import Text from '@/atoms/Text'
// constants
import { INews } from 'interfaces/news_type'
import { Image } from '@/molecules/media/Image'
import { useTranslation } from "next-i18next"
import { getYearMonthDay } from 'helpers/beautifyDate'
import CardNews from '@/organisms/card/information/News'
import { Fragment } from 'react'

interface Props {
  news: INews
  relatedNews: INews[]
}
export default function News({ news, relatedNews }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
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
    <div className="wl-home">
      <div className="container mx-auto">
        <div className="flex flex-col w-full p-4">
          <div className="flex items-center justify-center w-full mb-4 mt-12">
            <Image
              alt="Yellow Star"
              url="/assets/yellow_star.png"
              classNames="w-7 h-7 lg:w-8 lg:h-8 mr-2"
            />
            <p className="text-left w-full text-white text-2xl lg:text-[32px] font-bold">
              {news.title}
            </p>
          </div>
          {news.create_dt && (
            <Text
              size="unset"
              classNames={cx(
                'font-primary font-normal text-[18px] leading-[18px] text-white mt-1 text-left ml-10'
              )}
            >
              {getYearMonthDay(news.create_dt, router.locale)}
              {news.author && <> {'\u00A0'}[ {news.author} ]</>}
            </Text>
          )}
          <div className="w-full border border-white background-card boxBlurShadow px-6 py-4 flex justify-center mt-6">
            <div className="bg-transparent p-6">
              <div
                className="modify-content flex flex-col gap-4 text-[18px] break-words overflow-hidden text-white"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
                dangerouslySetInnerHTML={{ __html: news.content || '' }}
              />
            </div>
          </div>
          <div className="mt-2">

            <div className="flex items-center justify-start w-full mb-4 mt-12">
              <Image
                alt="Yellow Star"
                url="/assets/yellow_star.png"
                classNames="w-7 h-7 lg:w-8 lg:h-8 mr-2"
              />
              <h3 className="text-2xl font-bold text-white">{t('NewsDetails.related')}</h3>
            </div>
            <div className="w-full border border-white background-card boxBlurShadow flex justify-center mt-2 mb-6">
              <div className="w-full flex flex-col items-center px-16">
                <div
                  className={cx(
                    'w-full',
                    relatedNews && relatedNews.length > 0
                      ? 'grid mt-[20px] mb-[20px] ' +
                      (isMobile || isSmallScreen
                        ? 'grid-cols-1 gap-x-[20px] gap-y-[20px]'
                        : 'grid-cols-2 gap-x-[40px] gap-y-[40px]')
                      : 'flex justify-center items-center h-[150px]' // or your preferred height
                  )}
                >
                  {relatedNews && relatedNews.length > 0 ? (
                    relatedNews.map((n: INews, index) => (
                      <Fragment key={n.title}>
                        <CardNews
                          id={n.id}
                          url={n.url}
                          imageUrl={n.image}
                          title={n.title}
                          date={n.create_dt}
                        />
                        {/* Divider logic */}
                        {isMobile || isSmallScreen ? (
                          <>
                            {index < relatedNews.length - 1 && relatedNews.length > 1 && (
                              <div className="flex justify-center">
                                <div className="w-full h-[1px] bg-white"></div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {(index + 1) % 2 === 0 &&
                              index < relatedNews.length - 1 &&
                              relatedNews.length > 2 && (
                                <div className="flex justify-center col-span-2">
                                  <div className="w-full h-[1px] bg-white"></div>
                                </div>
                              )}
                          </>
                        )}
                      </Fragment>
                    ))
                  ) : (
                    <div className="text-white text-center text-xl">{t('ComingSoon.title')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export async function getServerSideProps({
  query,
  res,
  locale,
}: {
  query?: { [key: string]: string }
  res: NextApiResponse
  locale: string
}) {
  const newsId = query?.id
  const news = await getNews(`?id=${newsId}`)
  const newsItem: INews = news?.data?.data?.[0] || null
  const relatedResponse = await getNews(`?limit=5&page=1`)
  let relatedNews: INews[] = relatedResponse?.data?.data || []
  relatedNews = relatedNews.filter((item: INews) => item.id !== newsItem.id).slice(0, 4)
  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  return {
    props: {
      news: news?.data?.data?.[0] || null,
      relatedNews,
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}