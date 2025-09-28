// @TODO: mark the components with hook
// @TODO: mark the components with modal confirmation
import { useState } from 'react'
import { cx } from 'class-variance-authority'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
// hooks
import { useRankTable } from 'hooks/useRankTable'
import { useRegisteredTeam } from 'hooks/useRegisteredTeam'
// helpers
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import { validateEventRankTable } from 'helpers/validation'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import Input from '@/molecules/form/Input'
import { ModalOk } from '@/organisms/Modal'
// constants
import { IRankTable, IRankTableTeam } from 'interfaces/rank_table_type'
import Checkbox from '@/molecules/form/Checkbox'
import { IRegisteredTeam } from 'interfaces/registered_team_type'
import { IMatches } from 'interfaces/match_type'

interface Props {
  eventId: number
  rankTableId?: number
  handleBack: (...arg: any) => any
}

export default function RankTableForm({
  rankTableId,
  eventId,
  handleBack,
}: Props) {
  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateSaveRankTable, isLoading: isSaveRankTableLoading } =
    useMutation({
      mutationFn: (form?: IRankTable) => {
        if (rankTableId) {
          return PUT(`rank-table?id=${rankTableId}`, form)
        }
        return POST('rank-table', form)
      },
      onSuccess: (_response: any) => {
        toast('Rank Table saved!')
        queryClient.invalidateQueries({
          queryKey: ['rank-table', `event_id=${eventId}`],
        })
        if (rankTableId) {
          queryClient.invalidateQueries({
            queryKey: ['rank-table', `id=${rankTableId}`],
          })
        }

        handleBack()
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  // Function
  const handleSubmit = (form: IRankTable) => mutateSaveRankTable(form)

  return (
    <div key={rankTableId}>
      {/* START: Modal Rank Table */}
      <div className="h-full overflow-y-auto max-h-[80vh]">
        <div
          className={cx(
            'wl-event-rank-table__form',
            'p-4 lg:py-[30px] lg:px-8'
          )}
        >
          <Text size="form-title" component="h1" classNames="title">
            {rankTableId ? 'Edit Rank Table' : 'Create Rank Table'}
          </Text>
          <Line classNames="w-[50%] mt-6 mb-8" />
          {rankTableId ? (
            <EditRankTable
              rankTableId={rankTableId}
              eventId={eventId}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              isLoading={isSaveRankTableLoading}
            />
          ) : (
            <Form
              eventId={eventId}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              isLoading={isSaveRankTableLoading}
            />
          )}
        </div>
      </div>
      {/* END: Modal Rank Table */}

      {/* START: Modal Error */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to save rank table"
        message={error}
        labelOk="OK"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: Modal Error */}
    </div>
  )
}

function EditRankTable({
  eventId,
  rankTableId,
  handleSubmit,
  handleBack,
  isLoading,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  eventId: number
  rankTableId: number
  isLoading?: boolean
}) {
  const { data: rankTables, isLoading: isFetchLoading } = useRankTable(
    `id=${rankTableId}`,
    !!rankTableId
  )

  if (isFetchLoading) return null
  const [rankTable] = rankTables?.data || []
  return (
    <Form
      eventId={eventId}
      handleSubmit={handleSubmit}
      handleBack={handleBack}
      initialData={{
        rankTableId,
        name: rankTable.name,
        matchIds:
          rankTable?.matches?.length > 0
            ? rankTable.matches.map(({ id }: IMatches) => id)
            : [],
        teamIds:
          rankTable?.teams?.length > 0
            ? rankTable.teams.map(({ id }: IRankTableTeam) => id)
            : [],
      }}
      isLoading={isLoading}
    />
  )
}

function Form({
  eventId,
  handleSubmit,
  initialData = {},
  handleBack,
  isLoading,
}: {
  eventId: number
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  initialData?: any
  isLoading?: boolean
}) {
  // State
  const [form, setForm] = useState<{ [key: string]: any }>({ ...initialData })
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  // Query
  const { data: registeredTeams, isSuccess: isFetchRegisteredTeamSuccess } =
    useRegisteredTeam(`event_id=${eventId}`, true)

  // Function
  const validateForm = (form: any) => {
    const { success, error } = validateEventRankTable(form)
    if (success) return true
    setError(error)
    return false
  }
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({
      ...form,
      [e?.target?.name]: e?.target?.value,
    }))
    if (error?.[e?.target?.name]) {
      setError((error) => ({
        ...error,
        [e?.target?.name]: undefined,
      }))
    }
  }
  const handleChangeTeamIds = ({ value }: { value: any }) => {
    const teamIds = [...(form?.teamIds || [])]
    const exists = teamIds?.includes(value)
    setForm((form) => ({
      ...form,
      teamIds: exists
        ? teamIds.filter((id: number) => id !== value)
        : [...teamIds, value],
    }))
  }

  // ui
  if (!isFetchRegisteredTeamSuccess) return null
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (validateForm(form)) {
          handleSubmit({
            name: form.name,
            id: form.rankTableId,
            event_id: +eventId,
            team_ids: form.teamIds ?? [],
            match_ids: form.matchIds ?? [],
          })
        }
      }}
    >
      <div className="flex flex-col gap-8">
        <Input
          name="name"
          type="text"
          placeholder="Enter rank table name"
          label="Name"
          value={form.name}
          onChange={handleChangeInput}
          error={error.name}
          tabIndex={1}
          required
        />
        <div className="flex flex-col gap-4">
          <Text>Participating Teams</Text>
          <div className="grid grid-cols-2 gap-2">
            {registeredTeams?.data?.length > 0 &&
              registeredTeams.data.map((team: IRegisteredTeam) => (
                <Checkbox
                  name="teamIds"
                  key={team.team_id}
                  label={team?.team?.name || 'name'}
                  value={team.team_id}
                  checked={form?.teamIds?.includes(team.team_id)}
                  onChange={() => {
                    handleChangeTeamIds({
                      value: team.team_id,
                    })
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="md:mt-[72px] w-full items-center flex flex-col md:flex-row md:justify-center gap-4">
        <Button
          type="secondary"
          size="lg"
          role="button"
          classNames="w-full lg:max-w-[230px]"
          onClick={handleBack}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Close
        </Button>
        <Button
          type="primary"
          size="lg"
          role="submit"
          classNames="w-full lg:max-w-[230px]"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
