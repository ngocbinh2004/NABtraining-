import { cx } from 'class-variance-authority'

import Button from '@/atoms/Button'
import { Ticket } from '@/molecules/card/LabelContent'
import CardWrapper from '@/organisms/card/Wrapper'

interface Props {
  name?: string
  classNames?: string
  contents?: { label: string; content: string }[]
  showEdit?: boolean
  showDelete?: boolean
  handleDeleteTeam?: (...args: any) => any
  handleEditTeam?: (...args: any) => any
  handleEditMember?: (...args: any) => any
}

export default function CardEditTeam({
  name,
  classNames,
  contents,
  handleDeleteTeam,
  handleEditTeam,
  handleEditMember,
  showEdit,
  showDelete,
}: Props) {
  return (
    <CardWrapper
      classNames={cx(
        classNames,
        'wl-card-edit-team',
        'flex flex-col justify-between',
        'w-full'
      )}
      name={name}
    >
      <div className="wl-card-edit-team__content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-11">
          {contents?.length &&
            contents?.length > 0 &&
            contents.map(({ label, content }) => (
              <Ticket.LabelContent
                key={label}
                label={label}
                content={content}
              />
            ))}
        </div>
      </div>
      {showEdit && (
        <div className="wl-card-edit-team__footer flex flex-col gap-4 items-center mt-4">
          {showDelete && (
            <Button
              size="sm"
              type="ghost"
              onClick={(e) => {
                e.preventDefault()
                if (handleDeleteTeam) handleDeleteTeam()
              }}
            >
              Delete
            </Button>
          )}
          <Button
            size="sm"
            type="primary"
            onClick={(e) => {
              e.preventDefault()
              if (handleEditTeam) handleEditTeam()
            }}
          >
            Edit Team
          </Button>
          <Button
            size="sm"
            type="primary"
            onClick={(e) => {
              e.preventDefault()
              if (handleEditMember) handleEditMember()
            }}
          >
            Edit Member
          </Button>
        </div>
      )}
    </CardWrapper>
  )
}
