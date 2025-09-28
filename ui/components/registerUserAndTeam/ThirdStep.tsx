import { useState } from 'react'
import { toast } from 'react-toastify'
// ui
import Button from '@/atoms/Button'
import Text from '@/atoms/Text'
import Line from '@/atoms/Line'
import ButtonIcon from '@/atoms/ButtonIcon'
import CardWrapper from '@/organisms/card/Wrapper'
import Table from '@/organisms/table/Table'
import { ModalConfirmation, ModalWrapper } from '@/organisms/Modal'
import RegisterMemberForm from '@/components/registerUserAndTeam/RegisterMemberForm'

type TMember = {
  id?: number
  name?: string
  email?: string
}

interface IProps {
  handleBack: (...data: any) => any
  handleNext: (...data: any) => any
  formData?: TMember[]
  isLoading?: boolean
}

export default function ThirdStep({
  handleBack,
  handleNext,
  isLoading,
  formData = [],
}: IProps) {
  // State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRegisterMember, setShowRegisterMemberModal] = useState(false)
  const [members, setMembers] = useState<TMember[] | undefined>(formData)
  const [activeMember, setActiveMember] = useState<TMember | undefined>({})
  const [deleteMemberId, setDeleteMemberId] = useState<number | undefined>()

  // Functions
  const showAddNewMemberModal = () => setShowRegisterMemberModal(true)
  const handleAddMember = (member?: TMember) => {
    if (!member) return

    const hasEmail = formData.some(({ email }) => email === member?.email)
    if (!hasEmail) {
      setMembers((members?: TMember[]) => [
        ...(members || []),
        { id: new Date().getTime(), ...member },
      ])
      setActiveMember({})
      setShowRegisterMemberModal(false)
    } else {
      toast.error('Member email already registered in team')
      // toast
    }
  }

  const showEditMemberModal = (id?: number) => {
    const member = members?.find((member: TMember) => id === member?.id)
    if (!member) return
    setActiveMember(member)
    setShowRegisterMemberModal(true)
  }
  const handleEditMember = (member: TMember) => {
    setMembers((members?: TMember[]) =>
      members?.map((m) => {
        if (m.id !== member?.id) return m
        return {
          ...member,
        }
      })
    )
    setActiveMember({})
    setShowRegisterMemberModal(false)
  }

  function showDeleteConfirmationModal(id?: number) {
    setShowConfirmModal(true)
    setDeleteMemberId(id)
  }
  function handleDeleteMember() {
    if (!deleteMemberId) return
    setMembers((members?: TMember[]) =>
      members?.filter((member: TMember) => deleteMemberId !== member?.id)
    )
    setShowConfirmModal(false)
  }

  // Var
  const TABLE_COLUMNS = [
    {
      key: 'name',
      label: 'Name',
      className: 'min-w-[200px]',
    },
    {
      key: 'email',
      label: 'email',
      className: 'min-w-[200px]',
    },
    {
      key: 'action',
      label: 'Action',
      className: 'text-right',
      render: (member: TMember) => {
        if (!member?.id) {
          return <td key={member?.id}></td>
        }

        return (
          <td key={member.id}>
            <div className="flex flex-col items-end gap-2 ">
              <Button
                ariaLabel="Delete Member"
                type="ghost"
                size="sm"
                onClick={() => showDeleteConfirmationModal(member.id)}
              >
                Delete
              </Button>
              <Button
                ariaLabel="Edit Member"
                type="primary"
                size="sm"
                onClick={() => showEditMemberModal(member.id)}
              >
                Edit
              </Button>
            </div>
          </td>
        )
      },
    },
  ]

  return (
    <div className="wl-register-user-team__step-3">
      <CardWrapper classNames="wl-register-user-team__step-3__content mt-[56px] p-8 lg:py-[56px] lg:px-10">
        <Text size="form-title" component="h1" classNames="title">
          Team Members
        </Text>
        <Line classNames="w-[50%] mt-6 mb-8" />
        <div className="w-full flex gap-2 items-center justify-end mt-10">
          <ButtonIcon
            type="increase"
            onClick={showAddNewMemberModal}
            ariaLabel="Add member"
          />
          Add Member
        </div>
        <div className="wl-register-user-team__step-3__member-list w-full h-full max-h-[50vh]">
          <Table
            columns={TABLE_COLUMNS}
            records={members}
            emptyLabel="No member yet"
            columnSize={4}
          />
        </div>
        <div className="wl-register-user-team__step-3__footer mt-[72px] w-full flex flex-col lg:flex-row lg:justify-end gap-[18px]">
          <Button
            type="secondary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={() => handleBack(members)}
            isLoading={isLoading}
          >
            Back
          </Button>
          <Button
            type="primary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={() => handleNext(members)}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </div>
      </CardWrapper>

      {/* START: Team Member Modal */}
      <ModalWrapper showModal={showRegisterMember}>
        <RegisterMemberForm
          member={activeMember || {}}
          handleClose={() => {
            setActiveMember({})
            setShowRegisterMemberModal(false)
          }}
          handleSave={(member) => {
            if (member?.id) {
              handleEditMember(member)
            } else {
              handleAddMember(member)
            }
          }}
        />
      </ModalWrapper>
      {/* END: Team Member modal */}
      <ModalConfirmation
        showModal={showConfirmModal}
        title="Are you sure to remove member?"
        message="This action can not be reverted"
        labelCancel="Cancel"
        labelOk="Delete"
        handleOk={handleDeleteMember}
        handleCloseModal={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
