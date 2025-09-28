import React, { useEffect, useState } from 'react'
import Icon from '@/atoms/Icon'
import Text from '@/atoms/Text'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { cx } from 'class-variance-authority'
import { toast } from 'react-toastify'
import Image from "@/molecules/media/Image"

import {
  getRefereeCourseByID,
  getRegisteredReferee,
  getTimeBatchRefereeCourse,
  putRefereeRegistration,
} from 'helpers/api'
import {
  beautifyDayMonthForReferee,
  beautifyHourMinuteForReferee,
  beautifyISODate,
} from 'helpers/beautifyDate'

import {
  ITimeBatch,
  IRefereeCourse,
  IRefereeUserRegistration,
} from 'interfaces/referee_type'

interface Props {
  referee_registered_id: number
  course: IRefereeCourse
  time_batches: ITimeBatch[]
  referee_registered: IRefereeUserRegistration
}

export default function RefereePaymentInformation({
  referee_registered_id,
  course,
  time_batches,
  referee_registered,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [accountBank, setAccountBank] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)

  const handleChangeAccountBank = (event: any) => {
    const value = event.target.value
    setAccountBank(value)
  }

  const handleCancel = () => {
    router.push('/referee/referee-list-course')
  }

  const handleConfirm = async () => {
    if (accountBank.trim() === '' || accountBank.length != 5) {
      return toast.error(t('RefereePage.account_last_digit_error'))
    }

    try {
      await putRefereeRegistration(referee_registered_id, {
        confirm_paid: true,
        last_payment_account: accountBank.toString(),
      })

      router.push(
        `/referee/referee-registration-success?course_id=${course.id}&user_registration_id=${referee_registered_id}`
      )
    } catch (err: any) {
      console.error('Failed when registering Referee User')
      return toast.error(t('Common.GeneralErrMsg'))
    }
  }

  const getRefereeName = (
    locale: string = '',
    chineseName: string = '',
    englishName: string = ''
  ): string => {
    if (locale !== 'en') {
      if (chineseName.trim() !== '') {
        return chineseName
      } else {
        return englishName
      }
    } else {
      if (englishName.trim() !== '') {
        return englishName
      } else {
        return chineseName
      }
    }
  }

  const time = time_batches.filter(
    (batch) => batch.id == referee_registered.referee_tbatch_id
  )
  const registrationDetails = [
    { label: t('RefereePage.registration_fee'), value: 'TWD3,000' },
    {
      label: t('RefereePage.name'),
      value: getRefereeName(
        router.locale,
        referee_registered.chinese_name,
        referee_registered.english_name
      ),
    },
    {
      label: t('RefereePage.date_of_birth'),
      value: beautifyISODate(referee_registered.birthdate, true),
    },
    {
      label: t('RefereePage.contact_phone_numbers'),
      value: referee_registered.mobile || referee_registered.landline,
    },
    {
      label: t('RefereePage.registration_session'),
      value: `${beautifyDayMonthForReferee(
        referee_registered.registration_session
      )}`,
    },
    {
      label: t('RefereePage.time'),
      value: `${beautifyHourMinuteForReferee(
        time[0].start_time
      )} - ${beautifyHourMinuteForReferee(time[0].end_time)}`,
    },
  ]

  const bankTransferDetails = [
    { label: t('RefereePage.payment_bank_code'), value: '802' },
    { label: t('RefereePage.payment_account'), value: '0000384957384620' },
    { label: '', value: t('RefereePage.copy_account') },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-screen-lg">
        <div className="flex flex-wrap items-center my-4">
          <Icon
            icon="referee-icon"
            height={isMobile ? 34 : 32}
            width={isMobile ? 18 : 32}
          />
          <p className="flex-1 font-bold text-2xl lg:text-[28px] text-white mx-2.5 flex items-center">
            {t('RefereePage.payment_information')}
          </p>
        </div>
        <div className="w-full max-w-[1200px] h-auto p-4 my-10 border border-white background-card boxBlurShadow lg:px-[120px] ">
          <div className="w-full max-w-[960px] h-auto my-10 mx-auto md:px-8 lg:px-12">
            <div>
              <p className="text-white font-semibold text-xl lg:text-2xl">
                {t('RefereePage.cost_breakdown')}
              </p>
              <hr className="w-full border-t border-white mt-4 mb-7" />
              {registrationDetails.map((detail, index) => (
                <div className="flex justify-between items-center" key={index}>
                  <span className="text-base lg:text-lg font-medium text-white my-2.5">
                    {detail.label}
                  </span>
                  <span
                    className={`text-white ${detail.label === t('RefereePage.registration_fee')
                      ? ''
                      : 'text-base lg:text-lg'
                      }`}
                  >
                    {detail.label === t('RefereePage.registration_fee') ? (
                      <>
                        <span className="text-2xl lg:text-[28px] text-white font-semibold">
                          TWD
                        </span>{' '}
                        <span className="font-semibold text-2xl lg:text-[28px] text-white">
                          3,000
                        </span>
                      </>
                    ) : detail.label ===
                      t('RefereePage.contact_phone_numbers') ? (
                      <span className="text-base lg:text-lg font-medium text-white my-2.5">
                        {detail.value.replace(/(?<=.{4}).(?=.{3})/g, '*')}
                      </span>
                    ) : (
                      <span className="text-white">{detail.value}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-xl lg:text-2xl mt-8 mb-4">
                {t('RefereePage.payment')}
              </p>
              <hr className="w-full border-t border-white mb-2 mt-5" />
              <div className="mt-4">
                <div>
                  {bankTransferDetails.map((detail, index) => (
                    <div className="flex justify-between" key={index}>
                      <span className="text-base lg:text-lg font-medium text-white my-2.5">
                        {detail.label}
                      </span>
                      <span
                        className={cx(
                          'flex items-center font-medium',
                          detail.value === t('RefereePage.copy_account')
                            ? 'text-sm lg:text-base underline lg:no-underline text-white'
                            : 'text-base lg:text-lg text-white my-2.5'
                        )}
                      >
                        {detail.value}
                        {detail.value === t('RefereePage.copy_account') && (
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText('0000384957384620')
                            }}
                          >
                            <Image
                              url="/assets/copy-icon.png"
                              alt="copy icon"
                              width={14}
                              height={14}
                              imageClassNames={"ml-2 cursor-pointer"}
                            />
                          </div>
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4">
                    <p className="block mb-2 font-semibold text-base text-white">
                      {t('RefereePage.account_last_digit')}
                    </p>
                    <input
                      type="number"
                      placeholder={t('RefereePage.please_enter_account')}
                      className="border p-4 block w-full bg-[#EDEDED] h-[48px] text-base font-medium text-[#909090]"
                      value={accountBank}
                      onChange={(event) => handleChangeAccountBank(event)}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) =>
                      (e.target.placeholder = t(
                        'RefereePage.please_enter_account'
                      ))
                      }
                    />
                    <p className="block mb-2 text-base font-medium text-white">
                      {t('RefereePage.discription_bank_account')}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="w-full border-t border-white my-10" />
              <div className="mb-10">
                <p className="text-white text-base">
                  {t('RefereePage.note.label')} :
                </p>
                <p className="text-white text-base">
                  {t('RefereePage.note.note_1')}
                </p>
                <p className="text-white text-base">
                  {t('RefereePage.note.note_2')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex justify-center items-center p-4 basis-1/2 h-[59px] text-white text-base lg:text-lg font-medium border border-white hover:bg-[#009919] hover:border-0"
                  onClick={handleCancel}
                >
                  {t('RefereePage.cancel_button')}
                </button>
                <button
                  className="flex justify-center items-center p-4 basis-1/2 h-[59px] bg-[#009919] text-white text-base lg:text-lg font-medium hover:bg-transparent hover:border hover:border-white"
                  onClick={handleConfirm}
                >
                  {t('RefereePage.confirm_button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  locale,
}: {
  query?: { [key: string]: string }
  locale: string
}) => {
  const courseID = query?.course_id
  const refereeRegiseredID = query?.user_registration_id
  const lang = locale === 'en' ? 'ENGLISH' : 'CHINESE'
  const courseReferee = await getRefereeCourseByID(
    `?language=${lang}&id=${courseID}`
  )
  const refereeRegistereds = await getRegisteredReferee(
    `?id=${refereeRegiseredID}`
  )

  const timeBatches = await getTimeBatchRefereeCourse(
    `/${courseID}/time_batches`
  )

  return {
    props: {
      referee_registered_id: refereeRegiseredID,
      course: courseReferee?.data?.data[0],
      time_batches: timeBatches?.data?.data,
      referee_registered: refereeRegistereds?.data.data[0],
      registration_session:
        courseReferee?.data?.data[0].registration_session || [],
      ...(await serverSideTranslations(locale)),
    },
  }
}
