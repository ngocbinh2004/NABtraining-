import { cx } from 'class-variance-authority'
import NextImage from 'next/image'
import Zoom from 'react-medium-image-zoom'

import 'react-medium-image-zoom/dist/styles.css'

interface Props {
  // defined size the on the className
  classNames?: string
  imageClassNames?: string
  alt: string
  url: string
  withShadow?: boolean
  isCircle?: boolean
  objectFit?: string
  quality?: number
  width?: number
  height?: number
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  return `${src}?w=${width}%&q=${quality || 85}`
}

export default function ImageComponent({
  withZoom,
  ...props
}: Props & { withZoom?: boolean }) {
  return withZoom ? <ImageWithZoom {...props} /> : <Image {...props} alt="" />
}

export function Image({
  classNames,
  imageClassNames,
  alt,
  url,
  isCircle,
  withShadow,
  quality,
  width,
  objectFit,
  height,
}: Props) {
  return (
    <div
      className={cx(
        'wl-image__wrapper relative',
        classNames,
        withShadow ? 'drop-shadow-media' : '',
        isCircle ? 'rounded-full overflow-hidden' : ''
      )}
      style={{
        width,
        height,
        minWidth: width ? width : height ? 'unset' : undefined,
        minHeight: height ? height : width ? 'unset' : undefined,
      }}
    >
      <NextImage
        alt={alt}
        src={url}
        loader={imageLoader}
        className={cx(
          objectFit ?? 'object-cover',
          isCircle ? 'circle' : '',
          imageClassNames
        )}
        quality={quality}
        width={width}
        height={height}
        fill={!width || !height}
        loading="lazy"
      />
    </div>
  )
}

export function ImageWithZoom(props: Props) {
  return (
    <Zoom>
      <Image {...props} alt="" />
    </Zoom>
  )
}
