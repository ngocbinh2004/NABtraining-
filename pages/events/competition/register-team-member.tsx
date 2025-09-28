import { useState } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'

// hooks
// import { useMatches } from 'hooks/useMatches'
// import { useEvents } from 'hooks/useEvents'
// helpers
// import { userId } from 'helpers/cookie'
// import { beautifyISODate } from 'helpers/beautifyDate'
// import { DELETE } from 'helpers/ssrRequest'
import { POST_NEW as POST } from 'helpers/ssrRequest'

// context

// ui
import Text from '@/atoms/Text'
import { ModalOk } from '@/organisms/Modal'
import UserGameLayout from '@/layout/UserGameLayout'
import FirstStep from '@/components/register/FirstStep'
import ThirdStep from '@/components/registerUserAndTeam/ThirdStep'
import SecondStep from '@/components/registerUserAndTeam/SecondStep'

// constants
import { Events } from 'interfaces/event_type'

// import { modalName, TModalAction } from 'constants/modal'
// import { IMatches } from 'interfaces/match_type'
import { getEvent } from 'helpers/api'
import { SITE_ROLE } from 'constants/role'

interface Props {
  event?: Events
  userId?: number
}

type TFormData = {
  step1: any
  step2: any
  step3: any
}

export default function RegisterTeamMember({ event, userId }: Props) {
  // Context
  const { push } = useRouter()

  // State
  const [activeStep, setActiveStep] = useState(userId ? 2 : 1)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [formData, setFormData] = useState<TFormData>({
    step1: {
      id: userId,
    },
    step2: {},
    step3: [],
  })

  // Query
  const { mutate: mutateRegisterTeamMember, isLoading: isRegisterLoading } =
    useMutation({
      mutationFn: (formData: TFormData) => {
        const team = {
          ...formData?.step2,
          category_id: event?.category_id,
        }
        const member =
          formData?.step3?.length > 0
            ? formData?.step3?.map(({ id, ...m }: { [key: string]: any }) => m)
            : formData?.step3
        const profile: { [key: string]: any } = {
          ...formData?.step1,
          role: SITE_ROLE.ADMIN,
        }
        const users = [...(member || []), profile]
        if (profile?.confirmPassword) delete profile?.confirmPassword
        return POST('register-user-team', {
          team,
          users,
          events: { id: event?.id },
        })
      },
      onSuccess: (_response: any) => {
        toast('Registration Success! Please check your email')
        if (userId) {
          setTimeout(() => {
            setCookie('FROM', `/events/competition/${event?.id}`)
            push('/login')
          }, 2000)
        }
        // push('/events/competition/register-payment-info')
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  // Function
  const goToNext = (data: unknown) => {
    const newFormData = { ...formData, [`step${activeStep}`]: data }
    setFormData(newFormData)

    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }

    if (activeStep === 3) {
      mutateRegisterTeamMember(newFormData)
    }
  }
  const goToPrev = (data: unknown) => {
    if (activeStep === 1) {
      return push(`/events/competition/${event?.id}`)
    }
    setFormData({ ...formData, [`step${activeStep}`]: data })
    setActiveStep(activeStep - 1)
  }

  // const handleCloseErrorModal = () => setShowErrorModal(false)
  // ui
  if (!event?.id) return null
  return (
    <UserGameLayout
      title="Register Team"
      subtitle={`${event?.name}`}
      key={event?.id}
    >
      {!userId && (
        <div className="flex flex-col">
          <Text classNames="text-blue-700" size="h4">
            * This will create a team for you and your team member
          </Text>
          <Text classNames="text-blue-700" size="h4">
            ** Leaving this page before submit will remove all data
          </Text>
        </div>
      )}
      {activeStep === 1 && (
        <div className="flex flex-col">
          <FirstStep
            isActive
            isCreate
            fromCompetition
            handleBack={goToPrev}
            handleNext={goToNext}
            formData={formData.step1}
          >
            <Text component="label" size="form-label">
              Use this credential to login
            </Text>
          </FirstStep>
        </div>
      )}
      {activeStep === 2 && event?.id && (
        <SecondStep
          handleBack={goToPrev}
          handleNext={goToNext}
          formData={formData.step2}
        />
      )}
      {activeStep === 3 && event?.id && (
        <ThirdStep
          handleBack={goToPrev}
          handleNext={goToNext}
          formData={formData.step3}
          isLoading={isRegisterLoading}
        />
      )}

      {/* START: MODAL */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to register"
        message={error || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: MODAL */}
    </UserGameLayout>
  )
}

export const getServerSideProps = async ({
  query,
  req,
  res,
}: {
  query: {
    [key: string]: any
  }
  res: NextApiResponse
  req: NextApiRequest
}) => {
  const sessionId = getCookie('SESSION', { req, res })
  const eventsResp = await getEvent(`?id=${query?.event}`)
  if (sessionId && typeof sessionId === 'string') {
    const user = jwt.decode(sessionId) as JwtPayload
    return {
      props: {
        event: eventsResp?.data?.data?.[0],
        userId: user?.id,
      },
    }
  }

  return {
    props: {
      event: eventsResp?.data?.data?.[0],
    },
  }
}
