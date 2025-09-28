import { cx } from 'class-variance-authority'

import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import { Ticket } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'

interface Props {
  name?: string
  classNames?: string
  title: string
  qrUrl?: string
  url?: string
  contents?: { label: string; content: string }[]
  isSent?: boolean
  handleSendEmail?: (...args: any) => any
}

export default function CardPurchase({
  name,
  title,
  url,
  qrUrl,
  classNames,
  contents,
  isSent,
  handleSendEmail,
}: Props) {
  return (
    <CardWrapper
      classNames={cx(
        classNames,
        'wl-card-purchase',
        'flex flex-col md:flex-row gap-8',
        'w-full'
      )}
      name={name}
    >
      <div className="wl-card-purchase__left flex flex-col items-center gap-4">
        {qrUrl ? (
          <Image width={168} height={157} alt={title} url={qrUrl} withZoom />
        ) : (
          <div className="w-[168px] h-[157px]"></div>
        )}
        {!isSent && handleSendEmail && (
          <Button size="sm" type="primary" onClick={handleSendEmail}>
            Send to Email
          </Button>
        )}
      </div>
      <div className="wl-card-purchase__content">
        <div className="wl-card-purchase__title flex gap-2">
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
          <Ticket.LabelTitle title={title} />
        </div>
        <div className="wl-card-purchase__content flex flex-col gap-4 items-center mt-4">
          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-2 md:gap-11">
            {contents?.length &&
              contents?.length > 0 &&
              contents.map(({ label, content }) => (
                <Ticket.LabelContent
                  key={label}
                  label={label}
                  content={content}
                />
              ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}
