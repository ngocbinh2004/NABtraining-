import { useState } from 'react'
import { cx } from 'class-variance-authority'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import type { NextApiResponse, NextApiRequest } from 'next'
import { useMutation } from 'react-query'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// context
import { useTicketDispatch, useTicket } from 'context/ticketContext'
// helpers
import { beautifyDate } from 'helpers/beautifyDate'
import { getUserTickets } from 'helpers/api'
import { POST } from 'helpers/ssrRequest'
// constants
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import ButtonIcon from '@/atoms/ButtonIcon'
import CardPurchase from '@/organisms/card/ticket/Purchase'
import { TitleLeft } from '@/components/PageTitle'
// constants
import { IUserTickets } from 'interfaces/ticket_type'
import { toast } from 'react-toastify'

interface Props {
  userTickets?: IUserTickets[]
}

export default function SendTicket({ userTickets }: Props) {
  const { replace } = useRouter()
  // Context
  const myTickets = useTicket()
  const dispatch = useTicketDispatch()
  // Query
  const { mutate: mutateSendEmail, isLoading: isSendEmailLoading } =
    useMutation({
      mutationFn: () => {
        return POST('send-ticket', {
          tickets: selectedTickets?.map(({ id }) => id),
        })
      },
      onSuccess: (_response: any) => {
        dispatch({
          type: 'reset',
        })
        replace('/tickets/send-success')
      },
      onError: (error: any) => {
        toast.error(
          error
            ? `${error?.message || error}`?.substring(0, 100)
            : 'Something goes wrong'
        )
      },
    })
  // State
  const [showTicketList, setShowTicketList] = useState(true)
  const [currentTickets, setCurrentTickets] = useState([...(myTickets || [])])
  // Var
  const selectedTickets =
    userTickets && userTickets?.length > 0
      ? userTickets.filter(({ id }: IUserTickets) => myTickets?.includes(id))
      : []
  // Function
  function handleSelectConfirm() {
    dispatch({
      type: 'updated',
      id: currentTickets,
    })

    setShowTicketList(true)
  }
  function handleClickTicket(ticketId: number) {
    const ticketIdx = currentTickets.indexOf(ticketId)
    const newCurrentTickets = [...currentTickets]
    if (ticketIdx > -1) {
      newCurrentTickets.splice(ticketIdx, 1)
    } else {
      newCurrentTickets.push(ticketId)
    }

    setCurrentTickets(newCurrentTickets)
  }

  return (
    <div className="wl-tickets container mx-auto mt-[47px] flex flex-col items-center gap-10">
      <TitleLeft name="tickets">Choose tickets to email</TitleLeft>

      {showTicketList ? (
        <div className="wl-tickets__selected text-center">
          <div className="wl-tickets__selected__list grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedTickets?.length > 0 &&
              selectedTickets.map(({ ticket, id }: IUserTickets) => (
                <CardPurchase
                  key={id}
                  title={ticket.name}
                  qrUrl={ticket.qr_image}
                  url={ticket.events?.image}
                  contents={[
                    {
                      label: 'Time',
                      content: ticket.events?.start_date
                        ? beautifyDate(ticket.events?.start_date)
                        : '-',
                    },
                    { label: 'Type', content: ticket?.type || '-' },
                    {
                      label: 'Location',
                      content: ticket?.events?.location || '-',
                    },
                    {
                      label: 'Price',
                      content: ticket?.price ? `${ticket?.price}` : '-',
                    },
                  ]}
                />
              ))}
          </div>
          {!isSendEmailLoading && (
            <div className="wl-tickets__selected__add flex flex-col items-center gap-2 mt-10">
              {/* START: button add */}
              <ButtonIcon
                type="increase"
                onClick={() => setShowTicketList(false)}
              />
              {/* END: button add */}
              <Text>Add new ticket</Text>
            </div>
          )}

          <Button
            type="primary"
            size="xl"
            onClick={mutateSendEmail}
            classNames="mt-10"
            ariaLabel="Send tickets to email"
            disabled={selectedTickets?.length === 0 || isSendEmailLoading}
          >
            Send
          </Button>
        </div>
      ) : (
        <div className="wl-tickets__all text-center">
          <div className="wl-tickets__all__list grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userTickets &&
              userTickets?.length > 0 &&
              userTickets.map(({ ticket, id }: IUserTickets) => (
                <div
                  key={id}
                  role="button"
                  className={cx(
                    currentTickets.includes(id) ? 'border rounded' : ''
                  )}
                  onClick={() => handleClickTicket(id)}
                  aria-label="add ticket"
                >
                  <CardPurchase
                    title={ticket.name}
                    qrUrl={ticket.qr_image}
                    url={ticket?.events?.image}
                    contents={[
                      {
                        label: 'Time',
                        content: ticket.events?.start_date
                          ? beautifyDate(ticket.events?.start_date)
                          : '-',
                      },
                      { label: 'Type', content: ticket?.type || '-' },
                      {
                        label: 'Location',
                        content: ticket?.events?.location || '-',
                      },
                      {
                        label: 'Price',
                        content: ticket?.price ? `${ticket?.price}` : '-',
                      },
                    ]}
                  />
                </div>
              ))}
          </div>
          <Button
            type="primary"
            size="xl"
            onClick={handleSelectConfirm}
            classNames="mt-10"
            ariaLabel="Confirm add"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  res,
  req,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const sessionId = getCookie('SESSION', { req, res })
  const user = jwt.decode(`${sessionId}`) as JwtPayload

  const ticketsResp = await getUserTickets(`?user_id=${user?.id}`, {
    headers: {
      Authorization: sessionId,
    },
  })

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      userTickets: ticketsResp?.data?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
