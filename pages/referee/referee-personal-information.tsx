import React, { useState, useEffect } from 'react'
import Icon from '@/atoms/Icon'
import Text from '@/atoms/Text'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { toast } from 'react-toastify'

import PersonalInformation from '@/components/referee/personalInformation'
import CurrentOccupation from '@/components/referee/currentOccupation'
import RefereeLicense from '@/components/referee/refereeLicense'
import RegistrationInformation from '@/components/referee/registrationInformation'
import EmergencyContact from '@/components/referee/emergencyContact'
import {
  getTimeBatchRefereeCourse,
  getRefereeCourseByID,
  getCity,
} from 'helpers/api'
import { ITimeBatch, IRefereeCourse } from 'interfaces/referee_type'
import { ICityType } from 'interfaces/city_type'
import imageCompression from 'browser-image-compression'
import { beautifyHourMinuteForReferee } from 'helpers/beautifyDate'

import { POST_NEW as POST } from 'helpers/ssrRequest'
import { useFieldArray, useForm } from 'react-hook-form'
import { Users } from 'interfaces/user_type'
import { getCookie } from 'cookies-next'
import { s3Api } from 'helpers/s3'
import Title from '@/components/common/Title'

interface IProps {
  course: IRefereeCourse
  time_batches: ITimeBatch[]
  registration_session: string[]
  cityList: ICityType[]
}

