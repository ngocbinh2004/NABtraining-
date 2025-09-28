import { cx } from 'class-variance-authority'

import Button from '@/atoms/Button'
import Image from '@/molecules/media/Image'
import { Ticket } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'
import Line from '@/atoms/Line'

interface Props {
  name?: string
  classNames?: string
  title: string
  url?: string
  contents?: { label: string; content: string }[]
  handleDelete: (...args: any) => any
  handlePay: (...args: any) => any
}

export default function CardUnpaid({
  name,
  title,
  url,
  classNames,
  contents,
  handleDelete,
  handlePay,
}: Props) {
  return (
    <CardWrapper
      classNames={cx(
        classNames,
        'wl-card-unpaid',
        'flex flex-col justify-between',
        'w-full'
      )}
      name={name}
    >
      <div className="wl-card-unpaid__content">
        <div className="wl-card-unpaid__title flex gap-2">
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
        <Line classNames="my-4" />
        <div className="wl-card-unpaid__content flex flex-col gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-11 w-full">
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

      <div className="wl-card-unpaid__footer flex justify-center gap-4 mt-4">
        <Button size="sm" type="secondary" onClick={handleDelete}>
          Delete
        </Button>

        <Button size="sm" type="primary" onClick={handlePay}>
          Pay
        </Button>
      </div>
    </CardWrapper>
  )
}
