import { cx } from 'class-variance-authority'
import React, { useState, useEffect } from 'react'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface Props {
  classNames: string
  url: string
  title: string
  description: string
  specialVideo?: boolean
  autoPlay?: boolean
}

export default function Video({ title = '', classNames, url, description, specialVideo = false, autoPlay = false }: Props) {

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

  const height = specialVideo ? (
    isMobile
      ? '250px'
      : isSmallScreen
        ? '350px'
        : isMediumScreen
          ? '450px'
          : '675px'
  ) : '100%'


  const isYoutube = url?.includes('youtu.be') || url?.includes('youtube')
  const isFacebook = url?.includes('facebook.com') || url?.includes('fb.com')
  const autoplayUrl = url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`

  if (isFacebook) {
    return (
      <div className={cx('wl-video__wrapper relative', classNames)} dangerouslySetInnerHTML={{ __html: description }}>
      </div>
    )
  }

  if (isYoutube) {
    const videoId = url.includes('embed')
      ? url.split(`/embed/`)[1]?.split('?')[0]
      : url.split('/').pop()

    const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`

    return (
      <div className={cx('wl-video__wrapper relative', classNames)}>
        <iframe
          style={{ width: '100%', height: height }}
          src={youtubeUrl}
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <iframe
      className={cx('wl-video__wrapper relative', classNames)}
      title={title}
      src={autoPlay ? autoplayUrl : url}
      allow="autoplay; fullscreen"
      allowFullScreen
    ></iframe>
  )
}
