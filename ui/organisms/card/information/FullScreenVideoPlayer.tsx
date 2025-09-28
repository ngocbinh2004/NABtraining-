import React, { useEffect } from 'react'

interface FullScreenVideoPlayer {
  clickZoom?: boolean
  url: string
  description: string
  index?: number
}

const FullScreenVideoPlayer: React.FC<FullScreenVideoPlayer> = ({
  clickZoom = false,
  url,
  description,
  index,
}) => {

  useEffect(() => {
    let urlPlay = url
    const isYoutube = url?.includes('youtu.be') || url?.includes('youtube')
    const isFacebook = url?.includes('facebook.com') || url?.includes('fb.com')

    if (isYoutube) {
      const videoId = url.includes('embed')
        ? url.split(`/embed/`)[1]?.split('?')[0]
        : url.split('/').pop()

      urlPlay = `https://www.youtube.com/embed/${videoId}`
    } else if (isFacebook) {
      const srcMatch = description.match(/src="([^"]*)"/)
      if (srcMatch && srcMatch[1]) {
        const srcValue = srcMatch[1].trim()
        urlPlay = srcValue
      } else {
        console.log('Src attribute not found')
      }
    }

    const handleClick = (event: any) => {
      try {
        let isSupportFullscreenAPI = true
        const target = event.target
        if (!target.classList.contains(`element-index-${index}`)) {
          return
        }

        const iframe = document.createElement('iframe')
        iframe.setAttribute('width', '640')
        iframe.setAttribute('height', '360')
        iframe.setAttribute('src', urlPlay)
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('allowfullscreen', '')
        iframe.setAttribute(
          'allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;'
        )
        document.body.appendChild(iframe)

        if (iframe.requestFullscreen) {
          iframe.requestFullscreen().catch((err) => {
            console.error('Fullscreen request failed:', err)
          })
        } else if ((iframe as any).webkitRequestFullscreen) {
          ; (iframe as any).webkitRequestFullscreen().catch((err: any) => {
            console.error('Fullscreen request failed:', err)
          })
        } else {
          // is to support fullscreen for Safari/iOS
          isSupportFullscreenAPI = false
          iframe.setAttribute('width', '100%')
          iframe.setAttribute('height', window.innerHeight + 'px')
          iframe.style.position = 'fixed'
          iframe.style.top = '0'
          iframe.style.left = '0'
          iframe.style.zIndex = '50'
          iframe.style.border = 'none'

          const nextElement = document.getElementById('__next')
          if (nextElement) {
            nextElement.classList.add('hidden')
          }
        }

        const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                '*'
              )
              document.body.removeChild(iframe)
            }
          }
        }

        const handlePopState = () => {
          if (isSupportFullscreenAPI === false) {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
            }
          }
          const nextElement = document.getElementById('__next')
          if (nextElement) {
            nextElement.classList.remove('hidden')
          }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        window.addEventListener('popstate', handlePopState)

        return () => {
          document.removeEventListener(
            'fullscreenchange',
            handleFullscreenChange
          )
          window.removeEventListener('popstate', handlePopState)
        }
      } catch (err) {
        console.error('Error during handleClick:', err)
      }
    }

    const element = document.querySelector(`.element-index-${index}`)
    if (element) {
      element.addEventListener('click', handleClick)
    }

    return () => {
      if (element) {
        element.removeEventListener('click', handleClick)
      }
    }
  }, [description, url, index])
  return (
    <>
      {clickZoom && (
        <div
          className={`absolute inset-0 bg-white bg-opacity-0 element-index-${index} cursor-pointer`}
        ></div>
      )}
    </>
  )
}

export default FullScreenVideoPlayer
