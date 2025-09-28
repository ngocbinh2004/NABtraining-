import { cx } from 'class-variance-authority'
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

import {
  validateSecondStepRegisterForm,
  validateSecondStepCheckVerifyCodeRegisterForm,
} from 'helpers/validation'

import Button from '@/atoms/Button'
import Input from '@/molecules/form/Input'
import CardWrapper from '@/organisms/card/Wrapper'
import Icon from '@/atoms/Icon'
import LinkText from '@/molecules/LinkText'

interface Props {
  formData?: {
    avatar?: string
    email?: string
    verify_code?: string
    height_cm?: number
    weight_kg?: number
  }
  isCreate?: boolean
  isActive?: boolean
  isLoading?: boolean
  disabled?: boolean
  handleNext: (...args: any) => any
  handleInfo: (...args: any) => any
}

export default function SecondStep({
  formData = {},
  isCreate,
  isActive,
  isLoading,
  disabled,
  handleNext,
  handleInfo,
}: Props) {
  const { t } = useTranslation()
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  const [form, setForm] = useState(
    isCreate
      ? {
          avatar: undefined,
          email: undefined,
          verify_code: undefined,
          height_cm: undefined,
          weight_kg: undefined,
          name: undefined,
        }
      : {
          // ...formData,
          // name: `${formData?.first_name}` + ' ' + `${formData?.last_name}`,
          // birthdate: formData?.birthdate
          //   ? new Date(formData?.birthdate).toISOString().split('T')[0]
          //   : formData?.birthdate,
          ...(formData || {}),
        }
  )

  const handleChangeInput = ({
    name,
    value,
  }: {
    name: 'name' | 'email' | 'verify_code'
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

  const goToNext = () => {
    const { success, error } =
      validateSecondStepCheckVerifyCodeRegisterForm(form)

    if (!success) {
      return setError({
        ...error,
      })
    }

    handleNext(form.verify_code)
  }

  const sendVerifyCode = () => {
    const { success, error } = validateSecondStepRegisterForm(form)

    if (!success) {
      return setError({
        ...error,
      })
    }
    handleInfo(form.email)
    // call api send mail here
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cx(
        'form-register-second',
        isActive ? '' : 'hidden',
        'container mx-auto',
        isCreate ? 'mt-[56px]' : 'py-10',
        'flex flex-col justify-center items-center',
        isCreate ? '' : 'h-full overflow-y-auto max-h-[80vh]'
      )}
    >
      <div className="w-full lg:max-w-[720px] mb-3 lg:mb-6">
        <div className="w-full h-30 lg:h-[42px] flex justify-start items-center mt-4 gap-2 lg:gap-3">
          <Icon
            icon="referee-icon"
            height={isMobile ? 28 : 32}
            width={isMobile ? 28 : 32}
          />
          <p className="font-secondary font-semibold lg:font-bold text-green text-2xl lg:text-[32px]">
            {t('SignUp.Page2.title')}
          </p>
        </div>

        <div className="w-full justify-start items-center pl-10 mt-1 lg:mt-2">
          <p className="font-secondary font-semibold text-black text-lg lg:text-xl">
            {t('SignUp.Page2.description')}
          </p>
          <p className="font-secondary font-normal text-[#FF5900] text-base">
            {t('SignUp.Page2.confirm_agreement')}
          </p>
        </div>
      </div>

      <CardWrapper
        classNames={cx(
          'form-register-second__form',
          'w-full lg:max-w-[720px] h-fit',
          'flex flex-col',
          isCreate ? 'p-8 lg:py-[56px] lg:px-16' : 'p-4 lg:py-[30px] lg:px-8'
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 items-end mb-6">
          <Input
            name="email"
            type="text"
            classNames="lg:w-[454px]"
            placeholder={t('SignUp.Page1.hint_account')}
            label={t('SignUp.Page1.account')}
            value={form.email}
            disabled={!isCreate}
            onChange={(e) =>
              handleChangeInput({ name: 'email', value: e?.target?.value })
            }
            error={error.email}
            required
          />
          <button
            className={cx(
              'w-full lg:w-[122px] h-[51px] lg:h-[60px] background-green text-white font-medium text-lg ml-auto',
              error.email?.length > 0 ? 'mb-6' : ''
            )}
            onClick={sendVerifyCode}
          >
            {isMobile
              ? `${t('SignUp.Page2.send_verification_code')} ${t(
                  'SignUp.Page2.120_seconds'
                )}`
              : t('SignUp.Page2.send_verification_code')}
          </button>
        </div>
        <Input
          name="verify_code"
          type="text"
          classNames="w-full"
          placeholder={t('SignUp.Page2.hint_verification_code')}
          label={t('SignUp.Page2.verification_code')}
          value={form.verify_code}
          disabled={!isCreate}
          onChange={(e) =>
            handleChangeInput({ name: 'verify_code', value: e?.target?.value })
          }
          error={error.verify_code}
          required
        />
        <LinkText
          href=""
          classNames="font-secondary font-medium text-input-label--sm text-base lg:text-lg w-full outline-none text-green mt-1 lg:mt-2 flex justify-end"
          size="unset"
          underlined
          onClick={() => console.log('HCAM click to resend code')}
        >
          {t('SignUp.Page2.didnt_receive_verification_code')}
        </LinkText>
        <div className="mt-6 lg:mt-10 w-full">
          <Button
            tabIndex={8}
            type="primary"
            size="full"
            role="button"
            classNames="custom-important"
            onClick={goToNext}
            isLoading={isLoading}
            disabled={disabled}
          >
            {isCreate ? t('SignUp.btn_next') : t('SignUp.btn_confirm')}
          </Button>
        </div>
      </CardWrapper>
    </div>
  )
}
