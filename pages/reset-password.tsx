import { cx } from 'class-variance-authority'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'

import { validateResetPasswordForm } from 'helpers/validation'
import { POST_NEW as POST } from 'helpers/ssrRequest'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import InputPassword from '@/molecules/form/InputPassword'
import LinkText from '@/molecules/LinkText'

import { ModalOk } from '@/organisms/Modal'
import { useTranslation } from 'next-i18next'

// No Login Route
export { getServerSideProps } from 'helpers/noLoginGetServerSideProps'

interface Props {}

export default function ResetPassword(_props: Props) {
  const router = useRouter()
  const { query: { token } = {} } = useRouter()
  const { t } = useTranslation('langs')

  const [error, setError] = useState<{
    [key: string]: any
  }>({})
  const [form, setForm] = useState({
    password: null,
    confirmPassword: null,
  })
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const handleChangeInput = ({
    name,
    value,
  }: {
    name: 'password' | 'confirmPassword'
    value?: string
  }) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }))
    if (error?.[name]) {
      setError((error) => ({
        ...error,
        [name]: undefined,
      }))
    }
  }

  const validateForm = () => {
    const { success, error } = validateResetPasswordForm(form)
    if (success) return true

    setError({
      ...error,
    })
    return false
  }

  const { mutate, isLoading, isSuccess: isRegisterSuccess } = useMutation({
    mutationFn: (form: { token: string; password?: string | null }) => {
      return POST('reset-password', form, { redirect: 'manual' })
    },
    onError: (error: any) => {
      console.log("Mutation error:", error);
      if (error?.message && error.message.includes("Token expired")) {
        router.push("/expired-token");
        return;
      }
      setShowErrorModal(true)
      setMessage(`${error?.message || error}`)
    },
  })

  if (!token) {
    return null
  }

  return (
    <div
      className={cx(
        'wl-reset-password',
        'container mx-auto flex justify-center mt-[56px]'
      )}
    >
      <ModalOk
        showModal={showErrorModal}
        title={t('ResetPassword.FailedPage.title')}
        message={message}
        labelOk={t('ResetPassword.btn_ok')}
        handleCloseModal={() => setShowErrorModal(false)}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const isValid = validateForm()
          if (isValid) mutate({ token: `${token}`, password: form?.password })
        }}
        className="wl-reset-password__form flex w-fit flex-col bg-white shadow-card-item rounded p-8 lg:py-9 lg:px-20"
      >
        <Text
          size="unset"
          classNames="font-secondary font-semibold text-[32px] leading-[25px] text-center"
        >
            {t('ResetPassword.title')}
        </Text>
        {isRegisterSuccess ? (
          <>
            <Text
              classNames="font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px] text-left mt-14"
              size="unset"
            >
                {t('ResetPassword.SuccessPage.content')}
            </Text>
            <div className="flex items-baseline">
              <Text
                classNames="font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px]"
                size="unset"
              >
                  {t('ResetPassword.SuccessPage.loginPrompt')}
              </Text>
              <LinkText
                href="/login"
                classNames="mx-2 font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px] !text-black !underline !underline-offset-1 !decoration-black hover:!text-blue-500 hover:!decoration-blue-500"
                size="unset"
                underlined
              >
                  {t('ResetPassword.SuccessPage.login')}
              </LinkText>
              <Text
                classNames="font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px]"
                size="unset"
              >
                  {t('ResetPassword.SuccessPage.loginPrompt2')}
              </Text>
            </div>
          </>
        ) : (
          <>
            <InputPassword
              name="password"
              placeholder={t('ResetPassword.MainPage.password')}
              classNames="mt-10"
              value={form.password}
              onChange={(e) =>
                handleChangeInput({ name: 'password', value: e?.target?.value })
              }
              error={error.password}
            />
            <InputPassword
              name="confirm-password"
              placeholder={t('ResetPassword.MainPage.confirmPassword')}
              classNames="mt-10"
              value={form.confirmPassword}
              onChange={(e) =>
                handleChangeInput({
                  name: 'confirmPassword',
                  value: e?.target?.value,
                })
              }
              error={error.confirmPassword}
            />
            <Button
              type="primary"
              size="xl"
              role="submit"
              classNames="mt-12"
              disabled={isLoading}
              isLoading={isLoading}
            >
                {t('ResetPassword.MainPage.btn_reset')}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
