import { cx } from 'class-variance-authority'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useTranslation } from 'next-i18next'

import { POST_NEW as POST } from 'helpers/ssrRequest'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Input from '@/molecules/form/Input'
import { ModalOk } from '@/organisms/Modal'

// No Login Route
export { getServerSideProps } from 'helpers/noLoginGetServerSideProps'

interface Props { }

export default function ForgotPassword(_props: Props) {
  const [email, setEmail] = useState('')
  const { t } = useTranslation()
  const [showModalError, setShowModalError] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const {
    mutate,
    isLoading,
    isSuccess: isForgotPasswordSuccess,
  } = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return POST('forgot-password', { email })
    },
    onError: (error: any) => {
      setShowModalError(true)
      setMessage(`${error?.message || error}`)
    },
  })
  const onSubmit = () => mutate({ email })

  return (
    <div
      className={cx(
        'wl-forgot-password',
        'container mx-auto flex justify-center mt-[56px]'
      )}
    >
      <ModalOk
        showModal={showModalError}
        title={t('ForgotPassword.content')}
        message={message}
        labelOk={t('ForgotPassword.btn_ok')}
        handleCloseModal={() => setShowModalError(false)}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="wl-forgot-password__form flex w-fit flex-col bg-white shadow-card-item rounded p-8 lg:py-9 lg:px-20"
      >
        <Text
          size="unset"
          classNames="font-secondary font-semibold text-[32px] leading-[25px] text-center text-green"
        >
          {t('ForgotPassword.title')}
        </Text>
        {isForgotPasswordSuccess && email ? (
          <Text
            classNames="font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px] text-center mt-14"
            size="unset"
          >
            {t('ForgotPassword.SuccessPage.content')} {email}
          </Text>
        ) : (
          <>
            <Input
              name="email"
              type="email"
              value={email}
              placeholder={t('ForgotPassword.MainPage.email')}
              classNames="mt-14"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Text
              classNames="font-secondary font-normal text-input-label--sm lg:text-[20px] leading-[25px] mt-1"
              size="unset"
            >
              {t('ForgotPassword.MainPage.content')}
            </Text>
            <Button
              type="primary"
              size="xl"
              role="submit"
              classNames="mt-12"
              ariaLabel="send reset password link"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {t('ForgotPassword.MainPage.btn_send')}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
