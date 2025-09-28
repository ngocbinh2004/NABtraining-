import React, { useState, useEffect, useCallback } from 'react'
import { NextPage } from 'next'
import Icon from '@/atoms/Icon'
import { useTranslation } from 'next-i18next'

type Props = {
  formData: any
  errors: any
  fields: any
  append: any
  remove: any
  getValues: any
  watch: any
}

const RefereeLicense: NextPage<Props> = ({
  formData,
  errors,
  fields,
  append,
  remove,
  getValues,
  watch,
}) => {
  const { t } = useTranslation()

  const gradeList = [
    t('RefereePage.grade_a'),
    t('RefereePage.grade_b'),
    t('RefereePage.grade_c'),
  ]

  const [certificateFile, setCertificateFile] = useState<File | null>(null)

  const refereeCertificate = watch('referee_certificate')
  const volleyballExp = watch('volleyball_exp')

  const handleFileChange = useCallback(() => {
    if (!refereeCertificate) return

    const file = getValues('referee_certificate')?.[0]
    if (file && file.type?.startsWith('image/')) {
      setCertificateFile(file)
    }
  }, [refereeCertificate, getValues])

  useEffect(() => {
    handleFileChange()
  }, [handleFileChange])

  useEffect(() => {
    console.log('')
  }, [volleyballExp])

  if (!formData) return null

  return (
    <div className="w-full h-auto lg:max-w-[960px] my-10 mx-auto">
      <p className="w-full lg:w-[780px] h-auto text-white leading-[150%] font-semibold text-xl lg:text-2xl pt-6">
        {t('RefereePage.referee_license')}
      </p>
      <hr className="w-full border-t border-white my-2 lg:my-4" />
      <div className="flex flex-wrap justify-start items-center pt-2">
        <Icon icon="referee-icon" height={18} width={18} />
        <p className="font-semibold text-base lg:text-xl text-white ml-2">
          {t('RefereePage.experience_various_competitions')}
        </p>
      </div>
      {fields.map((field: any, index: number) => (
        <div
          key={field.id}
          className="w-full flex flex-col lg:w-[780px] bg-[#004F36] px-3 lg:px-4 py-3 my-3 gap-2"
        >
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-lg font-semibold text-white w-auto">
              {t('RefereePage.experience')} {index + 1}
            </p>
            {index > 0 ? (
              <button
                className="flex items-center justify-center lg:justify-end bg-transparent text-white font-medium text-lg w-auto"
                onClick={() => remove(index)}
              >
                <Icon
                  icon="delete-session"
                  width={16}
                  height={16}
                  classNames="mr-2 text-white"
                />
                {t('RefereePage.delete_button')}
              </button>
            ) : (
              ''
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex flex-col w-full lg:w-[310px] min-w-0">
              <input
                type="text"
                id="cupcompetitionsname"
                placeholder={t('RefereePage.cup_competitions_name')}
                className="border p-2 w-full h-[48px] font-medium text-lg bg-[#F0F0F0]"
                {...formData(`experience.${index}.cup_competition_name`, {
                  required: t('RefereePage.cup_competitions_name_required'),
                })}
              />
              {errors.experience &&
                errors.experience[index]?.cup_competition_name && (
                  <p className="text-[#FF2222] text-base">
                    {errors.experience[index]?.cup_competition_name.message}
                  </p>
                )}
            </div>
            <div className="w-full lg:w-[430px] min-w-0">
              <div className="relative">
                <select
                  id="dropdownsession"
                  className="bg-[#F0F0F0] h-[48px] font-normal text-base text-[#212121] appearance-none w-full pl-2"
                  {...formData(`experience.${index}.grade`, {
                    required: t('RefereePage.Grade.grade_required'),
                    validate: (value: string) =>
                      value !== '' || t('RefereePage.Grade.grade_required'),
                  })}
                >
                  <option value="" disabled>
                    {t('RefereePage.dropdown_label')}
                  </option>
                  {gradeList.map((item, index) => (
                    <option key={index} value={item} className="text-black">
                      {item}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Icon
                    icon="dropdown-arrow"
                    width={16}
                    height={16}
                    classNames="icon"
                  />
                </div>
              </div>
              {errors.experience && errors.experience[index]?.grade && (
                <p className="text-[#FF2222] text-base">
                  {errors.experience[index]?.grade.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="w-full flex">
        <button
          type="button"
          className="w-full lg:w-[120px] h-[48px] flex-wrap justify-center text-left text-nowrap items-end border border-white text-white font-medium text-base px-4 ml-auto"
          onClick={() => append({ cup_competition_name: '', grade: '' })}
        >
          + {t('RefereePage.add_new_button')}
        </button>
      </div>
      <div className="flex flex-wrap justify-start pt-2">
        <p className="block mb-2 text-base font-semibold text-white">
          {t('RefereePage.referee_qualification_certificate')}
        </p>
        <div className="w-full flex flex-col sm:flex-row items-center justify-between p-2 lg:p-5 bg-white gap-4">
          <div className="flex flex-col justify-start w-full lg:w-[83%]">
            {errors.referee_certificate && (
              <p className="text-[#FF2222] text-base">
                {errors.referee_certificate.message}
              </p>
            )}
            {certificateFile && certificateFile.name ? (
              <p className="break-words w-full text-lg">
                [{certificateFile.name}]
              </p>
            ) : (
              <p className="w-full font-normal text-base italic text-[#A8A8A8]">
                {t('RefereePage.document_certificate')} <br />
                {t('RefereePage.document_certificate_1')}
              </p>
            )}
          </div>
          <div className="w-full lg:w-[17%]">
            <label className="file-label">
              <input
                type="file"
                id="referee_certificate"
                className="hidden"
                {...formData('referee_certificate', {
                  required: t('RefereePage.certificate_required'),
                })}
              />
              <label
                htmlFor="referee_certificate"
                className="bg-[#009619] text-white font-medium text-base px-4 py-2 w-full h-[48px] flex justify-center items-center cursor-pointer text-nowrap"
              >
                <span className="text-sm lg:text-base">
                  {t('RefereePage.upload_file')}
                </span>
              </label>
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mt-6">
        <p className="block mb-2 text-base font-semibold text-white">
          {t('RefereePage.volleyball_experience')}
        </p>
        <p className="text-base font-normal text-white">
          {getValues('volleyball_exp')?.length}/500
        </p>
      </div>
      <input
        type="text"
        id="volleyball_experience"
        name="volleyball_experience"
        placeholder={t('RefereePage.up_500_characters')}
        className="border p-2 w-full h-[86px] lg:max-h-[86px] font-medium text-lg bg-[#F0F0F0]"
        {...formData('volleyball_exp', {
          required: t('RefereePage.volleyball_experience_required'),
          maxLength: {
            value: 500,
            message: t('RefereePage.volleyball_experience_max_length'),
          },
        })}
      />
      {errors.volleyball_exp && (
        <p className="text-[#FF2222] text-base">
          {errors.volleyball_exp.message}
        </p>
      )}
    </div>
  )
}

export default RefereeLicense
