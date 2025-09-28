import { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { useTranslation } from 'next-i18next'

import { useOverflowBody } from 'hooks/useOverflowBody'

import { POST_NEW as POST } from 'helpers/ssrRequest'
import uploadImage from 'helpers/upload'

import { ModalOk } from '@/organisms/Modal'

import FirstStep from '@/components/register/FirstStep'
import SecondStep from '@/components/register/SecondStep'
import ThirdStep from '@/components/register/ThirdStep'
import FourthStep from '@/components/register/FourthStep'

// No Login Route
export { getServerSideProps } from 'helpers/noLoginGetServerSideProps'

export default function SignUp() {
  const { t } = useTranslation()
  const [activeForm, setActiveForm] = useState(1)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handleBack = () => setActiveForm((activeForm) => activeForm - 1)
  const goToNextStep = () => setActiveForm((activeForm) => activeForm + 1)

  const [email, setEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')

  const [login, setLogin] = useState({
    email: '',
    verify_code: '',
  })

  const [personal, setPersonal] = useState({
    name: '',
    first_name: '',
    last_name: '',
    gender: '',
    birthdate: '',
    password: '',
    avatar: '',
    weight_kg: null,
    height_kg: null,
  })

  useEffect(() => {
    setLogin((prevState) => ({
      ...prevState,
      email: email,
    }))
  }, [email])

  useEffect(() => {
    setLogin((prevState) => ({
      ...prevState,
      verify_code: verifyCode,
    }))
  }, [verifyCode])

  const { mutate: mutateRegister, isLoading: isRegisterLoading } = useMutation({
    mutationFn: async () => {
      let newAvatar
      if (personal.avatar && personal.avatar.startsWith('data:image')) {
        newAvatar = await uploadImage({
          name: `${personal?.name}`,
          image: personal.avatar,
        })
      }
      console.log('HCAM - personal: ', personal)
      return POST('register', {
        name: personal.name,
        email: login.email,
        gender: personal.gender,
        password: personal.password,
        birthdate: personal.birthdate
          ? new Date(personal.birthdate).toISOString()
          : undefined,
        profile_picture: newAvatar || personal.avatar,
      })
    },
    onSuccess: (_response: any) => {
      if (activeForm === 3) goToNextStep()
      if (activeForm === 4) toast(t('SignUp.successful_toast'))
    },
    onError: (error: any) => {
      setError(`${error?.message || error}`?.substring(0, 100))
      setShowErrorModal(true)
    },
  })

  const { mutate: mutateVerifyCode, isLoading: isVerifyCodeLoading } =
    useMutation({
      mutationFn: async ({ email, code }: { email: string; code: string }) => {
        return POST('verify-code', { email, code })
      },
      onSuccess: (_response: any) => {
        if (activeForm === 2) goToNextStep()
      },
      onError: (error: any) => {
        setError(`${error?.message || error}`?.substring(0, 100))
        setShowErrorModal(true)
      },
    })

  useOverflowBody({ hideOverflow: showErrorModal })

  return (
    <div className="form-sign-in">
      <ModalOk
        showModal={showErrorModal}
        title={
          activeForm === 2
            ? t('SignUp.Page2.verify_code_failed')
            : t('SignUp.FailedPage.title')
        }
        message={error}
        labelOk={t('SignUp.FailedPage.btn_retry')}
        handleCloseModal={() => {
          setShowErrorModal(false)
          activeForm === 2 ? setActiveForm(2) : setActiveForm(1)
        }}
      />

      <FirstStep
        isActive={activeForm === 1}
        isCreate
        handleNext={(personal) => {
          setPersonal(personal)
          goToNextStep()
        }}
      />
      <SecondStep
        isActive={activeForm === 2}
        handleNext={(code) => {
          setVerifyCode(code)
          // mutateVerifyCode({ email, code })
          goToNextStep()
        }}
        handleInfo={(email) => {
          setEmail(email)
        }}
        isCreate
        isLoading={isVerifyCodeLoading}
        disabled={isVerifyCodeLoading}
      />
      <ThirdStep
        isActive={activeForm === 3}
        personal={personal}
        login={login}
        handleBack={() => {
          setActiveForm(1)
        }}
        handleNext={mutateRegister}
        isLoading={isRegisterLoading}
        disabled={isRegisterLoading}
      />
      <FourthStep isActive={activeForm === 4} resendEmail={mutateRegister} />
    </div>
  )
}
