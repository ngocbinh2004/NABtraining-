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
import { TEAM_ROLE } from 'constants/role'

const roleOptions =
  Object.values(TEAM_ROLE).map((role: string) => ({
    label: role,
    value: role,
  })) ?? []

interface Props {
  handleBack: (...args: any) => any
  userTeamId: number
  teamId: number
  role: string
}

export default function TeamRoleForm({
  handleBack,
  userTeamId,
  teamId,
  role: initialRole,
}: Props) {
  // State
  const [role, setRole] = useState<string | undefined>(initialRole)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateUpdateRole, isLoading: isUpdateRoleLoading } =
    useMutation({
      mutationFn: () => {
        return PUT(`user-team?id=${userTeamId}`, { role })
      },
      onSuccess: (_response: any) => {
        queryClient.refetchQueries({
          queryKey: ['user-team', `team_id=${teamId}`],
        })

        toast('User role saved!')
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
        name="role"
        label="Player Role"
        options={roleOptions}
        selectedOption={role}
        placeholder="Select Role"
        onChange={(option: any) => setRole(option)}
      />
      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="secondary"
          size="lg"
          onClick={handleBack}
          disabled={isUpdateRoleLoading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="lg"
          onClick={mutateUpdateRole}
          disabled={!role || isUpdateRoleLoading}
          isLoading={isUpdateRoleLoading}
        >
          Save
        </Button>
      </div>
      <ModalOk
        showModal={showErrorModal}
        title="Failed to update role"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={() => {
          setShowErrorModal(false)
        }}
      />
    </div>
  )
}
