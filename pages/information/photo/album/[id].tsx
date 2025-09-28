import { getAlbums, getPhotos } from 'helpers/api'
import { IAlbum } from 'interfaces/album_type'
import { IPhoto } from 'interfaces/photo_type'
import { GetServerSidePropsContext, NextApiResponse } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Image, ImageWithZoom } from '@/molecules/media/Image'
import { cx } from 'class-variance-authority'
import { useState, useEffect } from 'react'
import { Fragment } from 'react'

interface Props {
  albumPhoto: IPhoto[]
  albumOverview: IAlbum[]
}


const PhotoDetails = ({ albumPhoto, albumOverview }: Props) => {
  const [currentAlbumPhoto, setCurrentAlbumPhoto] = useState<IPhoto[] | null>(
    albumPhoto
  )
  const [currentAlbum, setCurrentAlbum] = useState<IAlbum[]>(albumOverview)
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
    <div className="wl-home container mx-auto">
      <div className="flex justify-between items-center p-4 mt-4">
        <div className="flex items-center justify-center w-full mb-4 mt-4">
          <Image
            alt="Yellow Star"
            url="/assets/yellow_star.png"
            classNames="w-7 h-7 lg:w-8 lg:h-8 mr-2"
          />
          <p className="text-left w-full text-white text-2xl lg:text-[32px] font-bold">
            {currentAlbum[0].name}
          </p>
        </div>
      </div>
      <div className={cx(
        'w-full border border-white background-card boxBlurShadow flex justify-center mt-4 mb-8',
        isMobile ? ''
          : 'py-2 px-12',
      )}>
        <div className={cx(
          'grid mt-[20px] mb-[20px]',
          isMobile
            ? 'grid-cols-1 gap-x-[20px] gap-y-[20px]'
            : isSmallScreen ? 'grid-cols-2 gap-x-[20px] gap-y-[20px]'
              : isMediumScreen ? 'grid-cols-3 gap-x-[20px] gap-y-[20px]'
                : 'grid-cols-4 gap-x-[40px] gap-y-[40px]',
        )}>
          {currentAlbumPhoto?.map((photo: IPhoto, index) => (
            <Fragment key={photo.id}>
              <ImageWithZoom
                url={photo.image}
                alt={photo.name}
                classNames={cx(
                  isMobile ? 'w-[280px] h-[180px]'
                    : isMediumScreen ? 'w-[270px] h-[211px]' : 'w-[244px] h-[180px]',
                )}
                quality={100}
              />
              {isMobile ? (
                <                          >
                  {index < currentAlbumPhoto.length - 1 && currentAlbumPhoto.length > 1 && (
                    <div className={cx(
                      ' flex justify-center',
                    )}>
                      <div className="w-full h-[1px] bg-white"></div>
                    </div>
                  )}
                </>
              ) : isSmallScreen ? (
                <                          >
                  {(index + 1) % 2 === 0 && index < currentAlbumPhoto.length - 1 && currentAlbumPhoto.length > 2 && (
                    <div className={cx(
                      ' flex justify-center col-span-2',
                    )}>
                      <div className="w-full h-[1px] bg-white"></div>
                    </div>
                  )}
                </>
              ) : isMediumScreen ? (
                <                          >
                  {(index + 1) % 3 === 0 && index < currentAlbumPhoto.length - 1 && currentAlbumPhoto.length > 3 && (
                    <div className={cx(
                      ' flex justify-center col-span-3',
                    )}>
                      <div className="w-full h-[1px] bg-white"></div>
                    </div>
                  )}
                </>
              ) : (
                <                          >
                  {(index + 1) % 4 === 0 && index < currentAlbumPhoto.length - 1 && currentAlbumPhoto.length > 4 && (
                    <div className={cx(
                      ' flex justify-center col-span-4',
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
    </div >
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, res, locale } = context
  const id = params?.id || null

  const albumPhoto = await getPhotos(`?album_id=${id}`)
  const albumOverview = await getAlbums(`?id=${id}`)

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      albumPhoto: albumPhoto?.data?.data || [],
      albumOverview: albumOverview?.data?.data || {},
      ...(await serverSideTranslations(locale || 'en', ['langs']))
    }
  }
}

export default PhotoDetails
