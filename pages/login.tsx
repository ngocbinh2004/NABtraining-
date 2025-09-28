import { cx } from 'class-variance-authority'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { getCookie, removeCookies } from 'cookies-next'
import { useTranslation } from 'next-i18next'

import { useOverflowBody } from 'hooks/useOverflowBody'

import { POST_NEW as POST } from 'helpers/ssrRequest'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import InputPassword from '@/molecules/form/InputPassword'
import Input from '@/molecules/form/Input'
import LinkText from '@/molecules/LinkText'
import { ModalOk } from '@/organisms/Modal'

import Icon from '@/atoms/Icon'

// No Login Route
export { getServerSideProps } from 'helpers/noLoginGetServerSideProps'

interface Props {}

export default function Login({}: Props) {
  const { t } = useTranslation()
  const { push } = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showErrorModal, setShowErrorModal] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return POST('login', { email, password })
    },
    onSuccess: (_response: any) => {
      const from = getCookie('FROM')
      if (!from) {
        return push('/')
      }

      removeCookies('FROM')
      setTimeout(() => {
        push(`${from || ''}`)
      }, 2000)
    },
    onError: (error: any) => {
      setShowErrorModal(true)
      setMessage(`${error?.message || error}`)
    },
  })
  const onSubmit = () => mutate({ email, password })

  useOverflowBody({ hideOverflow: showErrorModal })

  return (
    <div
      className={cx(
        'wl-login',
        'container flex flex-col lg:flex-row mx-auto justify-start my-[56px]'
      )}
    >
      <ModalOk
        showModal={showErrorModal}
        title={t('LoginPage.LoginFailed.title')}
        message={message}
        labelOk={t('LoginPage.LoginFailed.btn_ok')}
        handleCloseModal={() => setShowErrorModal(false)}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="wl-login__form flex w-full flex-col bg-white rounded p-8 lg:py-16 px-6 lg:px-16 lg:w-[50%]"
      >
        <div className="flex justify-start items-center h-[26px] lg:h-[42px] gap-3">
          <Icon icon="referee-icon" height={32} width={32} />
          <Text
            size="unset"
            classNames="font-secondary font-semibold text-xl lg:text-[28px] w-full text-green"
          >
            {t('LoginPage.title')}
          </Text>
        </div>

        <hr className="w-full flex border-t border-[#D9D9D9] mt-6 mx-auto" />

        <Text
          size="unset"
          classNames="font-secondary font-semibold text-base lg:text-lg w-full text-black mt-6 lg:mt-10 mb-1 lg:mb-2"
        >
          {t('LoginPage.user_account')}
        </Text>
        <Input
          name="email"
          type="email"
          value={email}
          placeholder={t('LoginPage.hint_user_account')}
          classNames="mt-0"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Text
          size="unset"
          classNames="font-secondary font-semibold text-base lg:text-lg w-full text-black mt-6 mb-1 lg:mb-2"
        >
          {t('LoginPage.password')}
        </Text>
        <InputPassword
          name="password"
          value={password}
          placeholder={t('LoginPage.hint_password')}
          classNames="mt-0"
          onChange={(e) => setPassword(e.target.value)}
        />
        <LinkText
          href="/forgot-password"
          classNames="font-secondary font-medium text-input-label--sm text-base lg:text-lg w-full outline-none text-green mt-1 lg:mt-2 flex justify-end"
          size="unset"
          underlined
        >
          {t('LoginPage.forgetpassword')}
        </LinkText>
        <div className="w-full flex flex-col gap-4 items-center mt-6 lg:mt-12">
          <Button
            type="primary"
            size="base"
            role="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t('LoginPage.btn_login')}
          </Button>
        </div>
      </form>
      <div className="w-full relative h-[400px] lg:h-[600px] bg-[#004F36] lg:w-[50%] z-[1] p-8 lg:py-16 px-6 lg:px-16">
        <div
          className="absolute left-0 top-0 w-[287px] h-[287px] bg-no-repeat bg-contain z-[-1]"
          style={{
            backgroundImage: "url('/assets/logo-signup.png')",
          }}
        ></div>
        <div className="relative w-full h-[26px] lg:h-[42px] flex justify-between items-start mb-4">
          <Icon
            icon="logo-tpvl-signup"
            width={isMobile ? 76 : 120}
            height={isMobile ? 26 : 42}
          />
          <span className="font-extrabold text-2xl lg:text-3xl flex items-end justify-end text-white absolute bottom-0 right-0">
            {t('LoginPage.take_action_now')}
          </span>
        </div>
        <hr className="w-full flex border-t border-[#FFFFFF] mt-6 mx-auto" />
        <div className="relative w-full h-full flex flex-col items-center gap-4 lg:gap-6">
          <Text
            size="unset"
            classNames="font-secondary font-semibold text-xl lg:text-2xl w-full text-white mt-6 lg:mt-10 mb-1 lg:mb-2"
          >
            {t('LoginPage.not_member_yet')}
          </Text>
          <p
            className="font-secondary font-normal text-base lg:text-lg w-full h-[130px] text-white mb-0 lg:mb-14"
            dangerouslySetInnerHTML={{
              __html: t('LoginPage.description_signup'),
            }}
          />
          <div className="w-full flex flex-col gap-4 items-center">
            <Button
              classNames="w-full border border-white text-white mt-0 lg:mt-6"
              type="secondary"
              size="base"
              role="button"
              onClick={(e) => {
                e.preventDefault()
                push('/intro_signup')
              }}
              disabled={isLoading}
            >
              {t('LoginPage.go_to_registration')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
