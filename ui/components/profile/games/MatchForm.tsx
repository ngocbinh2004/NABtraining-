import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

// hooks
import { useMatches } from 'hooks/useMatches'
import { useRegisteredTeam } from 'hooks/useRegisteredTeam'
// helpers
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import { validateEventMatchProfileForm } from 'helpers/validation'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import Input from '@/molecules/form/Input'
import TextArea from '@/molecules/form/TextArea'
import Select from '@/molecules/form/Select'
import { InputDateRangePicker } from '@/molecules/form/InputDatepicker'
import { ModalOk } from '@/organisms/Modal'
// constant
import { IMatches } from 'interfaces/match_type'
import { IRegisteredTeam } from 'interfaces/registered_team_type'
import { IRankTable } from 'interfaces/rank_table_type'
import { useRankTable } from 'hooks/useRankTable'
import { matchStatus } from 'constants/gameStatus'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface Props {
  matchId?: number
  eventId: number
  handleBack: (...arg: any) => any
}

export default function MatchForm({ matchId, eventId, handleBack }: Props) {
  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateSaveMatch, isLoading: isSaveMatchLoading } =
    useMutation({
      mutationFn: (form?: IMatches) => {
        if (matchId) {
          return PUT(`matches?id=${matchId}`, form)
        }
        return POST('matches', form)
      },
      onSuccess: (_response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['matches'],
        })
        toast('Match saved!')
        handleBack()
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  // Function
  const handleSubmit = (form: IMatches) => mutateSaveMatch(form)

  return (
    <div key={matchId}>
      {/* START: Modal Match */}
      <Text size="form-title" component="h1" classNames="title">
        {matchId ? 'Edit Match' : 'Create Match'}
      </Text>
      <Line classNames="w-[50%] mt-6 mb-8" />

      {matchId ? (
        <EditMatch
          eventId={eventId}
          matchId={matchId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveMatchLoading}
        />
      ) : (
        <Form
          eventId={eventId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveMatchLoading}
        />
      )}
      {/* END: Modal Match */}

      {/* START: Modal Error */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to save match"
        message={error}
        labelOk="OK"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: Modal Error */}
    </div>
  )
}

function EditMatch({
  matchId,
  handleSubmit,
  handleBack,
  isLoading,
  eventId,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  matchId: number
  isLoading?: boolean
  eventId: number
}) {
  const { data: matches, isLoading: isFetchLoading } = useMatches(
    `id=${matchId}`,
    !!matchId
  )

  if (isFetchLoading) return null
  const [match] = matches?.data || []
  return (
    <Form
      eventId={eventId}
      handleSubmit={handleSubmit}
      handleBack={handleBack}
      isEdit
      initialData={{
        name: match?.name,
        location: match?.location,
        status: match?.status,
        startDate: match?.start_date ? new Date(+match?.start_date) : undefined,
        endDate: match?.end_date ? new Date(+match?.end_date) : undefined,
        team1: match?.team1_id,
        team2: match?.team2_id,
        winner: match?.winner_team_id,
        loser: match?.loser_team_id,
        rankTableId: match?.rank_table_id,
      }}
      isLoading={isLoading}
    />
  )
}

