import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

// hooks
import { useRegisteredTeam } from 'hooks/useRegisteredTeam'
// helper
import { beautifyDate } from 'helpers/beautifyDate'
import { DELETE, PUT } from 'helpers/ssrRequest'
// ui
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
import CardEditGame from '@/components/profile/games/EditGame'
// constant
import { IUserEvent } from 'interfaces/user_event_type'
import { eventStatus } from 'constants/gameStatus'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface Props {
  userId: number
  handleEditEvent: (...args: any) => any
  userEvents?: IUserEvent[]
}

export default function EventList({
  userId,
  handleEditEvent,
  userEvents,
}: Props) {
  const { push } = useRouter()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteEventId, setDeletedEventId] = useState<number | undefined>()
  const [cancelEventId, setCancelEventId] = useState<number | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateRemoveEvent, isLoading: isRemoveEventLoading } =
    useMutation({
      mutationFn: () => {
        return DELETE(`events?id=${deleteEventId}`)
      },
      onSuccess: (_response: any) => {
        toast('Event removed!')
        queryClient.invalidateQueries({
          queryKey: ['user-events'],
        })
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
      onSettled: () => {
        setShowConfirmModal(false)
      },
    })
  const { mutate: mutateCancelEvent, isLoading: isCancelEventLoading } =
    useMutation({
      mutationFn: ({
        isCancel,
        cancelEventId,
      }: {
        isCancel?: boolean
        cancelEventId?: number
      }) => {
        return PUT(`events?id=${cancelEventId}`, {
          status: isCancel ? eventStatus.CANCELED : eventStatus.DRAFT,
        })
      },
      onSuccess: (_response: any) => {
        toast('Event updated!')
        queryClient.invalidateQueries({
          queryKey: ['user-events'],
        })
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
  const handleDetailClick = (eventId: number) =>
    push(`/events/competition/${eventId}`)
  const handleRankTableClick = (eventId: number) =>
    push(`/user/events/rank-table?event=${eventId}`)
  const handleMatchClick = (eventId: number) =>
    push(`/user/events/match?event=${eventId}`)

  // Effect
  useEffect(() => {
    const overlay = document?.getElementById('modal-overlay')
    if (overlay) overlay?.classList?.toggle('hidden')
  }, [showConfirmModal, showErrorModal])

  return (
    <div className="wl-profile-event__list flex place-self-center" key={userId}>
      {/* START: LIST */}
      {userEvents && userEvents?.length > 0 ? (
        <div className="wl-profile-event__list__items lg:max-w-[756px] flex flex-col gap-6">
          {userEvents.map((event: IUserEvent) => {
            if (!event) return
            return (
              <CardGame
                key={event.id}
                handleCancelEvent={() => {
                  setShowConfirmModal(true)
                  setCancelEventId(event.id)
                }}
                handleUncancelEvent={() => {
                  mutateCancelEvent({ cancelEventId: event.id })
                }}
                handleRemoveEvent={() => {
                  setShowConfirmModal(true)
                  setDeletedEventId(event.id)
                }}
                handleUpdateEvent={() => {
                  handleEditEvent(event.id)
                }}
                handleMatchClick={() => {
                  handleMatchClick(event.id)
                }}
                isCancelLoading={isCancelEventLoading}
                isRemoveLoading={isRemoveEventLoading}
                handleDetailClick={() => handleDetailClick(event.id)}
                handleRankTableClick={() => handleRankTableClick(event.id)}
                event={event}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-12 w-full">
          <EmptyResult text="there are no events" />
        </div>
      )}
      {/* END: LIST */}

      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title={
          deleteEventId ? 'Failed to remove event' : 'Failed to cancel event'
        }
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title={
          deleteEventId
            ? 'Are you sure to remove event?'
            : 'Are you sure to cancel event?'
        }
        message="This action can not be reverted"
        labelCancel="Back"
        labelOk="Confirm"
        handleOk={
          deleteEventId
            ? mutateRemoveEvent
            : () => mutateCancelEvent({ isCancel: true, cancelEventId })
        }
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* END: MODAL */}
    </div>
  )
}

function CardGame({
  handleCancelEvent,
  handleRemoveEvent,
  handleUpdateEvent,
  handleDetailClick,
  handleMatchClick,
  handleRankTableClick,
  handleUncancelEvent,
  isRemoveLoading,
  isCancelLoading,
  event,
}: {
  handleRemoveEvent?: (...args: any) => any
  handleCancelEvent?: (...args: any) => any
  handleUncancelEvent?: (...args: any) => any
  handleUpdateEvent?: (...args: any) => any
  handleDetailClick?: (...args: any) => any
  handleMatchClick?: (...args: any) => any
  handleRankTableClick?: (...args: any) => any
  isRemoveLoading?: boolean
  isCancelLoading?: boolean
  event: IUserEvent
}) {
  const { data: registered } = useRegisteredTeam(
    `event_id=${event.id}`,
    !!event.id
  )
  return (
    <CardEditGame
      gridClassNames="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-11"
      classNames="wl-profile-event__list__item"
      key={event.id}
      onRemove={handleRemoveEvent}
      onUpdateEvent={handleUpdateEvent}
      onMatchClick={handleMatchClick}
      onRankTableClick={handleRankTableClick}
      isRemoveLoading={isRemoveLoading}
      isCancelLoading={isCancelLoading}
      url={event.image}
      title={event.name}
      // isOwner={event?.hosted}
      status={event?.status}
      onDetailClick={handleDetailClick}
      onCancelEvent={handleCancelEvent}
      onUncanceledEvent={handleUncancelEvent}
      contents={[
        { label: 'Group', content: event?.category?.name },
        { label: 'Registered', content: registered?.total || 'N/A' },
        {
          label: 'Deadline',
          content: event?.register_end_date
            ? beautifyDate(new Date(+event?.register_end_date))
            : 'N/A',
        },
        { label: 'Numbers', content: event?.team_capacity || 'N/A' },
        {
          label: 'Introduction',
          content: `${
            event?.description ? event.description.slice(0, 100) : 'N/A'
          }`,
          isSmall: true,
        },
        {
          label: 'Place',
          content: event?.location || 'N/A',
        },
        {
          label: 'Moderated',
          content: event?.created_by_user?.name || 'N/A',
        },
      ]}
    />
  )
}
