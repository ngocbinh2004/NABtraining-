import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

// hooks
import { useSets } from 'hooks/useSets'
import { useMatches } from 'hooks/useMatches'
// helpers
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import { validateEventMatchSetRecordForm } from 'helpers/validation'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import Input from '@/molecules/form/Input'
import Select from '@/molecules/form/Select'
import { ModalOk } from '@/organisms/Modal'
// constant
import { ISetRecord } from 'interfaces/set_type'
import { useSetRecords } from 'hooks/useSetRecords'
import { useUserTeam } from 'hooks/useUserTeam'
import { UserTeam } from 'interfaces/user_team_type'

interface Props {
  setId: number
  recordId?: number
  handleBack: (...arg: any) => any
}

export default function SetRecordForm({ setId, recordId, handleBack }: Props) {
  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateSaveRecord, isLoading: isSaveRecordLoading } =
    useMutation({
      mutationFn: (form?: ISetRecord) => {
        if (recordId) {
          return PUT(`set-records?id=${recordId}`, form)
        }
        return POST('set-records', form)
      },
      onSuccess: (_response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['set-records'],
        })
        toast('Record saved!')
        handleBack()
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  // Function
  const handleSubmit = (form: ISetRecord) => mutateSaveRecord(form)

  return (
    <div key={recordId || setId}>
      {/* START: Modal Record */}
      <Text size="form-title" component="h1" classNames="title">
        {recordId ? 'Edit Record' : 'Create Record'}
      </Text>
      <Line classNames="w-[50%] mt-6 mb-8" />

      {recordId ? (
        <EditRecord
          recordId={+recordId}
          setId={setId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveRecordLoading}
        />
      ) : (
        <Form
          setId={setId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveRecordLoading}
        />
      )}
      {/* END: Modal Record */}

      {/* START: Modal Error */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to save set"
        message={error}
        labelOk="OK"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: Modal Error */}
    </div>
  )
}

function EditRecord({
  recordId,
  handleSubmit,
  handleBack,
  isLoading,
  setId,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  recordId: number
  isLoading?: boolean
  setId: number
}) {
  const { data: records, isLoading: isFetchLoading } = useSetRecords(
    `id=${recordId}`,
    !!recordId
  )

  if (isFetchLoading) return null
  const [record] = records?.data || []
  return (
    <Form
      setId={setId}
      handleSubmit={handleSubmit}
      handleBack={handleBack}
      initialData={{
        id: recordId,
        board: record?.board,
        attack: record?.attack_score,
        block: record?.block_score,
        serve: record?.serve,
        total: record?.total,
        average: record?.average,
        games: record?.games,
        setId: setId,
        userTeamId: record?.user_team_id,
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
  setId,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  initialData?: any
  isLoading?: boolean
  setId: number
}) {
  // State
  const [form, setForm] = useState<{ [key: string]: any }>({ ...initialData })
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  // Query
  const { data: sets } = useSets(`id=${setId}`, !!setId)
  const { data: matches } = useMatches(
    `id=${sets?.data?.[0]?.match_id}`,
    !!sets?.data?.[0]?.match_id
  )
  const { data: userTeam1 } = useUserTeam(
    `team_id=${matches?.data?.[0]?.team1_id}`,
    !!matches?.data?.[0]?.team1_id
  )
  const { data: userTeam2 } = useUserTeam(
    `team_id=${matches?.data?.[0]?.team2_id}`,
    !!matches?.data?.[0]?.team2_id
  )

  // Function
  const validateForm = (form: any) => {
    const { success, error } = validateEventMatchSetRecordForm(form)
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
  const [match] = matches?.data || []
  const teamOptions = [
    {
      value: match?.team1?.id,
      label: match?.team1?.name,
    },
    {
      value: match?.team2?.id,
      label: match?.team2?.name,
    },
  ]
  const playerTeam1 = userTeam1?.data || []
  const playerTeam2 = userTeam2?.data || []
  const userTeamPlayers = form.teamId
    ? form.teamId === match?.team1?.id
      ? playerTeam1
      : playerTeam2
    : []
  const userTeamOptions = [
    {
      label: 'Not selected',
      value: -1,
    },
  ].concat(
    ...(userTeamPlayers?.length > 0
      ? userTeamPlayers?.map((userTeam: UserTeam) => ({
          label: userTeam?.user?.name,
          value: userTeam.id,
        }))
      : [])
  )

  // ui
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        if (validateForm(form)) {
          handleSubmit({
            set_id: +setId,
            id: form.id,
            board: +form.board,
            attack_score: +form.attack,
            block_score: +form.block,
            serve_score: +form.serve,
            total: +form.total,
            average: form.average,
            games: +form.games,
            user_team_id: form.userTeamId,
          })
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Input
          name="board"
          type="number"
          placeholder="Enter board score"
          label="Board Score"
          value={form.board}
          onChange={handleChangeInput}
          error={error.board}
          tabIndex={1}
        />

        <Input
          name="attack"
          type="number"
          placeholder="Enter attack score"
          label="Attack Score"
          value={form.attack}
          onChange={handleChangeInput}
          error={error.attack}
          tabIndex={2}
        />
        <Input
          name="block"
          type="number"
          placeholder="Enter block score"
          label="Block Score"
          value={form.block}
          onChange={handleChangeInput}
          error={error.block}
          tabIndex={3}
        />
        <Input
          name="serve"
          type="number"
          placeholder="Enter serve score"
          label="Serve Score"
          value={form.serve}
          onChange={handleChangeInput}
          error={error.serve}
          tabIndex={4}
        />
        <Input
          name="total"
          type="number"
          placeholder="Enter total"
          label="Total"
          value={form.total}
          onChange={handleChangeInput}
          error={error.total}
          tabIndex={5}
        />
        <Input
          name="average"
          type="number"
          placeholder="Enter average"
          label="Average"
          value={form.average}
          onChange={handleChangeInput}
          error={error.average}
          tabIndex={6}
        />
        <Input
          name="games"
          type="number"
          placeholder="Enter games"
          label="Events"
          value={form.games}
          onChange={handleChangeInput}
          error={error.games}
          tabIndex={7}
        />
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Select
          name="teamId"
          placeholder="Select Team"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'teamId', value: +option })
            handleChangeSelectDate({ name: 'playerId', value: undefined })
          }}
          selectedOption={form.teamId}
          options={teamOptions}
          label="Team"
          error={error.team}
          tabIndex={8}
        />
        <Select
          name="userTeamId"
          placeholder="Select Player"
          onChange={(option: any) => {
            handleChangeSelectDate({ name: 'userTeamId', value: +option })
          }}
          selectedOption={form.userTeamId}
          options={userTeamOptions}
          label="Player"
          error={error.userTeamId}
          tabIndex={9}
          required
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
          tabIndex={10}
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
          tabIndex={11}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
