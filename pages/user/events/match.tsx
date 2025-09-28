import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from 'react-query'

// hooks
import { useMatches } from 'hooks/useMatches'
import { useEvents } from 'hooks/useEvents'
// helpers
import { userId } from 'helpers/cookie'
import { beautifyISODate } from 'helpers/beautifyDate'
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
import { IRankTable } from 'interfaces/rank_table_type'
import { modalName, TModalAction } from 'constants/modal'
import { IMatches } from 'interfaces/match_type'

interface Props {}

export default function Match({}: Props) {
  const { query: { event: eventId } = {}, push } = useRouter()
  // Context
  const dispatch = useModalDispatch()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deleteMatchId, setDeletedMatchId] = useState<number | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: matches, isLoading: isFetchMatchLoading } = useMatches(
    `event_id=${eventId}`,
    !!eventId
  )
  const { data: events } = useEvents(`id=${eventId}`, !!eventId)
  const { mutate: mutateRemoveMatch } = useMutation({
    mutationFn: () => {
      return DELETE(`matches?id=${deleteMatchId}`)
    },
    onSuccess: (_response: any) => {
      toast('Match removed!')
      queryClient.invalidateQueries({
        queryKey: ['matches', `event_id=${eventId}`],
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
      name: modalName.MATCH,
      data: { eventId },
    })
  }
  const handleEditMatch = (matchId: number, eventId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.MATCH,
      data: { eventId, matchId },
    })
  }
  const handleDeleteMatch = (matchId: number) => {
    setDeletedMatchId(matchId)
    setShowConfirmModal(true)
  }
  const handleSetClick = (matchId: number, eventId: number) => {
    push(`/user/events/set?match=${matchId}`)
  }

  // Var
  const TABLE_COLUMNS = [
    {
      key: 'name',
      label: 'Name',
      span: 2,
      className: 'min-w-[200px]',
    },
    {
      key: 'location',
      label: 'Location',
      className: 'min-w-[200px]',
    },
    {
      key: 'period',
      label: 'Period',
      className: 'min-w-[200px]',
      render: (match: IMatches) => {
        return (
          <td className="w-full px-4">
            Start
            <br />
            {match?.start_date ? beautifyISODate(+match.start_date) : ''}
            <br />
            <br />
            End
            <br />
            {match?.end_date ? beautifyISODate(+match.end_date) : ''}
          </td>
        )
      },
    },
    {
      key: 'status',
      className: 'flex justify-center',
      label: 'Status',
    },
    {
      key: 'winner_team_id',
      label: 'Winner',
      render: ({ winner_team_id, team1_id, team1, team2 }: IMatches) => {
        const winner = winner_team_id === team1_id ? team1?.name : team2?.name
        return (
          <td className="px-4 text-center">
            {winner_team_id ? winner : 'N/A'}
          </td>
        )
      },
    },
    {
      key: 'loser_team_id',
      label: 'Loser',
      render: ({ loser_team_id, team1_id, team1, team2 }: IMatches) => {
        const loser = loser_team_id === team1_id ? team1?.name : team2?.name
        return (
          <td className="px-4 text-center">{loser_team_id ? loser : 'N/A'}</td>
        )
      },
    },
    {
      key: 'team 1',
      label: 'Team 1',
      render: ({ team1 }: IMatches) => {
        return (
          <td className="px-4">
            <div className="h-full flex items-center gap-2 ">
              {team1?.logo && (
                <Image
                  width={24}
                  height={24}
                  alt={team1?.name}
                  url={team1?.logo}
                  isCircle
                  withZoom
                />
              )}
              <Text>{team1?.name}</Text>
            </div>
          </td>
        )
      },
    },
    {
      key: 'team1_score',
      label: 'Score',
      render: ({ team1_score }: IMatches) => {
        return <td className="px-4 text-center">{team1_score ?? 'N/A'}</td>
      },
    },
    {
      key: 'team2',
      label: 'Team 2',
      render: ({ team2 }: IMatches) => {
        return (
          <td className="px-4">
            <div className="h-full flex items-center gap-2 ">
              {team2?.logo && (
                <Image
                  width={24}
                  height={24}
                  alt={team2?.name}
                  url={team2?.logo}
                  isCircle
                  withZoom
                />
              )}

              <Text>{team2?.name}</Text>
            </div>
          </td>
        )
      },
    },
    {
      key: 'team2_score',
      label: 'Score',
      render: ({ team2_score }: IMatches) => {
        return <td className="px-4 text-center">{team2_score ?? 'N/A'}</td>
      },
    },
    {
      key: 'action',
      label: 'Action',
      className: 'text-right',
      render: ({ id, event_id }: IRankTable) => {
        return (
          <td>
            <div className="flex flex-col gap-2 ">
              <Button
                ariaLabel="Delete Event"
                type="ghost"
                size="sm"
                onClick={() => handleDeleteMatch(id)}
              >
                Delete
              </Button>
              <Button
                ariaLabel="Edit Match"
                type="primary"
                size="sm"
                onClick={() => handleEditMatch(id, event_id)}
              >
                Edit
              </Button>
              <Button
                ariaLabel="Edit Set"
                type="secondary"
                size="sm"
                onClick={() => handleSetClick(id, event_id)}
              >
                Set
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
  if (isFetchMatchLoading) return null
  return (
    <UserGameLayout title="Match" subtitle={`${events?.data?.[0]?.name}`}>
      <div className="w-full flex gap-2 items-center justify-end mb-10">
        <ButtonIcon
          type="increase"
          onClick={handleAddNew}
          ariaLabel="Add new match"
        />
        Add New Match
      </div>
      <Table
        columns={TABLE_COLUMNS}
        records={matches?.data}
        emptyLabel="No match yet"
        columnSize={12}
      />
      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to remove match"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={handleCloseErrorModal}
      />
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove match?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateRemoveMatch}
        handleCloseModal={handleCloseConfirmationModal}
      />
      {/* END: MODAL */}
    </UserGameLayout>
  )
}
