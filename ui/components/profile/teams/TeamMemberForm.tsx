import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

// hooks
import { useUserTeam } from 'hooks/useUserTeam'

// helpers
import { DELETE, POST_NEW as POST } from 'helpers/ssrRequest'

// context
import { useModalDispatch } from 'context/modalContext'

// UI
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Input from '@/molecules/form/Input'
import Image from '@/molecules/media/Image'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'

// constants
import { UserTeam } from 'interfaces/user_team_type'
import { TModalAction, modalName } from 'constants/modal'

interface Props {
  handleBack: () => any
  teamId: number
  canUpdateTeamRole?: boolean
}

export default function TeamMemberForm({
  handleBack,
  teamId,
  canUpdateTeamRole,
}: Props) {
  // Context
  const dispatch = useModalDispatch()
  // State
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
  })
  const [userTeamId, setUserTeamId] = useState<number | undefined>()
  const [showConfirmModalRemove, setShowConfirmModalRemove] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: userTeams } = useUserTeam(`team_id=${teamId}`, !!teamId)

  const { mutate: mutateInvitePlayer, isLoading: isInvitePlayerLoading } =
    useMutation({
      mutationFn: (form: { email: string; name: string }) => {
        return POST(`user-team-invite`, {
          team_id: teamId,
          email: form?.email,
          name: form?.name,
        })
      },
      onSuccess: (_response: any) => {
        toast('Player invited!')
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })
  const { mutate: mutateRemovePlayer, isLoading: isRemovePlayerLoading } =
    useMutation({
      mutationFn: (activeUserTeam?: number) => {
        return DELETE(`/user-team?id=${activeUserTeam}`)
      },
      onSuccess: (_response: any) => {
        toast('Player removed!')
        queryClient.invalidateQueries({
          queryKey: ['user-team'],
        })
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
      onSettled: () => {
        setShowConfirmModalRemove(false)
      },
    })

  // Function
  const handleRemovePlayer = (userTeamId: number) => {
    setUserTeamId(userTeamId)
    setShowConfirmModalRemove(true)
  }

  const handleEditPosition = (userTeamId: number, position?: string) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_MEMBER_POSITION,
      data: {
        userTeamId,
        teamId,
        position,
      },
    })
  }

  const handleEditRole = (userTeamId: number, role?: string) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_MEMBER_ROLE,
      data: {
        userTeamId,
        teamId,
        role,
      },
    })
  }

  // UI
  return (
    <>
      <div
        className="form-team-member__form max-h-[90vh] w-[90vw] md:w-fit lg:w-[60vw] flex flex-col gap-4"
        key={teamId}
      >
        <Text size="form-title" component="h1" classNames="title">
          Team Member
        </Text>
        <Line classNames="w-[50%] lg:mt-6 mb-8" />
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <Input
            name="name"
            type="text"
            placeholder="Enter name"
            label="Name"
            value={inviteForm?.name}
            required
            onChange={(e) =>
              setInviteForm({
                ...inviteForm,
                name: e?.target?.value,
              })
            }
          />
          <Input
            name="email"
            type="email"
            placeholder="Enter email"
            label="Email"
            value={inviteForm?.email}
            required
            onChange={(e) =>
              setInviteForm({
                ...inviteForm,
                email: e?.target?.value,
              })
            }
          />
          <Button
            size="md"
            type="primary"
            classNames="h-20"
            disabled={
              !inviteForm?.email?.trim()?.length ||
              !inviteForm?.name?.trim()?.length ||
              isInvitePlayerLoading
            }
            onClick={() => {
              if (inviteForm?.email && inviteForm?.name) {
                mutateInvitePlayer(inviteForm)
                setInviteForm({ name: '', email: '' })
              }
            }}
            isLoading={isInvitePlayerLoading}
          >
            Invite
          </Button>
        </div>
        <Text classNames="lg:mt-10">Member</Text>
        <div className="flex flex-col max-h-[40vh] overflow-y-auto">
          <Line />
          {userTeams?.data &&
            userTeams?.data?.length > 0 &&
            userTeams.data.map((userTeam: UserTeam) => (
              <div key={userTeam.id}>
                <div className="grid grid-cols-2 lg:grid-cols-8 my-2 gap-2 py-2">
                  <div className="lg:col-span-2 flex">
                    {userTeam?.user?.profile_picture && (
                      <Image
                        classNames="shrink-0 mr-4"
                        width={24}
                        height={24}
                        alt={userTeam?.user?.name}
                        url={userTeam?.user?.profile_picture}
                        isCircle
                        withZoom
                      />
                    )}
                    <Text breakWord="all">{userTeam?.user?.name}</Text>
                  </div>
                  <div className="lg:col-span-2 text-right">
                    <Text breakWord="all" classNames="capitalize">
                      {`${userTeam?.position || ''}`
                        ?.replace('_', ' ')
                        ?.toLowerCase()}
                    </Text>
                  </div>

                  <div className="lg:col-span-2 text-left lg:text-right">
                    <Text breakWord="all" classNames="capitalize">
                      {`${userTeam?.role || ''}`
                        ?.replace('_', ' ')
                        ?.toLowerCase()}
                    </Text>
                  </div>
                  <div className="lg:col-span-2 flex flex-col lg:flex-row gap-2 flex-auto items-end">
                    {canUpdateTeamRole && (
                      <Button
                        size="sm"
                        type="primary"
                        classNames="w-fit h-fit px-4"
                        role="button"
                        onClick={() =>
                          handleEditRole(userTeam?.id, userTeam?.role)
                        }
                        disabled={isRemovePlayerLoading}
                      >
                        Edit Role
                      </Button>
                    )}

                    <Button
                      size="sm"
                      type="primary"
                      classNames="w-fit h-fit px-4"
                      role="button"
                      onClick={() =>
                        handleEditPosition(userTeam?.id, userTeam?.position)
                      }
                      disabled={isRemovePlayerLoading}
                    >
                      Edit Position
                    </Button>

                    <Button
                      size="sm"
                      type="ghost"
                      classNames="w-fit h-fit px-4"
                      onClick={() => handleRemovePlayer(userTeam?.id)}
                      disabled={isRemovePlayerLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <Line />
              </div>
            ))}
        </div>
        <div className="md:mt-[72px] flex w-full justify-center">
          <Button
            type="secondary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={handleBack}
            disabled={isInvitePlayerLoading || isRemovePlayerLoading}
            isLoading={isInvitePlayerLoading || isRemovePlayerLoading}
          >
            Close
          </Button>
        </div>
      </div>
      {/* START: Modal */}
      <ModalConfirmation
        showModal={showConfirmModalRemove}
        title="Are you sure to remove player?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={() => mutateRemovePlayer(userTeamId)}
        handleCloseModal={() => {
          setShowConfirmModalRemove(false)
        }}
      />
      <ModalOk
        showModal={showErrorModal}
        title="Failed to update team"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={() => {
          setShowErrorModal(false)
        }}
      />
      {/* END: Modal */}
    </>
  )
}
