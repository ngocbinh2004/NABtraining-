import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { NextApiResponse, NextApiRequest } from 'next'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// helpers
import { beautifyDate } from 'helpers/beautifyDate'
import { getCategories, getTickets } from 'helpers/api'
import { POST_NEW as POST } from 'helpers/ssrRequest'
// ui
import Text from '@/atoms/Text'
import Icon from '@/atoms/Icon'
import Link from '@/atoms/Link'
import Search from '@/molecules/Search'
import Image from '@/molecules/media/Image'
import { Ticket } from '@/molecules/card/LabelContent'
import { ModalOk } from '@/organisms/Modal'

// constants
import { ITickets } from 'interfaces/ticket_type'
import { ICategory } from 'interfaces/category_type'
import { Events } from 'interfaces/event_type'
import { getCookie, setCookie } from 'cookies-next'

const Tab = dynamic(() => import('@/molecules/tab/Tab'))
const CardBuyNow = dynamic(() => import('@/organisms/card/ticket/BuyNow'))
const CardSlider = dynamic(() => import('@/organisms/CardSlider'))

interface Props {
  activeCategory?: number
  categories?: ICategory[]
  tickets?: { [key: number]: { event?: Events; data?: ITickets[] } } | undefined
}

export default function Tickets({
  activeCategory,
  categories,
  tickets,
}: Props) {
  const { push } = useRouter()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const { mutate: mutateAddFavorite } = useMutation({
    mutationFn: (id: number) => {
      return POST(`favorite`, {
        ticket_id: id,
      })
    },
    onSuccess: (_response: any) => {
      toast('Item added to favorite!')
    },
    onError: (error: any) => {
      setShowErrorModal(true)
      setError(`${error?.message || error}`?.substring(0, 100))
    },
  })

  // Function
  const handleBuyNow = (id: number) => push(`/tickets/buy/${id}`)
  const handleCloseErrorModal = () => setShowErrorModal(false)

  return (
    <div className="wl-tickets container mx-auto mt-[47px] flex flex-col items-center gap-10">
      <div className="wl-tickets__my-ticket__wrapper flex justify-end w-full">
        {activeCategory && (
          <Link href="/my-tickets/purchased">
            <div className="wl-tickets__my-ticket flex items-center justify-end pr-10">
              <Icon icon="star" width={34} height={34} />
              <Text classNames="ml-4">My Tickets</Text>
              <div className="wl-tickets__my-ticket__arrow translate-x-0 opacity-0 w-fit">
                <Icon
                  icon="table-arrow"
                  width={26}
                  height={27}
                  classNames="text-white"
                />
              </div>
            </div>
          </Link>
        )}
      </div>
      <div className="wl-tickets__search w-full lg:w-[80%]">
        <Search
          placeholder="Please enter Event Name."
          onClick={setSearchQuery}
        />
      </div>

      <Tab
        type="button"
        name="wl-tickets__category-tab"
        onClick={(id) => push(`tickets?category=${id}`)}
        activeTab={activeCategory}
        tabs={categories}
      >
        <div className="wl-tickets__category-content mt-12 flex flex-col gap-10">
          {tickets &&
            Object.values(tickets).map(
              ({ event, data }: { event?: Events; data?: ITickets[] }) => {
                if (!event?.id) return null

                if (
                  searchQuery?.trim()?.length > 0 &&
                  !event?.name
                    ?.toLowerCase()
                    .includes(searchQuery?.toLowerCase())
                )
                  return null

                return (
                  <div className="flex flex-col gap-2" key={event.id}>
                    <div className="wl-tickets__ticket-list flex gap-2">
                      {event?.image && (
                        <Image
                          withShadow
                          width={32}
                          height={32}
                          alt={event?.name}
                          url={event?.image}
                          isCircle
                          withZoom
                        />
                      )}
                      <Ticket.LabelTitle title={event?.name} />
                    </div>

                    <CardSlider name="slider-ticket-card" classNames="w-full">
                      {data &&
                        data?.length > 0 &&
                        data?.map((t: ITickets) => (
                          <CardBuyNow
                            key={t.id}
                            contents={[
                              {
                                label: 'Time',
                                content: t?.events?.start_date
                                  ? beautifyDate(t?.events?.start_date)
                                  : 'N/A',
                              },
                              { label: 'Type', content: t?.type || 'N/A' },
                              {
                                label: 'Location',
                                content: t?.events?.location || 'N/A',
                              },
                              {
                                label: 'Price',
                                content: `${t?.price || 'N/A'}`,
                              },
                            ]}
                            handleBuy={() => handleBuyNow(t.id)}
                            handleAddFavorite={() => mutateAddFavorite(t.id)}
                          />
                        ))}
                    </CardSlider>
                  </div>
                )
              }
            )}
        </div>
      </Tab>
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to add item to favorite"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />

      {/* END: MODAL */}
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  res,
  req,
  locale,
  defaultLocale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
  defaultLocale: string
}) => {
  // if not login, redirect to login
  const sessionId = getCookie('SESSION', { req, res })
  const noAuth = !sessionId || typeof sessionId !== 'string'
  setCookie('FROM', '/tickets', { req, res })

  if (noAuth) {
    return {
      redirect: { destination: locale!=defaultLocale?`/${locale}/login`:'/login', permanent: false },
    }
  }

  // data
  const categoriesResp = await getCategories()
  const sortedCategories = categoriesResp?.data?.data?.sort(
    (a: ICategory, b: ICategory) => a.id - b.id
  )

  const ticketsResp = await getTickets(
    `?category_id=${query?.category || sortedCategories?.[0]?.id}`
  )
  const activeTickets = ticketsResp?.data?.data
    ? ticketsResp?.data?.data
        // ?.filter((ticket: ITickets) => ticket?.active)
        ?.reduce((eventsTickets: any, ticket: ITickets) => {
          const newEventsTickets = { ...eventsTickets }
          const eventId = ticket?.event_id
          if (!newEventsTickets?.[eventId]) {
            newEventsTickets[eventId] = { event: ticket?.events, data: [] }
          }

          newEventsTickets[eventId].data.push(ticket)
          return newEventsTickets
        }, {})
    : undefined

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      activeCategory: +(query?.category ?? sortedCategories[0]?.id),
      categories: sortedCategories,
      tickets: activeTickets,
      showMyTicket: !noAuth,
      ...(await serverSideTranslations(locale)),
    },
  }
}
