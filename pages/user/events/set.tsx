import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from 'react-query'

// hooks
import { useSets } from 'hooks/useSets'
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
import { ISet } from 'interfaces/set_type'
import { modalName, TModalAction } from 'constants/modal'

interface Props {}

export default function Set({}: Props) {
  const { query: { match: matchId } = {}, push } = useRouter()
  // Context
  const dispatch = useModalDispatch()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteSetId, setDeletedSetId] = useState<number | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: matches } = useMatches(`id=${matchId}`, !!matchId)
  const { data: sets, isLoading: isFetchSetLoading } = useSets(
    `match_id=${matchId}`,
    !!matchId
  )
  const { data: events } = useEvents(
    `id=${matches?.data?.[0]?.event_id}`,
    !!matches?.data?.[0]?.event_id
  )
  const { mutate: mutateRemoveSet } = useMutation({
    mutationFn: () => {
      return DELETE(`sets?id=${deleteSetId}`)
    },
    onSuccess: (_response: any) => {
      toast('Set removed!')
      queryClient.invalidateQueries({
        queryKey: ['sets', `match_id=${matchId}`],
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
      name: modalName.SET,
      data: { matchId },
    })
  }
  const handleEditSet = (setId: number, matchId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.SET,
      data: { setId, matchId },
    })
  }
  const handleDeleteSet = (setId: number) => {
    setDeletedSetId(setId)
    setShowConfirmModal(true)
  }
  const handleSetRecordClick = (setId: number) => {
    push(`/user/events/set-record?set=${setId}`)
  }

  // Var
  const [match] = matches?.data || []
  const TABLE_COLUMNS = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[200px]',
    },
    {
      key: 'no',
      label: 'No.',
    },
    {
      key: 'winner',
      label: 'Winner',
      render: ({ winner_team_id }: ISet) => {
        const isTeam1 = match?.team1?.id === winner_team_id
        const isTeam2 = match?.team2?.id === winner_team_id
        const hasWinner = isTeam1 || isTeam2
        return (
          <td className="px-4 text-center">
            {`${
              hasWinner
                ? isTeam1
                  ? match?.team1?.name
                  : match?.team2?.name
                : 'N/A'
            }`}
          </td>
        )
      },
    },
    {
      key: 'loser',
      label: 'Loser',
      render: ({ loser_team_id }: ISet) => {
        const isTeam1 = match?.team1?.id === loser_team_id
        const isTeam2 = match?.team2?.id === loser_team_id
        const hasLoser = isTeam1 || isTeam2
        return (
          <td className="px-4 text-center">
            {`${
              hasLoser
                ? isTeam1
                  ? match?.team1?.name
                  : match?.team2?.name
                : 'N/A'
            }`}
          </td>
        )
      },
    },
    {
      key: 'team1_score',
      label: `${matches?.data?.[0]?.team1?.name} Score`,
      render: ({ team1_score }: ISet) => {
        return <td className="px-4 text-center">{team1_score ?? 'N/A'}</td>
      },
    },
    {
      key: 'team2_score',
      label: `${matches?.data?.[0]?.team2?.name} Score`,
      render: ({ team2_score }: ISet) => {
        return <td className="px-4 text-center">{team2_score ?? 'N/A'}</td>
      },
    },
    {
      key: 'action',
      label: 'Action',
      className: 'text-right',
      render: ({ id, match_id }: ISet) => {
        return (
          <td>
            <div className="flex flex-col gap-2 items-end">
              <Button
                type="ghost"
                size="sm"
                ariaLabel="Delete set"
                onClick={() => handleDeleteSet(id)}
              >
                Delete
              </Button>
              <Button
                type="primary"
                size="sm"
                ariaLabel="Edit set"
                onClick={() => handleEditSet(id, match_id)}
              >
                Edit
              </Button>
              <Button
                type="secondary"
                size="sm"
                ariaLabel="Edit record"
                onClick={() => handleSetRecordClick(id)}
              >
                Set Record
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
  if (!matchId) return null
  if (isFetchSetLoading) return null
  return (
    <UserGameLayout
      title="Set"
      subtitle={`${events?.data?.[0]?.name}`}
      subtitle2={`Match: ${matches?.data?.[0]?.name}`}
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
          ariaLabel="Add New set"
        />
        Add New Set
      </div>
      <Table
        columns={TABLE_COLUMNS}
        records={sets?.data}
        emptyLabel="No set yet"
        columnSize={7}
      />
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to remove set"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove set?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateRemoveSet}
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* START: MODAL */}
    </UserGameLayout>
  )
}
