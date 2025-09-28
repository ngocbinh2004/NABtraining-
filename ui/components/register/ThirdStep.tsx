import { cx } from 'class-variance-authority'
import { useTranslation } from 'next-i18next'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'

import { useState, useEffect } from 'react'
import Icon from '@/atoms/Icon'

import CardWrapper from '@/organisms/card/Wrapper'
import { getYearMonthDay } from 'helpers/beautifyDate'

interface Props {
  isActive?: boolean
  login: {
    email: string
  }
  personal: {
    name: string
    first_name: string
    last_name: string
    gender: string
    birthdate: string
  }
  handleNext: (...args: any) => any
  handleBack: (...args: any) => any
  isLoading?: boolean
  disabled?: boolean
}

export default function ThirdStep({
  isActive,
  personal,
  login,
  handleNext,
  handleBack,
  isLoading,
  disabled,
}: Props) {
  const { t } = useTranslation()
  const [open, setIsOpen] = useState(false)
  const togglePassword = () => setIsOpen((open) => !open)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const personalDetail = [
    { label: `${t('SignUp.Page2.last_name')}`, value: `${personal.last_name}` },
    {
      label: `${t('SignUp.Page2.first_name')}`,
      value: `${personal.first_name}`,
    },
    { label: `${t('SignUp.Page2.gender')}`, value: `${personal.gender}` },
    {
      label: `${t('SignUp.Page2.birth')}`,
      value: `${getYearMonthDay(personal.birthdate)}`,
    },
    { label: `${t('SignUp.Page3.email')}`, value: `${login.email}` },
  ]

  return (
    <div
      className={cx(
        'form-register-third-step',
        isActive ? '' : 'hidden',
        'container mx-auto mt-[56px]',
        'flex flex-col justify-center items-center'
      )}
    >
      <div className="w-full lg:max-w-[720px] h-fit flex flex-row justify-start items-start gap-2 lg:gap-3 mb-3 lg:mb-6">
        <Icon
          icon="referee-icon"
          height={isMobile ? 28 : 32}
          width={isMobile ? 28 : 32}
        />
        <p className="font-secondary font-semibold lg:font-bold text-green text-2xl lg:text-[32px]">
          {t('SignUp.Page3.title')}
        </p>
      </div>
      <CardWrapper
        classNames={cx(
          'form-register-third__form',
          'w-full lg:max-w-[720px]',
          'flex flex-col p-8 lg:py-[56px] lg:px-16 '
        )}
      >
        <Text size="form-title" component="h1" classNames="title">
          {t('SignUp.Page3.sub_title')}
        </Text>

        <hr className="w-full flex border-t border-[#D9D9D9] mt-6 mx-auto mb-8" />

        {personalDetail.map((detail, index) => (
          <div className="flex justify-between" key={index}>
            <span className="text-base font-secondary font-semibold text-[#525252] my-2.5">
              {detail.label}
            </span>
            <span className={`text-[#000000] font-normal text-lg`}>
              {detail.value}
            </span>
          </div>
        ))}

        <div className="w-full flex flex-col lg:flex-row justify-center items-center mt-6 gap-2 lg:gap-4">
          <Button
            type="secondary"
            size="full"
            role="button"
            classNames="w-full"
            onClick={handleBack}
            disabled={disabled}
          >
            {t('SignUp.Page3.re_edit')}
          </Button>
          <Button
            type="primary"
            size="full"
            role="button"
            classNames="w-full"
            onClick={handleNext}
            isLoading={isLoading}
            disabled={disabled}
          >
            {t('SignUp.Page3.confirm_send')}
          </Button>
        </div>
      </CardWrapper>
    </div>
  )
}
