import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import type { NextApiResponse, NextApiRequest } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
// context
// import { useTicketDispatch } from 'context/ticketContext'
// helpers
import { beautifyDate } from 'helpers/beautifyDate'
import { getUserTickets } from 'helpers/api'
import { POST_NEW as POST } from 'helpers/ssrRequest'
// ui
import CardPurchase from '@/organisms/card/ticket/Purchase'
import UserLayout from '@/layout/UserLayout'
// constants
import { IUserTickets } from 'interfaces/ticket_type'

interface Props {
  userTickets?: IUserTickets[]
}

export default function MyTicketsPurchased({ userTickets }: Props) {
  const { push, replace } = useRouter()
  // // Context
  // const dispatch = useTicketDispatch()

  // Query
  const { mutate: mutateSendEmail, isLoading: _isSendEmailLoading } =
    useMutation({
      mutationFn: (id: number) => {
        return POST('send-ticket', {
          ticket_id: id,
        })
      },
      onSuccess: (_response: any) => {
        // dispatch({
        //   type: 'reset',
        // })
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

  // // Function
  // function handleSendEmail(id: number) {
  //   dispatch({
  //     type: 'added',
  //     id,
  //   })
  //   push('/tickets/send')
  // }

  return (
    <UserLayout activeTab="order">
      <div className="wl-tickets-purchased-tab grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userTickets &&
          userTickets?.length > 0 &&
          userTickets.map(({ ticket }: IUserTickets) => (
            <CardPurchase
              key={ticket.id}
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
                { label: 'Location', content: ticket?.events?.location || '-' },
                {
                  label: 'Price',
                  content: ticket?.price ? `${ticket?.price}` : '-',
                },
              ]}
              handleSendEmail={() => mutateSendEmail(ticket.id)}
            />
          ))}
      </div>
    </UserLayout>
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
