import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useQueryClient, useMutation } from 'react-query'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
// hooks
import { useProfile } from 'hooks/useProfile'
// helpers
import { POST_NEW as POST } from 'helpers/ssrRequest'
import { beautifyDate } from 'helpers/beautifyDate'
export { getServerSideProps } from 'helpers/loginGetServerSideProps'
import { userId } from 'helpers/cookie'
import uploadImage from 'helpers/upload'

// contexts
import { useModalDispatch } from 'context/modalContext'
// ui
import SecondStep from '@/components/register/SecondStep'
import CardEditAccount from '@/organisms/card/account/EditAccount'
import { ModalOk, ModalWrapper } from '@/organisms/Modal'
import UserLayout from '@/layout/UserLayout'
// constants
import { modalName, TModalAction } from 'constants/modal'

export default function UserProfile() {
  // Context
  const dispatch = useModalDispatch()

  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { data: profile } = useProfile(`id=${userId()}`, !!userId())

  const { mutate: mutateEditProfile } = useMutation({
    mutationFn: (form: any) => {
      return POST(`profile`, form)
    },
    onSuccess: (_response: any) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setShowErrorModal(false)
      toast('Profile updated!')
      setShowProfileModal(false)
    },
    onError: (error: any) => {
      setError(`${error?.message || error}`?.substring(0, 100))
      setShowErrorModal(true)
    },
  })

  // Function
  const handleEditAccountSetting = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_ACCOUNT_SETTING,
      hideCard: true,
      data: {
        formData: { email: user?.email },
      },
      handleOk: (form) => {
        mutateEditProfile({
          email: form?.email,
          password: form?.password,
        })
      },
    })
  }

  const handleSaveProfile = async (form: any) => {
    let newAvatar
    if (form.avatar && form.avatar.startsWith('data:image')) {
      newAvatar = await uploadImage({
        name: `${form?.name}`,
        image: form.avatar,
      })
    }

    mutateEditProfile({
      name: form?.name,
      gender: form?.gender,
      birthdate: form.birthdate ? new Date(form.birthdate).toISOString() : '',
      profile_picture: newAvatar || form?.avatar,
      weight_kg: form?.weight_kg ? +form?.weight_kg : undefined,
      height_cm: form?.height_cm ? +form?.height_cm : undefined,
    })
  }
  // Var
  const user = profile?.data?.[0]

  // Effect
  useEffect(() => {
    const overlay = document?.getElementById('modal-overlay')
    if (overlay) overlay?.classList?.toggle('hidden')
  }, [showErrorModal])

  // ui
  if (!user) return

  return (
    <UserLayout activeTab="profile">
      <div
        className="wl-user-profile form-user-profile container mx-auto mt-[56px] flex flex-col gap-6"
        key={user?.id}
      >
        <CardEditAccount
          title="Account Setting"
          onClick={handleEditAccountSetting}
          buttonText="Edit"
          gridClassNames="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-11"
          contents={[
            { label: 'Account', content: user?.email },
            { label: 'Password', content: '***' },
          ]}
        />
        <CardEditAccount
          title="Personal Information"
          onClick={() => setShowProfileModal(true)}
          buttonText="Edit"
          gridClassNames="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-11"
          contents={[
            { label: 'Name', content: user?.name },
            {
              label: 'Gender',
              content: user?.gender
                ? `${user?.gender?.[0]?.toUpperCase() + user?.gender?.slice(1)}`
                : 'N/A',
            },
            {
              label: 'Birth',
              content: user?.birthdate
                ? beautifyDate(new Date(user?.birthdate?.split('T')?.[0]), true)
                : 'N/A',
            },
          ]}
        />
        {/* START: Modal */}
        {/*} <ModalWrapper showModal={showProfileModal}>
          <SecondStep
            isActive
            handleBack={() => setShowProfileModal(false)}
            handleNext={handleSaveProfile}
            formData={{
              name: user?.name,
              gender: user?.gender,
              weight_kg: user?.weight_kg,
              height_cm: user?.height_cm,
              birthdate: user?.birthdate,
              avatar: user?.profile_picture
                ? `${user?.profile_picture}?id=${user?.updated_dt}`
                : undefined,
            }}
          />
        </ModalWrapper>*/}

        <ModalOk
          showModal={showErrorModal}
          title="Failed to update account"
          message={error}
          labelOk="Retry"
          handleCloseModal={() => {
            setShowErrorModal(false)
          }}
        />
        {/* END: Modal */}
      </div>
    </UserLayout>
  )
}