function Form({
  handleSubmit,
  initialData = {},
  handleBack,
  isLoading,
  eventId,
  isEdit,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  initialData?: any
  isLoading?: boolean
  isEdit?: boolean
  eventId: number
}) {
  // State
  const [form, setForm] = useState<{ [key: string]: any }>({ ...initialData })
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  // Query
  const { data: teams, isSuccess: isFetchTeamSuccess } = useRegisteredTeam(
    `event_id=${eventId}`,
    !!eventId
  )
  const { data: rankTables } = useRankTable(`event_id=${eventId}`, !!eventId)

  // Function
  const validateForm = (form: any) => {
    const { success, error } = validateEventMatchProfileForm(form)
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
  const handleChangeSelectDate = ({
    name,
    value,
  }: {
    name: string
    value: any
  }) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }))

    if (error?.[name]) {
      setError((error) => ({
        ...error,
        [name]: undefined,
      }))
    }
  }

  // Var

  const teamOptions = [
    {
      label: 'Not selected',
      value: -1,
    },
  ].concat(
    ...(teams?.data?.length > 0
      ? teams.data.map((team: IRegisteredTeam) => ({
          label: team?.team?.name,
          value: team?.team_id,
        }))
      : [])
  )

  const rankTableOptions = [
    {
      label: 'Not selected',
      value: -1,
    },
  ].concat(
    ...(rankTables?.data?.length > 0
      ? rankTables.data.map((rankTable: IRankTable) => ({
          label: rankTable?.name,
          value: rankTable?.id,
        }))
      : [])
  )

  const statusOptions = Object.values(matchStatus)
    .filter((status) => status !== matchStatus.COMPLETED)
    .map((status) => ({
      label: status,
      value: status,
    }))

  // ui
  if (!isFetchTeamSuccess) return null
  if (teams?.total === 0)
    return (
      <div className="flex flex-col place-self-center">
        <EmptyResult text="There is no registered team yet" />
        <Button
          type="secondary"
          size="lg"
          role="button"
          classNames="w-full lg:max-w-[230px] md:mt-[72px] self-center"
          onClick={handleBack}
          disabled={isLoading}
          isLoading={isLoading}
          tabIndex={6}
        >
          Close
        </Button>
      </div>
    )

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        if (validateForm(form)) {
          handleSubmit({
            event_id: +eventId,
            name: form.name,
            location: form.location,
            start_date: form.startDate
              ? Math.round(new Date(form.startDate).getTime())
              : null,
            end_date: form.endDate
              ? Math.round(new Date(form.endDate).getTime())
              : null,
            team1_id: form.team1,
            team2_id: form.team2,
            rank_table_id: form.rankTableId > 0 ? form.rankTableId : undefined,
            status: form.status || undefined,
          })
        }
      }}
    >
      <div className="py-8">
        <Input
          name="name"
          type="text"
          placeholder="Enter match name"
          label="Name"
          value={form.name}
          onChange={handleChangeInput}
          error={error.name}
          tabIndex={1}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputDateRangePicker
          startDate={{
            tabIndex: 2,
            required: true,
            date: form?.startDate,
            dateFormat: 'yyyy/MM/dd HH:mm',
            error: error?.startDate,
            label: 'Start Date',
            name: 'startDate',
            placeholder: 'yyyy/MM/dd HH:mm',
            showTimeSelect: true,
            onChange: (date: any) =>
              handleChangeSelectDate({ name: 'startDate', value: date }),
          }}
          endDate={{
            tabIndex: 3,
            required: true,
            date: form?.endDate,
            dateFormat: 'yyyy/MM/dd HH:mm',
            label: 'End Date',
            error: error?.endDate,
            name: 'endDate',
            placeholder: 'yyyy/MM/dd HH:mm',
            showTimeSelect: true,
            onChange: (date: any) =>
              handleChangeSelectDate({ name: 'endDate', value: date }),
          }}
        />
        <Select
          name="team1"
          placeholder="Select team 1"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'team1', value: +option })
          }}
          selectedOption={form.team1}
          options={teamOptions}
          label="Team 1"
          error={error.team1}
          tabIndex={3}
          required
        />
        <Select
          name="team2"
          placeholder="Select team 2"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'team2', value: +option })
          }}
          selectedOption={form.team2}
          options={teamOptions}
          label="Team 2"
          error={error.team2}
          tabIndex={4}
          required
        />
      </div>
      <div className="mt-8">
        <TextArea
          name="location"
          placeholder="Enter location"
          label="Location"
          value={form.location}
          onChange={handleChangeInput}
          error={error.location}
          tabIndex={5}
          required
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Select
          name="rankTableId"
          placeholder="Select rank table"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'rankTableId', value: +option })
          }}
          selectedOption={form.rankTableId}
          options={rankTableOptions}
          label="Rank Table"
          error={error.rankTableId}
          tabIndex={6}
        />
        <Select
          name="status"
          placeholder="Select status"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'status', value: option })
          }}
          selectedOption={form.status}
          options={statusOptions}
          label="Status"
          error={error.status}
          tabIndex={7}
        />
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
          tabIndex={8}
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
          tabIndex={9}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
