import { cx } from 'class-variance-authority'

import Button from '@/atoms/Button'
import { Ticket } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'
import Line from '@/atoms/Line'

interface Props {
  name?: string
  classNames?: string
  contents?: { label: string; content: string }[]
  handleBuy: (...args: any) => any
  handleDelete?: (...args: any) => any
  handleAddFavorite?: (...args: any) => any
}

export default function CardBuyNow({
  name,
  classNames,
  contents,
  handleBuy,
  handleDelete,
  handleAddFavorite,
}: Props) {
  return (
    <CardWrapper classNames={cx(classNames, 'w-full md:w-fit')} name={name}>
      {name && (
        <div className="flex flex-col">
          <Ticket.LabelTitle title={`${name}`} />
          <Line classNames="my-4" />
        </div>
      )}
      <div className="wl-card-buy-now flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-11">
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
        <div className="flex gap-2">
          {handleDelete && (
            <Button size="sm" type="ghost" onClick={handleDelete}>
              Remove
            </Button>
          )}
          {handleAddFavorite && (
            <Button size="sm" type="ghost" onClick={handleAddFavorite}>
              Add to Favorite
            </Button>
          )}
          <Button size="sm" type="primary" onClick={handleBuy}>
            Buy Now
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}
