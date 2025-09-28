import { cx } from 'class-variance-authority'

import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import { Account } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'
import Line from '@/atoms/Line'

interface Props {
  name?: string
  classNames?: string
  gridClassNames?: string
  title: string
  url?: string
  contents?: {
    label: string
    content: string
    isSmall?: boolean
    isHoverable?: boolean
    hoverableText?: string
  }[]
  onClick: (...args: any) => any
  buttonText: string
}

export default function CardEditAccount({
  name,
  title,
  url,
  classNames,
  contents,
  gridClassNames,
  onClick,
  buttonText,
}: Props) {
  return (
    <CardWrapper
      classNames={cx(
        classNames,
        'wl-card-edit-account',
        'flex flex-col justify-between',
        'w-full'
      )}
      name={name}
    >
      <div className="wl-card-edit-account__content">
        <div className="wl-card-edit-account__title flex gap-2">
          {url && (
            <Image
              withShadow
              width={32}
              height={32}
              alt={title}
              url={url}
              isCircle
              withZoom
            />
          )}
          <Account.LabelTitle title={title} />
        </div>
        <Line classNames="my-4" />
        <div className={gridClassNames}>
          {contents?.length &&
            contents?.length > 0 &&
            contents.map(
              ({ label, content, isSmall, isHoverable, hoverableText }) => (
                <Account.LabelContent
                  key={label}
                  label={label}
                  content={content}
                  isSmall={isSmall}
                  isHoverable={isHoverable}
                  hoverableText={hoverableText}
                />
              )
            )}
        </div>
      </div>
      <div className="wl-card-edit-account__footer flex justify-center mt-4">
        <Button size="sm" type="primary" onClick={onClick}>
          {buttonText}
        </Button>
      </div>
    </CardWrapper>
  )
}
