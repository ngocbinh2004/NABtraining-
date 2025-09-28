import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

// hooks
import { useSets } from 'hooks/useSets'
import { useMatches } from 'hooks/useMatches'
// helpers
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import { validateEventMatchSetForm } from 'helpers/validation'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import Input from '@/molecules/form/Input'
import { ModalOk } from '@/organisms/Modal'
// constant
import { ISet } from 'interfaces/set_type'

interface Props {
  matchId: number
  setId?: number
  handleBack: (...arg: any) => any
}

export default function SetForm({ matchId, setId, handleBack }: Props) {
  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateSaveSet, isLoading: isSaveSetLoading } = useMutation({
    mutationFn: (form?: ISet) => {
      if (setId) {
        return PUT(`sets?id=${setId}`, form)
      }
      return POST('sets', form)
    },
    onSuccess: (_response: any) => {
      queryClient.invalidateQueries({
        queryKey: ['sets'],
      })
      toast('Set saved!')
      handleBack()
    },
    onError: (error: any) => {
      setShowErrorModal(true)
      setError(`${error?.message || error}`?.substring(0, 100))
    },
  })

  // Function
  const handleSubmit = (form: ISet) => mutateSaveSet(form)

  return (
    <div key={setId}>
      {/* START: Modal Set */}
      <Text size="form-title" component="h1" classNames="title">
        {setId ? 'Edit Set' : 'Create Set'}
      </Text>
      <Line classNames="w-[50%] mt-6 mb-8" />

      {setId ? (
        <EditSet
          matchId={matchId}
          setId={setId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveSetLoading}
        />
      ) : (
        <Form
          matchId={matchId}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          isLoading={isSaveSetLoading}
        />
      )}
      {/* END: Modal Set */}

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

function EditSet({
  matchId,
  handleSubmit,
  handleBack,
  isLoading,
  setId,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  matchId: number
  isLoading?: boolean
  setId: number
}) {
  const { data: sets, isLoading: isFetchLoading } = useSets(
    `id=${setId}`,
    !!setId
  )

  if (isFetchLoading) return null
  const [set] = sets?.data || []
  return (
    <Form
      matchId={matchId}
      handleSubmit={handleSubmit}
      handleBack={handleBack}
      initialData={{
        id: setId,
        name: set?.name,
        team1Score: +set?.team1_score,
        team2Score: +set?.team2_score,
        matchId: set?.match_id,
        no: set?.no,
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
  matchId,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  initialData?: any
  isLoading?: boolean
  matchId: number
}) {
  // State
  const [form, setForm] = useState<{ [key: string]: any }>({ ...initialData })
  const [error, setError] = useState<{
    [key: string]: any
  }>({})
  // Query
  const { data: matches } = useMatches(`id=${matchId}`)

  // Function
  const validateForm = (form: any) => {
    const { success, error } = validateEventMatchSetForm(form)
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

  // Var
  const [match] = matches?.data || []

  // ui
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        if (validateForm(form)) {
          handleSubmit({
            match_id: +matchId,
            id: form.id,
            name: form.name,
            team1_score: form.team1Score ? +form.team1Score : 0,
            team2_score: form.team2Score ? +form.team2Score : 0,
            team1_id: match?.team1_id,
            team2_id: match?.team2_id,
            no: +form.no,
          })
        }
      }}
    >
      <div className="py-8">
        <Input
          name="name"
          type="text"
          placeholder="Enter set name"
          label="Name"
          value={form.name}
          onChange={handleChangeInput}
          error={error.name}
          tabIndex={1}
          required
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Input
          name="team1Score"
          type="number"
          placeholder="Enter score"
          label={`${matches?.data?.[0]?.team1?.name} Score`}
          value={form.team1Score}
          onChange={handleChangeInput}
          error={error.team1Score}
          tabIndex={2}
        />
        <Input
          name="team2Score"
          type="number"
          placeholder="Enter score"
          label={`${matches?.data?.[0]?.team2?.name} Score`}
          value={form.team2Score}
          onChange={handleChangeInput}
          error={error.team2Score}
          tabIndex={3}
        />
        <Input
          name="no"
          type="number"
          placeholder="Enter no"
          label="No."
          value={form.no}
          onChange={handleChangeInput}
          error={error.no}
          tabIndex={4}
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
          tabIndex={5}
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
          tabIndex={6}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
