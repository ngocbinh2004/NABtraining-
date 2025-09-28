// @TODO: mark the components with hook
// @TODO: mark the components with modal confirmation

import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
// helpers
import { PUT } from 'helpers/ssrRequest'

// ui
import Button from '@/atoms/Button'
import Select from '@/molecules/form/Select'
import { ModalOk } from '@/organisms/Modal'

// constants
import { POSITION_ROLE } from 'constants/role'

const positionOptions =
  Object.values(POSITION_ROLE).map((position: string) => ({
    label: position,
    value: position,
  })) ?? []

interface Props {
  handleBack: (...args: any) => any
  userTeamId: number
  teamId: number
  position: string
}

export default function TeamPositionForm({
  handleBack,
  userTeamId,
  teamId,
  position: initialPosition,
}: Props) {
  // State
  const [position, setPosition] = useState<string | undefined>(initialPosition)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateUpdatePosition, isLoading: isUpdatePositionLoading } =
    useMutation({
      mutationFn: () => {
        return PUT(`user-team?id=${userTeamId}`, { position: position || null })
      },
      onSuccess: (_response: any) => {
        queryClient.refetchQueries({
          queryKey: ['user-team', `team_id=${teamId}`],
        })
        toast('Member position saved!')
        handleBack()
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  return (
    <div className="min-w-[300px] w-[90vw] md:w-[600px] flex flex-col gap-4">
      <Select
        name="position"
        label="Player Position"
        options={[
          { value: undefined, label: 'Not selected' },
          ...positionOptions,
        ]}
        selectedOption={position}
        placeholder="Select Position"
        onChange={(option: any) => setPosition(option)}
      />
      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="secondary"
          size="lg"
          onClick={handleBack}
          disabled={isUpdatePositionLoading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="lg"
          onClick={mutateUpdatePosition}
          disabled={isUpdatePositionLoading}
          isLoading={isUpdatePositionLoading}
        >
          Save
        </Button>
      </div>
      <ModalOk
        showModal={showErrorModal}
        title="Failed to update position"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={() => {
          setShowErrorModal(false)
        }}
      />
    </div>
  )
}
