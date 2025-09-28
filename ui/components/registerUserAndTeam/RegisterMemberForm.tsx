import { useState } from 'react'
// ui
import Button from '@/atoms/Button'
import Input from '@/molecules/form/Input'
import CardWrapper from '@/organisms/card/Wrapper'

interface IProps {
  member?: {
    id?: number
    name?: string
    email?: string
  }
  handleClose: (...args: any) => any
  handleSave: (...args: any) => any
}

export default function RegisterMemberForm({
  member = {},
  handleClose,
  handleSave,
}: IProps) {
  const [activeMember, setActiveMember] = useState({ ...member })
  return (
    <CardWrapper classNames="wl-register-member-form w-full max-w-[500px]">
      <div className="flex flex-col gap-3">
        <Input
          name="name"
          type="text"
          placeholder="Enter name"
          label="Name"
          value={activeMember?.name}
          required
          onChange={(e) =>
            setActiveMember({
              ...activeMember,
              name: e?.target?.value,
            })
          }
        />
        <Input
          name="email"
          type="email"
          placeholder="Enter email"
          label="Email"
          value={activeMember?.email}
          required
          onChange={(e) =>
            setActiveMember({
              ...activeMember,
              email: e?.target?.value,
            })
          }
        />
        <div className="wl-register-team-member-form__footer flex flex-row gap-4 justify-center pt-4">
          <Button size="md" type="ghost" onClick={handleClose}>
            Close
          </Button>
          <Button
            size="md"
            type="primary"
            disabled={
              !activeMember?.email?.trim()?.length ||
              !activeMember?.name?.trim()?.length
            }
            onClick={() => handleSave(activeMember)}
          >
            {activeMember?.id ? 'Edit' : 'Add'}
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}
