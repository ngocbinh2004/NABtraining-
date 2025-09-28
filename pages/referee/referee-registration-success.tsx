import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Icon from '@/atoms/Icon'
import { GoCheckCircle } from 'react-icons/go'
import { useRouter } from 'next/router'
import {
  getRefereeCourseByID,
  getRegisteredReferee,
  getTimeBatchRefereeCourse,
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
  course: IRefereeCourse
  time_batches: ITimeBatch[]
  referee_registered: IRefereeUserRegistration
}

export default function RefereeRegistrationSuccess({
  course,
  time_batches,
  referee_registered,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const time = time_batches.filter(
    (batch) => batch.id == referee_registered.referee_tbatch_id
  )

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

  const registrationDetails = [
    { label: t('RefereePage.registration_fee'), value: 'TWD 3,000' },
    { label: t('RefereePage.name'), value: getRefereeName(router.locale, referee_registered.chinese_name, referee_registered.english_name) },
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
        time[0]?.start_time
      )} - ${beautifyHourMinuteForReferee(time[0]?.end_time)}`,
    },
  ]

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-screen-xl flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center mb-4 mt-6 font-bold text-xl md:text-2xl lg:text-3xl">
          <div className="flex gap-2 items-center">
            <GoCheckCircle className="text-white mt-6 w-6 h-6 lg:w-7 lg:h-7" />
            <p className="text-white text-2xl lg:text-[28px] mt-5">
              {t('RefereePage.RegisterSuccess.title')}
            </p>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <Icon icon="referee-icon" height={24} width={24} />
            <p className="text-white text-lg lg:text-xl">{course.name}</p>
            <Icon icon="referee-icon" height={24} width={24} />
          </div>
        </div>
        <div className="w-full max-w-[1200px] h-auto mt-10 mb-10 p-4 md:p-8 lg:p-12 border border-white background-card boxBlurShadow">
          <div className="w-full max-w-[960px] h-auto mx-auto p-4">
            <span className="text-white text-4xl font-bold">
              {t('RefereePage.RegisterSuccess.workshop_details')}
            </span>
            <div>
              <hr className="w-full border-t border-white mb-8 mt-4" />
              {registrationDetails.map((detail, index) => (
                <div className="flex justify-between items-center" key={index}>
                  <span className="text-base lg:text-lg font-medium text-white my-2.5">
                    {detail.label}
                  </span>
                  <span
                    className={`${detail.label === 'Registration Fee'
                      ? ''
                      : 'text-base lg:text-lg'
                      }`}
                  >
                    {detail.label === 'Registration Fee' ? (
                      <>
                        <span className="font-semibold text-2xl lg:text-[28px] text-white">
                          TWD
                        </span>{' '}
                        <span className="font-bold text-2xl lg:text-[28px] text-white">
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
              <hr className="w-full border-t border-white mt-4 mb-8" />
              <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <span className="text-white text-base lg:text-lg">
                  {t('RefereePage.RegisterSuccess.content')}
                </span>
                <button className="flex justify-center items-center p-4 w-full lg:w-auto h-12 bg-[#009919] text-white text-lg font-medium hover:bg-transparent hover:border hover:border-white">
                  <span>{t('RefereePage.RegisterSuccess.resend')}</span>
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
      course: courseReferee?.data?.data[0],
      time_batches: timeBatches?.data?.data,
      referee_registered: refereeRegistereds?.data.data[0],
      ...(await serverSideTranslations(locale)),
    },
  }
}
