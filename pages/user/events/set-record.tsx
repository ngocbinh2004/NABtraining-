import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from 'react-query'

// hooks
import { useSets } from 'hooks/useSets'
import { useSetRecords } from 'hooks/useSetRecords'
import { useMatches } from 'hooks/useMatches'
import { useEvents } from 'hooks/useEvents'
// helpers
import { userId } from 'helpers/cookie'
import { DELETE } from 'helpers/ssrRequest'
export { getServerSideProps } from 'helpers/loginGetServerSideProps'
// context
import { useModalDispatch } from 'context/modalContext'
// ui
import Button from '@/atoms/Button'
import ButtonIcon from '@/atoms/ButtonIcon'
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'
import Table from '@/organisms/table/Table'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
import UserGameLayout from '@/layout/UserGameLayout'
// constants
import { ISetRecord } from 'interfaces/set_type'
import { modalName, TModalAction } from 'constants/modal'

interface Props {}

export default function SetRecord({}: Props) {
  const { query: { set: setId } = {}, push } = useRouter()
  // Context
  const dispatch = useModalDispatch()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteRecordId, setDeletedRecordId] = useState<number | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: records, isLoading: isFetchRecordsLoading } = useSetRecords(
    `set_id=${setId}`,
    !!setId
  )
  const { data: sets } = useSets(`id=${setId}`, !!setId)
  const { data: matches } = useMatches(
    `id=${sets?.data?.[0]?.match_id}`,
    !!sets?.data?.[0]?.match_id
  )
  const { data: events } = useEvents(
    `id=${matches?.data?.[0]?.event_id}`,
    !!matches?.data?.[0]?.event_id
  )
  const { mutate: mutateRemoveRecord } = useMutation({
    mutationFn: () => {
      return DELETE(`set-records?id=${deleteRecordId}`)
    },
    onSuccess: (_response: any) => {
      toast('Records removed!')
      queryClient.invalidateQueries({
        queryKey: ['set-records', `set_id=${setId}`],
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
  const handleAddNew = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.SET_RECORD,
      data: { setId },
    })
  }
  const handleEditRecord = (recordId: number, setId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.SET_RECORD,
      data: { setId, recordId },
    })
  }
  const handleDeleteRecord = (setId: number) => {
    setDeletedRecordId(setId)
    setShowConfirmModal(true)
  }

  // Var
  const TABLE_COLUMNS = [
    {
      key: 'player',
      label: 'Player',
      className: 'min-w-[200px]',
      render: ({ user_team }: ISetRecord) => {
        return <td>{user_team?.user?.name}</td>
      },
    },
    {
      key: 'board',
      label: 'Board',
    },
    {
      key: 'attack_score',
      label: 'Attack Score',
    },
    {
      key: 'block_score',
      label: 'Block Score',
    },
    {
      key: 'total',
      label: 'Total',
    },
    {
      key: 'average',
      label: 'Average',
    },
    {
      key: 'games',
      label: 'Events',
    },
    {
      key: 'action',
      label: 'Action',
      className: 'text-right',
      render: ({ id, set_id }: ISetRecord) => {
        return (
          <td>
            <div className="flex flex-col gap-2 items-end">
              <Button
                type="ghost"
                size="sm"
                ariaLabel="Delete record"
                onClick={() => handleDeleteRecord(id)}
              >
                Delete
              </Button>
              <Button
                type="primary"
                ariaLabel="Edit record"
                size="sm"
                onClick={() => handleEditRecord(id, set_id)}
              >
                Edit
              </Button>
            </div>
          </td>
        )
      },
    },
  ]
  const isOwner = userId() === events?.data?.[0].created_by
  // ui
  if (!isOwner) return null
  if (!setId) return null
  if (isFetchRecordsLoading) return null
  return (
    <UserGameLayout
      title="Set Record"
      subtitle={`${events?.data?.[0]?.name}`}
      subtitle2={`Match: ${matches?.data?.[0]?.name}`}
      subtitle3={`Set: ${sets?.data?.[0]?.name}`}
    >
      <div className="flex gap-2">
        {matches?.data?.[0]?.team1?.logo && (
          <Image
            width={24}
            height={24}
            alt={matches?.data?.[0]?.team1?.name}
            url={matches?.data?.[0]?.team1?.logo}
            isCircle
            withZoom
          />
        )}
        <Text>{matches?.data?.[0]?.team1?.name}</Text>
        <Text size="h3">VS</Text>
        {matches?.data?.[0]?.team2?.logo && (
          <Image
            width={24}
            height={24}
            alt={matches?.data?.[0]?.team2?.name}
            url={matches?.data?.[0]?.team2?.logo}
            isCircle
            withZoom
          />
        )}
        <Text>{matches?.data?.[0]?.team2?.name}</Text>
      </div>
      <div className="w-full flex gap-2 items-center justify-end mb-10">
        <ButtonIcon
          type="increase"
          onClick={handleAddNew}
          ariaLabel="Add new record"
        />
        Add New Record
      </div>
      <Table
        columns={TABLE_COLUMNS}
        records={records?.data}
        emptyLabel="No set record yet"
        columnSize={7}
      />
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to remove record"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove record?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateRemoveRecord}
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* START: MODAL */}
    </UserGameLayout>
  )
}
