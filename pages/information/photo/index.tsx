import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CardAlbum from '@/organisms/card/information/Album'
import CardEmpty from '@/organisms/card/information/CardEmpty'
import Image from '@/molecules/media/Image'
import Pagination from '@/molecules/Pagination'
import { Fragment } from 'react'
import { cx } from 'class-variance-authority'

// helpers
import { getAlbums } from 'helpers/api'
import { IAlbum } from 'interfaces/album_type'
import Title from '@/components/common/Title'

const PAGE_SIZE = 12

interface IProps {
  albums?: {
    data?: IAlbum[]
    total: number
  }
}

export default function Album({ albums }: IProps) {
  const router = useRouter()
  const { page = 1 } = router?.query
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

  const handleAlbumClick = (id: number) => {
    router.push(`/information/photo/album/${id}`)
  }

  const handlePageChange = (nextPage: number) => {
    router.push(`/information/photo?page=${nextPage}`)
  }

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
  }

  const sorteAlbum = albums?.data?.slice().sort((a, b) => {
    return sortOrder === 'newest'
      ? new Date(b.create_dt).getTime() - new Date(a.create_dt).getTime()
      : new Date(a.create_dt).getTime() - new Date(b.create_dt).getTime()
  })

  return (
    <div className="wl-home container mx-auto">
      <div className="flex justify-between items-center p-4 mt-4">
        <div className="flex items-center">
          <Title
            title_text={t('PhotoPage.title')}
            fallback="Photos"
            isMobile={isMobile}
          />
        </div>
        <div className="flex flex-row items-center">
          <h1 className="mr-2 text-white text-[16px]">
            {sortOrder === 'newest'
              ? t('PhotoPage.new_old')
              : t('PhotoPage.old_new')}
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
        {albums?.total && albums.total > 0 ? (
          <>
            <div className={cx(
              'w-full border border-white background-card boxBlurShadow flex justify-center ',
              isMobile ? ''
                : 'py-2 px-12',
            )}>
              <div className="flex flex-col items-center">
                <div className={cx(
                  'grid mt-[20px] mb-[20px]',
                  isMobile || isSmallScreen
                    ? 'grid-cols-1 gap-x-[20px] gap-y-[20px]'
                    : 'grid-cols-3 gap-x-[40px] gap-y-[40px]',
                )}>
                  {sorteAlbum?.map((album: IAlbum, index) => (
                    <Fragment key={album.id}>
                      <div
                        onClick={() => handleAlbumClick(album.id)}
                        className="cursor-pointer"
                      >
                        <CardAlbum album={album} />
                      </div>
                      {isMobile || isSmallScreen ? (
                        <                          >
                          {index < sorteAlbum.length - 1 && sorteAlbum.length > 1 && (
                            <div className={cx(
                              ' flex justify-center',
                            )}>
                              <div className="w-full h-[1px] bg-white"></div>
                            </div>
                          )}
                        </>
                      ) : (
                        <                          >
                          {(index + 1) % 3 === 0 && index < sorteAlbum.length - 1 && sorteAlbum.length > 3 && (
                            <div className={cx(
                              ' flex justify-center col-span-3',
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
                totalResult={albums?.total || 0}
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
    </div >
  )
}

export const getServerSideProps = async ({ query, locale }: { query?: { [key: string]: string }, locale: string }) => {
  const page = query?.page || 1
  const albums = await getAlbums(`?limit=${PAGE_SIZE}&page=${page}`)
  return {
    props: {
      albums: albums?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}