export default function RefereePersonalInformationPage({
  course,
  time_batches,
  registration_session,
  cityList,
}: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      referee_tbatch_id: '',
      registration_session: new Date(),
      status: '',
      confirm_paid: 0,
      payment_date: 0,
      english_fname: '',
      english_lname: '',
      chinese_fname: '',
      chinese_lname: '',
      gender: '',
      birthdate: new Date(),
      portrait_photo: {} as FileList,
      referee_certificate: {} as FileList,
      id_documents: '',
      id_issue_date: 0,
      id_exp_date: 0,
      residential_city: '',
      residential_district: '',
      residential_street: '',
      mailing_city: '',
      mailing_district: '',
      mailing_street: '',
      mobile: '',
      email: '',
      last_payment_account: '',
      cur_job_dept: '',
      cur_job_work_city: '',
      cur_job_work_district: '',
      cur_job_work_street: '',
      cur_job_position: '',
      cur_job_institution: '',
      emer_cont_relation: '',
      emer_cont_mobile: '',
      emer_cont_email: '',
      emer_cont_firstname: '',
      emer_cont_lastname: '',
      volleyball_exp: '',
      experience: [{ cup_competition_name: '', grade: '' }],
      checkbox: false || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  })

  // Query
  interface IFormData {
    referee_tbatch_id: string
    registration_session: Date
    chinese_fname: string
    chinese_lname: string
    english_fname: string
    english_lname: string
    birthdate: Date
    gender: string
    portrait_photo: FileList
    referee_certificate: FileList
    id_documents: string
    residential_city: string
    residential_district: string
    residential_street: string
    mailing_city: string
    mailing_district: string
    mailing_street: string
    mobile: string
    email: string
    cur_job_dept: string
    cur_job_work_city: string
    cur_job_work_district: string
    cur_job_work_street: string
    cur_job_position: string
    cur_job_institution: string
    emer_cont_firstname: string
    emer_cont_lastname: string
    emer_cont_relation: string
    emer_cont_mobile: string
    emer_cont_email: string
    volleyball_exp: string
    experience: Array<{ cup_competition_name: string; grade: string }>
  }

  interface IResponse {
    id: number
  }

  const uploadImgFile = async (fileName: string, file: File) => {
    if (!file) return

    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 3840,
      useWebWorker: true,
      initialQuality: 1,
      alwaysKeepResolution: true,
    }

    const compressedFile = await imageCompression(file, options)

    const buffer = Buffer.from(await compressedFile.arrayBuffer())

    const photo_url = await s3Api.upload({
      file: buffer,
      title: fileName,
    })

    return photo_url
  }

  const submitHandler = async (data: IFormData) => {
    const portrait_fileName = `referee_${Date.now()}.png`
    const portrait_url = await uploadImgFile(
      portrait_fileName,
      data.portrait_photo[0]
    )

    const certificate_fileName = `certificate_${Date.now()}.png`
    const certificate_url = await uploadImgFile(
      certificate_fileName,
      data.referee_certificate[0]
    )

    try {
      const _response: IResponse = await POST('referee-registration', {
        referee_course_id: course.id,
        referee_tbatch_id: Number(data.referee_tbatch_id),
        registration_session: data.registration_session,
        chinese_name: `${data.chinese_lname}${data.chinese_fname}`,
        english_name:
          data.english_fname && data.english_lname
            ? `${data.english_fname} ${data.english_lname}`
            : '',
        birthdate: new Date(data.birthdate),
        gender: data.gender,
        portrait_photo: portrait_url,
        referee_certificate: certificate_url,
        id_documents: data.id_documents,
        residential_city_id: data.residential_city
          ? Number(data.residential_city)
          : null,
        residential_district_id: data.residential_district
          ? Number(data.residential_district)
          : null,
        residential_street: data.residential_street
          ? data.residential_street
          : null,
        mailing_city_id: data.mailing_city ? Number(data.mailing_city) : null,
        mailing_district_id: data.mailing_district
          ? Number(data.mailing_district)
          : null,
        mailing_street: data.mailing_street ? data.mailing_street : null,
        mobile: data.mobile,
        email: data.email,
        last_payment_account: '',
        cur_job_work_street: data.cur_job_work_street
          ? data.cur_job_work_street
          : null,
        cur_job_position: data.cur_job_position,
        cur_job_institution: data.cur_job_institution,
        cur_job_work_city_id: data.cur_job_work_city
          ? Number(data.cur_job_work_city)
          : null,
        cur_job_work_district_id: data.cur_job_work_district
          ? Number(data.cur_job_work_district)
          : null,
        emer_cont_firstname: data.emer_cont_firstname,
        emer_cont_lastname: data.emer_cont_lastname,
        emer_cont_relation: data.emer_cont_relation,
        emer_cont_mobile: data.emer_cont_mobile,
        emer_cont_email: data.emer_cont_email,
        volleyball_exp: data.volleyball_exp,
      })

      await POST('referee-registration-exp', {
        referee_registration_id: _response.id,
        data: data.experience,
      })

      router.push(
        `/referee/referee-payment-information?course_id=${course.id}&user_registration_id=${_response.id}`
      )
    } catch (err: any) {
      console.error('Failed when registering Referee User')
      return toast.error(t('Common.GeneralErrMsg'))
    }
  }

  const handleCancel = () => {
    router.push('/referee/referee-list-course')
  }

  const timeBatches = time_batches.map((batch) => ({
    ...batch,
    id: batch.id,
    start_time: beautifyHourMinuteForReferee(batch.start_time),
    end_time: beautifyHourMinuteForReferee(batch.end_time),
  }))

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
    <div className="flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-screen-lg">
        <div className="flex items-center my-4">
          <Title
            title_text={t('RefereePage.registration_information_page_title')}
            isMobile={isMobile}
          />
        </div>

        <form
          className="border border-white background-card boxBlurShadow w-full h-auto py-4 px-6 lg:px-[120px] mt-6 mb-10"
          onSubmit={handleSubmit(submitHandler)}
        >
          <PersonalInformation
            formData={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            cityList={cityList}
          />
          <CurrentOccupation
            formData={register}
            errors={errors}
            watch={watch}
            cityList={cityList}
          />
          <RefereeLicense
            formData={register}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
            getValues={getValues}
            watch={watch}
          />
          <RegistrationInformation
            registrationTimeBatch={timeBatches}
            registrationSessions={registration_session}
            formData={register}
          />
          <EmergencyContact formData={register} errors={errors} />
          <div className="flex flex-col relative w-full h-auto lg:max-w-[720px]">
            <input
              type="checkbox"
              id="mailing"
              className="absolute top-1 accent-[#004F36] w-4 h-4 lg:w-5 lg:h-5"
              {...register('checkbox', { required: true })}
            />
            <p className="ml-8 font-medium text-base text-white">
              {t('RefereePage.agree_allow_description_1')}
            </p>
          </div>
          <div className="flex relative w-full h-auto lg:max-w-[720px] mt-10">
            <input
              type="checkbox"
              id="mailing"
              className="absolute top-1 accent-[#004F36] w-4 h-4 lg:w-5 lg:h-5"
              {...register('checkbox', { required: true })}
            />
            <p className="ml-8 font-medium text-base text-white">
              {t('RefereePage.have_read')}
            </p>
          </div>
          {watch('checkbox')?.length < 2 ? (
            <p className="text-[#FF2222] text-base mt-2">
              {t('RefereePage.select_two_boxes')}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-center items-center w-full my-10 gap-2">
            <button
              className="flex-grow h-[48px] lg:h-[59px] text-white font-medium text-base lg:text-lg border border-white"
              onClick={handleCancel}
            >
              {t('RefereePage.cancel_button')}
            </button>
            <button
              className="flex-grow h-[48px] lg:h-[59px] bg-[#009919] text-white font-medium text-base lg:text-lg"
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
            >
              {t('RefereePage.submit_button')}
            </button>
          </div>
        </form>
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
  const lang = locale === 'en' ? 'ENGLISH' : 'CHINESE'
  const courseReferee = await getRefereeCourseByID(
    `?language=${lang}&id=${courseID}`
  )

  const timeBatches = await getTimeBatchRefereeCourse(
    `/${courseID}/time_batches`
  )

  const cityList = await getCity()

  return {
    props: {
      course: courseReferee?.data?.data[0],
      time_batches: timeBatches?.data?.data,
      registration_session:
        courseReferee?.data?.data[0].registration_session || [],
      cityList: cityList?.data?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
