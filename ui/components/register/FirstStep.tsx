import { cx } from 'class-variance-authority'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Icon from '@/atoms/Icon'

import {
  validateFirstStepRegisterForm,
  validateFirstStepCompetitionForm,
} from 'helpers/validation'

import Text from '@/atoms/Text'
import Input from '@/molecules/form/Input'
import InputPassword from '@/molecules/form/InputPassword'
import CardWrapper from '@/organisms/card/Wrapper'
import Image from '@/molecules/media/Image'

import DatePicker from 'react-datepicker'

interface Props {
  formData?: {
    first_name?: string
    last_name?: string
    gender?: string
    birthdate?: string
  }
  children?: React.ReactNode
  fromCompetition?: boolean
  isCreate?: boolean
  isActive?: boolean
  handleNext: (...args: any) => any
  handleBack?: (...args: any) => any
}

export default function FirstStep({
  formData,
  fromCompetition,
  isCreate,
  isActive,
  children,
  handleNext,
  handleBack,
}: Props) {
  const { t } = useTranslation()

  const [error, setError] = useState<{
    name?: string
    first_name?: string
    last_name?: string
    gender?: string
    birthdate?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [form, setForm] = useState(
    isCreate && !formData?.first_name
      ? {
          name: fromCompetition ? '' : undefined,
          first_name: undefined,
          last_name: undefined,
          gender: 'Male',
          birthdate: undefined,
          password: null,
          confirmPassword: null,
        }
      : {
          ...formData,
          name: `${formData?.first_name}` + ' ' + `${formData?.last_name}`,
          birthdate: formData?.birthdate
            ? new Date(formData?.birthdate).toISOString().split('T')[0]
            : formData?.birthdate,
        }
  )

  const handleDatePicker = () => {
    document.getElementById('birthdate')?.focus()
  }

  const handleChangeInput = ({
    name,
    value,
  }: {
    name:
      | 'name'
      | 'first_name'
      | 'last_name'
      | 'gender'
      | 'birthdate'
      | 'password'
      | 'confirmPassword'
    value?: string
  }) => {
    setForm((form) => {
      const updatedForm = {
        ...form,
        [name]: value,
      }
      if (name === 'first_name' || name === 'last_name') {
        updatedForm.name =
          `${updatedForm.first_name || ''} ${
            updatedForm.last_name || ''
          }`.trim() || undefined
      }
      return updatedForm
    })
    if (error?.[name]) {
      setError((error) => ({
        ...error,
        [name]: undefined,
      }))
    }
  }

  const goToNext = () => {
    const result = fromCompetition
      ? validateFirstStepCompetitionForm(form)
      : validateFirstStepRegisterForm(form)

    const hasError = !result?.success && result?.error?.issues
    if (hasError) {
      const errorName = result.error.issues.find((error) =>
        error.path.includes('name')
      )

      const errorFirstName = result.error.issues.find((error) =>
        error.path.includes('first_name')
      )
      const errorLastName = result.error.issues.find((error) =>
        error.path.includes('last_name')
      )
      const errorGender = result.error.issues.find((error) =>
        error.path.includes('gender')
      )
      const errorBirthdate = result.error.issues.find((error) =>
        error.path.includes('birthdate')
      )
      const errorPassword = result.error.issues.find((error) =>
        error.path.includes('password')
      )
      const errorConfirmPassword = result.error.issues.find((error) =>
        error.path.includes('confirmPassword')
      )
      return setError({
        name: errorName?.message,
        first_name: errorFirstName?.message,
        last_name: errorLastName?.message,
        gender: errorGender?.message,
        birthdate: errorBirthdate?.message,
        password: errorPassword?.message,
        confirmPassword: errorConfirmPassword?.message,
      })
    }

    handleNext(form)
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
        'form-register-first',
        isActive ? '' : 'hidden',
        'container mx-auto',
        isCreate ? 'mt-[56px]' : 'py-10',
        'flex flex-col justify-center items-center',
        isCreate ? '' : 'h-screen overflow-y-auto lg:overflow-y-hidden'
      )}
    >
      <div className="w-full lg:max-w-[720px] h-fit flex flex-row justify-start items-start gap-2 lg:gap-3 mb-3 lg:mb-6">
        <Icon
          icon="referee-icon"
          height={isMobile ? 28 : 32}
          width={isMobile ? 28 : 32}
        />
        <p className="font-secondary font-semibold lg:font-bold text-green text-2xl lg:text-[32px]">
          {t('SignUp.Page1.title')}
        </p>
      </div>
      <CardWrapper
        classNames={cx(
          'form-register-first__form',
          'w-full lg:max-w-[720px] h-fit',
          'rounded',
          'flex flex-col',
          isCreate ? 'p-8 lg:py-[56px] lg:px-16' : 'p-4 lg:py-[30px] lg:px-8'
        )}
      >
        <div className="flex flex-col gap-6">
          {fromCompetition && (
            <Input
              name="name"
              type="text"
              placeholder={t('AccountSettingPage.hint_name')}
              label={t('AccountSettingPage.name')}
              value={form.name}
              onChange={(e) =>
                handleChangeInput({ name: 'name', value: e?.target?.value })
              }
              error={error.name}
              required
            />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              name="last_name"
              type="text"
              placeholder={t('SignUp.Page2.hint_last_name')}
              label={t('SignUp.Page2.last_name')}
              value={form.last_name}
              onChange={(e) =>
                handleChangeInput({
                  name: 'last_name',
                  value: e?.target?.value,
                })
              }
              error={error.last_name}
              tabIndex={2}
              required
            />
            <Input
              name="first_name"
              type="text"
              placeholder={t('SignUp.Page2.hint_first_name')}
              label={t('SignUp.Page2.first_name')}
              value={form.first_name}
              onChange={(e) =>
                handleChangeInput({
                  name: 'first_name',
                  value: e?.target?.value,
                })
              }
              error={error.first_name}
              tabIndex={2}
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <p className="block mb-2 text-lg font-secondary font-semibold text-black">
              {t('RefereePage.gender')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onClick={(e) =>
                    handleChangeInput({
                      name: 'gender',
                      value: 'male',
                    })
                  }
                  defaultChecked
                  className="hidden peer/male"
                />
                <label
                  htmlFor="male"
                  className={`w-fit h-[59px] lg:h-[59px] flex items-center justify-center cursor-pointer py-2 px-5 font-secondary font-semibold text-lg bg-white border-green text-green peer-checked/male:bg-[#004F36] peer-checked/male:text-white`}
                >
                  {t('RefereePage.gender_male')}
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onClick={(e) =>
                    handleChangeInput({
                      name: 'gender',
                      value: 'female',
                    })
                  }
                  className="hidden peer/female"
                />
                <label
                  htmlFor="female"
                  className={`w-fit h-[59px] lg:h-[59px] flex items-center justify-center cursor-pointer py-2 px-5 font-secondary font-semibold text-lg bg-white border-green text-green peer-checked/female:bg-[#004F36] peer-checked/female:text-white`}
                >
                  {t('RefereePage.gender_female')}
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <p className="block mb-2 text-lg font-secondary font-semibold text-black">
              {t('SignUp.Page2.birth')}
            </p>
            <div
              className="flex flex-row items-center justify-between w-full h-auto bg-[#EDEDED] pr-3"
              onClick={handleDatePicker}
            >
              <DatePicker
                id="birthdate"
                onChange={(date: any) =>
                  handleChangeInput({ name: 'birthdate', value: date })
                }
                selected={form.birthdate ? new Date(form.birthdate) : null}
                placeholderText={t('SignUp.Page2.hint_birth')}
                dateFormat="yyyy/MM/dd"
                className="p-2 w-full h-[45px] lg:max-h-[59px] font-secondary font-medium text-lg bg-[#EDEDED] placeholder-[#909090]"
              />
              <Image
                url="assets/calendar.png"
                alt="Calendar Icon"
                width={25}
                height={29}
              />
            </div>
            {error.birthdate ? (
              <p className="font-secondary font-input text-input-label-error text-rose-600">
                {error.birthdate}
              </p>
            ) : null}
          </div>
          <InputPassword
            name="password"
            placeholder={t('SignUp.Page1.hint_password')}
            label={t('SignUp.Page1.password')}
            value={form.password}
            onChange={(e) =>
              handleChangeInput({ name: 'password', value: e?.target?.value })
            }
            error={error.password}
            required
          />

          <InputPassword
            name="confirm-password"
            placeholder={t('SignUp.Page1.hint_confirm_password')}
            label={t('SignUp.Page1.confirm_password')}
            value={form.confirmPassword}
            onChange={(e) =>
              handleChangeInput({
                name: 'confirmPassword',
                value: e?.target?.value,
              })
            }
            error={error.confirmPassword}
            required
          />
          {children}
        </div>

        <div className="w-full form-register-one__info flex flex-col lg:mt-6">
          <Text classNames="font-secondary font-normal text-sm lg:text-base text-[#525252]">
            {t('SignUp.Page1.precautions')}
          </Text>
          <ul className="list-disc ml-[38px] font-normal text-sm lg:text-base text-[#525252]">
            <li>{t('SignUp.Page1.precautions_content1')}</li>
            <li>{t('SignUp.Page1.precautions_content2')}</li>
            <li>{t('SignUp.Page1.precautions_content3')}</li>
            <li>{t('SignUp.Page1.precautions_content4')}</li>
            <li>{t('SignUp.Page1.precautions_content5')}</li>
          </ul>
        </div>

        <div className="mt-[72px] w-full">
          <button
            className="w-full h-[40px] lg:h-[51px] background-green text-white font-medium text-base lg:text-lg"
            onClick={goToNext}
          >
            {isCreate
              ? t('SignUp.Introduction.next_button')
              : t('SignUp.btn_confirm')}
          </button>
        </div>
      </CardWrapper>
    </div>
  )
}
