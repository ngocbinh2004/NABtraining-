import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import type { NextApiResponse, NextApiRequest } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// hooks
// import { useCategories } from 'hooks/useCategories'
// helper
import { beautifyDate } from 'helpers/beautifyDate'
import { getUserCarts } from 'helpers/api'
import { DELETE } from 'helpers/ssrRequest'

// ui
import CardUnpaid from '@/organisms/card/ticket/Unpaid'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
// import Tab from '@/molecules/tab/Tab'

import TicketLayout from '@/layout/TicketLayout'
// constants
import { ICart } from 'interfaces/cart_type'

interface Props {
  carts?: ICart[]
}

export default function MyTicketsUnpaid({ carts }: Props) {
  const { push, asPath } = useRouter()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteCartId, setDeletedCartId] = useState<number | undefined>()

  // Query
  const { mutate: mutateDeleteTicket, isLoading: _isSendEmailLoading } =
    useMutation({
      mutationFn: () => {
        return DELETE(`cart?id=${deleteCartId}`)
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
  const handleDeleteCart = (cartId: number) => {
    setDeletedCartId(cartId)
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
    <TicketLayout activeTab="unpaid">
      <div className="wl-ticket-unpaid-tab container mx-auto mt-[56px]">
        <div className="wl-ticket-unpaid-tab__category-content grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {carts &&
            carts?.length > 0 &&
            carts?.map(({ ticket, id }: ICart) => (
              <CardUnpaid
                key={id}
                title={`${ticket?.name}`}
                url={ticket?.image}
                contents={[
                  {
                    label: 'Start Time',
                    content: ticket?.events?.start_date
                      ? beautifyDate(ticket?.events?.start_date)
                      : '-',
                  },
                  {
                    label: 'End Time',
                    content: ticket?.events?.end_date
                      ? beautifyDate(ticket?.events?.end_date)
                      : '-',
                  },

                  { label: 'Type', content: ticket?.type || '-' },
                  {
                    label: 'Location',
                    content: ticket?.events?.location || '-',
                  },
                  { label: 'Price', content: `${ticket?.price || '-'}` },
                ]}
                handleDelete={() => handleDeleteCart(id)}
                handlePay={() => null}
              />
            ))}
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
        handleOk={mutateDeleteTicket}
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

  const cartsResp = await getUserCarts(`?user_id=${user?.id}`, {
    headers: {
      Authorization: sessionId,
    },
  })

  return {
    props: {
      carts: cartsResp?.data?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
