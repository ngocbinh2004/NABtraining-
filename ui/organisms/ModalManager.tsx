import dynamic from 'next/dynamic'
import { cx } from 'class-variance-authority'

// hooks
import { useOverflowBody } from 'hooks/useOverflowBody'
// context
import { useModalDispatch, useModal } from 'context/modalContext'
// ui
import CardWrapper from './card/Wrapper'
import ModalFileImage from '@/molecules/form/ModalFileImage'

// constant
import { TModalAction, modalName } from 'constants/modal'

// modal
const EventRuleRegulation = dynamic(
  () => import('@/components/competition/RuleRegulationModal')
)
const EventForm = dynamic(() => import('@/components/profile/games/EventForm'))
const FirstStep = dynamic(() => import('@/components/register/FirstStep'))
const MatchForm = dynamic(() => import('@/components/profile/games/MatchForm'))
const RankTableForm = dynamic(
  () => import('@/components/profile/games/RankTableForm')
)
const RegisterTeam = dynamic(
  () => import('@/components/competition/RegisterTeam')
)
const SetForm = dynamic(() => import('@/components/profile/games/SetForm'))
const SetRecordForm = dynamic(
  () => import('@/components/profile/games/SetRecordForm')
)
const TeamMemberForm = dynamic(
  () => import('@/components/profile/teams/TeamMemberForm')
)
const TeamPositionForm = dynamic(
  () => import('@/components/profile/teams/TeamPositionForm')
)
const TeamRoleForm = dynamic(
  () => import('@/components/profile/teams/TeamRoleForm')
)
const TeamProfileForm = dynamic(
  () => import('@/components/profile/teams/TeamProfileForm')
)

export default function ModalManager() {
  // Context
  const modals = useModal()
  const dispatch = useModalDispatch()

  // Function
  const handlePopModal = () => {
    dispatch({
      type: TModalAction.POP,
    })
  }

  // Var
  const { name, data, handleOk, hideCard } = modals[modals?.length - 1] || {}

  // Effect
  useOverflowBody({ hideOverflow: modals?.length > 0 })

  // ui
  if (!modals?.length) return null
  if (!name) return null
  return (
    <div
      id="modal-overlay"
      className="wl-modal__overlay fixed flex w-screen h-screen items-center justify-center text-white bg-black-900 top-0 left-0 z-[100] overflow-hidden"
      onClick={(e: any) => {
        const overlayClicked = e?.target && e?.target?.id === 'modal-overlay'
        if (overlayClicked) {
          handlePopModal()
        }
      }}
    >
      <CardWrapper
        classNames={cx(
          'p-5 lg:py-20 lg:px-[75px] max-h-[90vh] lg:max-h-[80vh] overflow-x-auto',
          hideCard ? 'bg-none' : ''
        )}
      >
        {name === modalName.REGISTER_TEAM && (
          <RegisterTeam handleCloseRegister={handlePopModal} {...data} />
        )}
        {name === modalName.EDIT_MEMBER && (
          <TeamMemberForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.EDIT_MEMBER_POSITION && (
          <TeamPositionForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.EDIT_MEMBER_ROLE && (
          <TeamRoleForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.EDIT_EVENT && (
          <EventForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.RANK_TABLE && (
          <RankTableForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.MATCH && (
          <MatchForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.SET && (
          <SetForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.SET_RECORD && (
          <SetRecordForm handleBack={handlePopModal} {...data} />
        )}
        {name === modalName.EDIT_ACCOUNT_SETTING && (
          <FirstStep
            isActive
            handleBack={handlePopModal}
            handleNext={handleOk}
            {...data}
          />
        )}
        {name === modalName.EVENT_RULES && (
          <EventRuleRegulation {...data} handleClose={handlePopModal} />
        )}
        {name === modalName.EDIT_IMAGE && (
          <ModalFileImage {...data} handleClose={handlePopModal} />
        )}
      </CardWrapper>
    </div>
  )
}
