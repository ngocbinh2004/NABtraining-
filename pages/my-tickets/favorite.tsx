import { useState, useEffect } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import type { NextApiResponse, NextApiRequest } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
// hooks
// import { useCategories } from 'hooks/useCategories'
// helper
import { beautifyDate } from 'helpers/beautifyDate'
import { getUserFavorites } from 'helpers/api'
import { DELETE } from 'helpers/ssrRequest'

// ui
import CardBuyNow from '@/organisms/card/ticket/BuyNow'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
// import Tab from '@/molecules/tab/Tab'
import TicketLayout from '@/layout/TicketLayout'
// constants
import { IFavoriteTickets } from 'interfaces/ticket_type'

interface Props {
  favorites?: IFavoriteTickets[]
}

export default function MyTicketsFavorite({ favorites }: Props) {
  const { push, asPath } = useRouter()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteFavoriteId, setDeletedFavoriteId] = useState<
    number | undefined
  >()

  // Query
  const { mutate: mutateDeleteFavorite, isLoading: _isSendEmailLoading } =
    useMutation({
      mutationFn: () => {
        return DELETE(`favorite?id=${deleteFavoriteId}`)
      },
      onSuccess: (_response: any) => {
        toast('Item deleted!')
        push(asPath)
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
      onSettled: () => {
        setShowConfirmModal(false)
      },
    })

  // Function
  const handleCloseErrorModal = () => setShowErrorModal(false)
  const handleCloseConfirmationModal = () => setShowConfirmModal(false)
  const handleBuyNow = (id: number) => push(`/tickets/buy/${id}`)
  const handleDeleteFavorite = (cartId: number) => {
    setDeletedFavoriteId(cartId)
    setShowConfirmModal(true)
  }

  // @TODO: comment until get clearer info about categories grouping
  // const { data: categories, isSuccess: isCategoriesSuccess } = useCategories(
  //   '',
  //   true
  // )
  // const [activeCategory, setActiveCategory] = useState<number>()

  // const tabsHeader = categories?.data

  // useEffect(() => {
  //   if (isCategoriesSuccess) {
  //     setActiveCategory(tabsHeader?.[0]?.id)
  //   }
  // }, [isCategoriesSuccess, tabsHeader])

  return (
    <TicketLayout activeTab="favorite">
      <div className="wl-ticket-unpaid-tab container mx-auto mt-[56px]">
        <div className="wl-ticket-unpaid-tab__category-content grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {favorites &&
            favorites?.length > 0 &&
            favorites?.map(
              ({ ticket: t, ticket_id: ticketId, id }: IFavoriteTickets) => {
                return (
                  <CardBuyNow
                    key={ticketId}
                    name={t?.name}
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
                    handleBuy={() => handleBuyNow(ticketId)}
                    handleDelete={() => handleDeleteFavorite(id)}
                  />
                )
              }
            )}
        </div>
        {/* <Tab
          type="button"
          name="wl-ticket-unpaid-tab__category-tab"
          onClick={(id) => setActiveCategory(id)}
          activeTab={activeCategory}
          tabs={tabsHeader}
        >
          <div className="wl-ticket-unpaid-tab__category-content grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {carts &&
              carts?.length > 0 &&
              carts
                ?.filter(
                  ({ ticket }: IUserTickets) =>
                    ticket?.events?.category_id === activeCategory
                )
                ?.map(({ ticket }: IUserTickets) => (
                  <CardUnpaid
                    key={ticket.id}
                    title={ticket.name}
                    url={ticket?.events?.image}
                    contents={[
                      {
                        label: 'Start Time',
                        content: ticket.events?.start_date
                          ? beautifyDate(ticket.events?.start_date)
                          : '-',
                      },
                      {
                        label: 'End Time',
                        content: ticket.events?.end_date
                          ? beautifyDate(ticket.events?.end_date)
                          : '-',
                      },

                      { label: 'Type', content: ticket.type || '-' },
                      {
                        label: 'Location',
                        content: ticket?.events?.location || '-',
                      },
                      { label: 'Price', content: `${ticket.price || '-'}` },
                    ]}
                    handleDelete={() => null}
                    handlePay={() => null}
                  />
                ))}
          </div>
        </Tab> */}
      </div>
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to remove item"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove item?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateDeleteFavorite}
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* END: MODAL */}
    </TicketLayout>
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

  const favoritesResp = await getUserFavorites(`?user_id=${user?.id}`, {
    headers: {
      Authorization: sessionId,
    },
  })

  return {
    props: {
      favorites: favoritesResp?.data?.data,
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
