import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from 'react-query'

// hooks
import { useRankTable } from 'hooks/useRankTable'
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
import Table from '@/organisms/table/Table'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
import UserGameLayout from '@/layout/UserGameLayout'
// constants
import { IRankTable } from 'interfaces/rank_table_type'
import { modalName, TModalAction } from 'constants/modal'

interface Props {}

export default function RankTable({}: Props) {
  const { query: { event: eventId } = {} } = useRouter()
  // Context
  const dispatch = useModalDispatch()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteRankTableId, setDeletedRankTableId] = useState<
    number | undefined
  >()

  // Query
  const queryClient = useQueryClient()
  const { data: rankTables, isLoading: isFetchRankTableLoading } = useRankTable(
    `event_id=${eventId}`,
    !!eventId
  )
  const { data: events } = useEvents(`id=${eventId}`, !!eventId)
  const { mutate: mutateRemoveRankTable } = useMutation({
    mutationFn: () => {
      return DELETE(`rank-table?id=${deleteRankTableId}`)
    },
    onSuccess: (_response: any) => {
      toast('Rank Table removed!')
      queryClient.invalidateQueries({
        queryKey: ['rank-table', `event_id=${eventId}`],
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
      name: modalName.RANK_TABLE,
      data: { eventId },
    })
  }
  const handleEditRankTable = (rankTableId: number, eventId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.RANK_TABLE,
      data: { eventId, rankTableId },
    })
  }
  const handleDeleteRankTable = (rankTableId: number) => {
    setDeletedRankTableId(rankTableId)
    setShowConfirmModal(true)
  }

  // Var
  const TABLE_COLUMNS = [
    {
      key: 'name',
      className: '',
      label: 'Name',
      span: 2,
    },
    {
      key: 'team',
      className: '',
      label: 'Participating Teams',
      span: 4,
      render: ({ teams }: IRankTable) => {
        return (
          <td colSpan={4} className="text-center">
            <ul className="flex flex-col gap-1">
              {teams && teams?.length > 0
                ? teams?.map(({ name }) => <li key={name}>{name}</li>)
                : '-'}
            </ul>
          </td>
        )
      },
    },
    {
      key: 'action',
      className: '',
      label: 'Action',
      span: 2,
      render: ({ id, event_id }: IRankTable) => {
        return (
          <td colSpan={2}>
            <div className="flex justify-end gap-2">
              <Button
                type="ghost"
                size="sm"
                ariaLabel="Delete rank table"
                onClick={() => handleDeleteRankTable(id)}
              >
                Delete
              </Button>
              <Button
                ariaLabel="Edit rank table"
                type="primary"
                size="sm"
                onClick={() => handleEditRankTable(id, event_id)}
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
  if (!eventId) return null
  if (isFetchRankTableLoading) return null
  return (
    <UserGameLayout
      title={'Rank Table'}
      subtitle={`${events?.data?.[0]?.name}`}
    >
      <div className="w-full flex gap-2 items-center justify-end mb-10">
        <ButtonIcon
          type="increase"
          onClick={handleAddNew}
          ariaLabel="Add new rank table"
        />
        Add New Rank Table
      </div>
      <Table
        columns={TABLE_COLUMNS}
        records={rankTables?.data}
        emptyLabel="No rank table yet"
        columnSize={8}
      />
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to remove rank table"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove rank table?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateRemoveRankTable}
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* START: MODAL */}
    </UserGameLayout>
  )
}
