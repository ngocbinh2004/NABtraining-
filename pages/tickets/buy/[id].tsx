import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

// hooks
import { useTickets } from 'hooks/useTickets'
// helpers
import { beautifyDate } from 'helpers/beautifyDate'
export { getServerSideProps } from 'helpers/loginGetServerSideProps'
// import { splitName } from 'helpers/splitName'
import { POST_NEW as POST } from 'helpers/ssrRequest'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import { BuyTicketLabelContent } from '@/molecules/card/LabelContent'
import InputNumber from '@/molecules/form/InputNumber'
import Image from '@/molecules/media/Image'
import { ModalOk } from '@/organisms/Modal'
import { RecordRanking, TitleLeft } from '@/components/PageTitle'

interface Props {}

// @TODO: from event
export default function BuyTicket({}: Props) {
  const { query, push } = useRouter()
  const ticketId = query?.id

  const [ticketNumber, setTicketNumber] = useState()
  const [showModalError, setShowModalError] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const { mutate: mutateAddToCart, isLoading: isBuyLoading } = useMutation({
    mutationFn: () => {
      return POST('cart', {
        ticket_id: +`${ticketId}`,
        // @TODO: add quantity
        // quantity: ticketNumber,
      })
    },
    onSuccess: (_response: any) => {
      toast('Ticket added to cart')
      push('/tickets/buy/payment')
    },
    onError: (error: any) => {
      setMessage(error?.message || error || 'Something went wrong')
      setShowModalError(true)
    },
  })

  const { data: ticket, isSuccess: isTicketSuccess } = useTickets(
    `id=${ticketId}`,
    !!ticketId
  )

  const ticketDetail = ticket?.data?.[0]
  // const [team1FirstName, team1LastName] = splitName(
  //   ticketDetail?.match?.team1?.name
  // )
  // const [team2FirstName, team2LastName] = splitName(
  //   ticketDetail?.match?.team2?.name
  // )

  if (!ticketId) return null
  if (!ticketDetail) return null

  return (
    <div className="wl-tickets-buy container mx-auto mt-[47px] flex flex-col justify-start gap-10">
      <ModalOk
        showModal={showModalError}
        title="Failed to book ticket"
        message={message}
        labelOk="OK"
        handleCloseModal={() => setShowModalError(false)}
      />
      <TitleLeft name="tickets-buy">
        Please check your ticket
        <br />
        purchase information.
      </TitleLeft>
      <RecordRanking
        image={ticketDetail?.events?.image}
        eventName={ticketDetail?.events?.name}
        title={ticketDetail?.match?.name}
      />
      <Line />
      {isTicketSuccess && (
        <>
          {/* <div className="wl-tickets-buy__content flex flex-col md:flex-row gap-10 md:gap-20 justify-center">
            <div className="wl-tickets-buy__team flex gap-6">
              <Image
                url={ticketDetail?.match?.team1?.logo}
                isCircle
                height={99}
                width={99}
                alt="team1"
                withZoom
              />
              <div className="flex flex-col justify-center">
                {team1LastName && (
                  <Text size="body4" classNames="text-left">
                    {team1FirstName}
                  </Text>
                )}
                <Text
                  size="h2"
                  classNames="font-primary text-h2 font-semibold text-left"
                >
                  {team1LastName || team1FirstName}
                </Text>
              </div>
            </div>
            <div className="wl-tickets-buy__match-detail-1 flex flex-col items-center justify-center">
              <Text size="body2" classNames="text-center">
                {ticketDetail?.match?.name}
              </Text>
              <Text size="body3" classNames="font-semibold text-center">
                {ticketDetail?.match?.location}
              </Text>
              <Text size="body4" classNames="font-normal text-center">
                {beautifyDate(ticketDetail?.match?.start_date)}
              </Text>
            </div>
            <div className="wl-tickets-buy__team flex gap-6 lg:flex-row-reverse">
              <Image
                url={ticketDetail?.match?.team2?.logo}
                isCircle
                width={99}
                height={99}
                alt="team2"
                withZoom
              />
              <div className="flex flex-col justify-center">
                {team2LastName && (
                  <Text size="body4" classNames="text-right">
                    {team2FirstName}
                  </Text>
                )}
                <Text
                  size="h2"
                  classNames="font-primary text-h2 font-semibold text-right"
                >
                  {team2LastName || team2FirstName}
                </Text>
              </div>
            </div>
          </div> */}
          <div className="wl-tickets-buy__match-detail-2 grid grid-cols-1 mx-auto lg:grid-cols-2 gap-4 lg:gap-20">
            <BuyTicketLabelContent
              key="location"
              label="Location"
              content={ticketDetail?.events?.location}
            />
            <BuyTicketLabelContent
              key="price"
              label="Price"
              content={`${ticketDetail?.price || ''}`}
            />

            <BuyTicketLabelContent
              key="start"
              label="Start"
              content={`${
                ticketDetail?.events?.start_date
                  ? beautifyDate(ticketDetail?.events?.start_date)
                  : ''
              }`}
            />
            <BuyTicketLabelContent
              key="end"
              label="End"
              content={`${
                ticketDetail?.events?.end_date
                  ? beautifyDate(ticketDetail?.events?.end_date)
                  : ''
              }`}
            />
          </div>
        </>
      )}
      {ticketDetail?.active && (
        <div className="wl-tickets-buy__form mt-10 lg:max-w-[640px] lg:mx-auto flex flex-col items-center gap-20">
          <InputNumber value={ticketNumber} handleChange={setTicketNumber} />
          <Button
            type="primary"
            size="xl"
            onClick={mutateAddToCart}
            disabled={isBuyLoading}
            isLoading={isBuyLoading}
            ariaLabel="Confirm buy ticket"
          >
            Confirm
          </Button>
        </div>
      )}
      <div className="wl-tickets-buy__notes mt-10">
        <Text classNames="font-secondary font-semibold text-[20px] leading-[40px]">
          {ticketDetail?.description}
        </Text>
      </div>
    </div>
  )
}
