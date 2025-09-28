import { useState } from 'react'
import { useRouter } from 'next/router'
import { cx } from 'class-variance-authority'
import { useMutation, useQueryClient } from 'react-query'

// hooks
import { useUserTeam } from 'hooks/useUserTeam'
import { useRegisteredTeam } from 'hooks/useRegisteredTeam'

// helpers
import { POST_NEW as POST, DELETE } from 'helpers/ssrRequest'
import { userId } from 'helpers/cookie'
import { getTeamName } from 'helpers/getTeamName'

// UI
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import CardTeam from '@/organisms/card/Team'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'

// constant
import { UserTeam } from 'interfaces/user_team_type'
import { IRegisteredTeam } from 'interfaces/registered_team_type'
import { TEAM_ROLE } from 'constants/role'

interface Props {
  eventId: number
  register?: boolean
  handleCloseRegister: (...args: any) => any
}

export default function RegisterTeam({
  handleCloseRegister,
  eventId,
  register,
}: Props) {
  const { replace, asPath } = useRouter()

  // State
  const [selectedTeam, setCurrentTeam] = useState<number>()
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [deleteRegisterId, setDeleteRegisterId] = useState<number | undefined>()

  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: userTeams, isLoading: isFetchTeamLoading } = useUserTeam(
    `role=${TEAM_ROLE.TEAM_MANAGER}&user_id=${userId()}`,
    !!eventId
  )
  const { data: registeredTeams } = useRegisteredTeam(
    `event_id=${eventId}`,
    !!eventId
  )
  const { mutate: mutateRegisterTeam, isLoading: isRegisterTeamLoading } =
    useMutation({
      mutationFn: (form: { team_id: number; event_id: number }) => {
        return POST('registered-team', form)
      },
      onSuccess: (_response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['registered-team'],
        })
        // toast('Team registered!')
        handleCloseRegister()
        replace(asPath)
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })
  const { mutate: mutateUnregisterTeam, isLoading: isUnregisterTeamLoading } =
    useMutation({
      mutationFn: () => {
        return DELETE(`registered-team?id=${deleteRegisterId}`)
      },
      onSuccess: (_response: any) => {
        queryClient.invalidateQueries({
          queryKey: ['registered-team', `event_id=${eventId}`],
        })
        // toast('Team un-registered!')
        handleCloseRegister()
        replace(asPath)
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
  const handleClickTeam = (teamId?: number) => setCurrentTeam(teamId)
  const handleCloseConfirmationModal = () => setShowConfirmModal(false)
  const handleRegisterTeam = () => {
    if (selectedTeam) {
      mutateRegisterTeam({
        team_id: selectedTeam,
        event_id: eventId,
      })
    }
  }
  const handleUnRegisterTeam = () => {
    setShowConfirmModal(true)
  }

  // Var
  const userRegisteredTeam =
    registeredTeams?.data?.length > 0
      ? registeredTeams?.data?.filter(
          (team: IRegisteredTeam) => team?.created_by === userId()
        )
      : null

  if (isFetchTeamLoading) return null

  return (
    <div className="wl-registered-teams container mx-auto mt-[47px] flex flex-col items-center gap-10">
      <Text size="h1" classNames="text-white">
        {register ? 'Choose team to register' : 'Choose team to unregister'}
      </Text>
      <Line />
      {/* START: Team */}
      <div className="wl-registered-teams__all text-center">
        <div className="wl-registered-teams__all__list grid grid-cols-1 lg:grid-cols-2 gap-6">
          {register &&
            userTeams?.data?.length > 0 &&
            userTeams?.data.map((userTeam: UserTeam) => {
              if (!userTeam?.team_id) return
              return (
                <div
                  key={userTeam?.team?.id}
                  role="button"
                  aria-label={`register team ${userTeam?.team?.name}`}
                  className={cx(
                    selectedTeam === userTeam?.team?.id ? 'border rounded' : ''
                  )}
                  onClick={() => {
                    handleClickTeam(userTeam?.team?.id)
                  }}
                >
                  <CardTeam
                    key={userTeam?.team?.id}
                    url={userTeam?.team?.logo}
                    content={getTeamName({
                      name: userTeam?.team?.name,
                      abbreviation: userTeam?.team?.abbreviation,
                    })}
                    name={`${userTeam?.team?.id}`}
                  />
                </div>
              )
            })}
          {!register &&
            userRegisteredTeam?.length > 0 &&
            userRegisteredTeam.map((registered: IRegisteredTeam) => {
              if (!registered) return
              return (
                <div
                  key={registered?.id}
                  role="button"
                  aria-label={`unregister team ${registered?.team?.name}`}
                  className={cx(
                    deleteRegisterId === registered?.id ? 'border rounded' : ''
                  )}
                  onClick={() => {
                    setDeleteRegisterId(registered?.id)
                  }}
                >
                  <CardTeam
                    key={registered?.team?.id}
                    url={registered?.team?.logo}
                    content={getTeamName({
                      name: registered?.team?.name,
                      abbreviation: registered?.team?.abbreviation,
                    })}
                    name={`${registered?.team?.id}`}
                  />
                </div>
              )
            })}
        </div>
        <div className="gap-4 flex justify-center">
          <Button
            type="ghost"
            size="lg"
            classNames="mt-10 "
            onClick={handleCloseRegister}
            disabled={isRegisterTeamLoading || isUnregisterTeamLoading}
            isLoading={isRegisterTeamLoading || isUnregisterTeamLoading}
            ariaLabel={register ? 'Cancel registration' : 'Cancel unregister'}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="lg"
            onClick={register ? handleRegisterTeam : handleUnRegisterTeam}
            classNames="mt-10"
            disabled={
              (!selectedTeam && !deleteRegisterId) ||
              isRegisterTeamLoading ||
              isUnregisterTeamLoading
            }
            isLoading={isRegisterTeamLoading || isUnregisterTeamLoading}
            ariaLabel={
              register ? 'Confirm registration' : 'Confirm to unregister'
            }
          >
            Confirm
          </Button>
        </div>
      </div>
      {/* END: Team */}
      {/* START: Modal */}
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to unregister from event?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={mutateUnregisterTeam}
        handleCloseModal={handleCloseConfirmationModal}
      />

      <ModalOk
        showModal={showErrorModal}
        title={
          register ? 'Failed to register team' : 'Failed to unregister team'
        }
        message={error}
        labelOk="OK"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: Modal Error */}
    </div>
  )
}
