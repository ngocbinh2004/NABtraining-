import Link from 'next/link'
import clsx from 'clsx'
import { INews } from 'interfaces/news_type'
import Image from 'next/image'
import CardEmptyNews from '@/organisms/card/information/CardEmpty'

interface NewsProps {
  featuredNews: INews[] | undefined
  news: INews[] | undefined
  isMobile: boolean
}

export default function NewsHome({ featuredNews, news, isMobile }: NewsProps) {
  const hasFeaturedNews = featuredNews && featuredNews.length > 0
  const hasNews = news && news.length > 0

  const handleClick = (e: React.MouseEvent, url?: string, id?: number) => {
    e.preventDefault()
    if (url && url.length > 0) {
      window.open(url, '_blank')
    } else if (id) {
      window.location.href = `/information/news/${id}`
    }
  };

  return (
    <div
      className={clsx('grid gap-2 items-start', {
        'grid-cols-1': isMobile,
        'grid-cols-[36%_auto]': !isMobile,
      })}
    >
      {hasFeaturedNews ? (
        <div
          onClick={(e) => handleClick(e, featuredNews?.[0]?.url, featuredNews?.[0]?.id)}
          className="relative bg-white flex h-full min-h-[264px] items-end justify-center pb-4 cursor-pointer"
          style={{
            backgroundImage: `url('${featuredNews?.[0]?.image?.replace(/#/g, '%23') ?? ''}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 'auto',
          }}
        >
          <div className="text-lg font-bold text-white bg-black bg-opacity-50 p-2">
            {featuredNews?.[0]?.title}
          </div>
        </div>
      ) : (
        <CardEmptyNews />
      )}
      <div
        className={clsx(
          'relative bg-white flex flex-col h-auto min-h-[264px]',
          !isMobile ? 'ml-5' : 'mt-5',
          hasNews ? 'items-start justify-start' : 'items-center justify-center'
        )}
      >
        {hasNews ? (
          <div className="w-full mt-3 absolute">
            {news.slice(0, 4).map((item, index) => (
              <div key={item.id} className="flex flex-col ml-6 mr-6">
                <div className="flex items-center py-2">
                  <Image
                    alt="Yellow Star"
                    src="/assets/yellow_star.png"
                    width={21}
                    height={24}
                    className="mr-2"
                  />
                  <span
                    onClick={(e) => handleClick(e, item.url, item.id)}
                    className="cursor-pointer font-bold font-sans text-base hover:text-blue-500 transition-colors truncate w-full block break-words"
                    style={{
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                {index < news.length - 1 && <hr className="border-t border-gray-300 my-2" />}
              </div>
            ))}
          </div>
        ) : (
          <CardEmptyNews />
        )}
      </div>
    </div>
  )
}