import React, { useState, useEffect } from 'react'
import Image from '@/molecules/media/Image'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import CardEmpty from '@/organisms/card/information/CardEmpty'

import { beautifyDateForReferee, beautifyDate } from 'helpers/beautifyDate'
import { getRefereeCourses } from 'helpers/api'
import { IRefereeCourse } from 'interfaces/referee_type'
import Title from '@/components/common/Title'

interface IProps {
  courses?: IRefereeCourse[]
}

export default function RefereePage({ courses = [] }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [sortOrder, setSortOrder] = useState('desc')

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'))
  }

  const handleRegister = (course_id: number) => {
    const selectCourse = courses.find((course) => course.id == course_id)
    if (selectCourse?.time_batches.length === 0) {
      return toast.error(t('Common.GeneralErrMsg'))
    }
    router.push(`/referee/referee-training-content?course_id=${course_id}`)
  }

  const sortedReferees = sortOrder === 'desc' ? [...courses].reverse() : courses

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
    <>
      <div className="wl-home container mx-auto">
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Title
              title_text={t('RefereePage.title_page_1')}
              isMobile={isMobile}
            />
          </div>
          <div className="flex flex-row items-center">
            <h1 className="mr-2 text-white text-[16px]">
              {sortOrder === 'desc'
                ? t('RefereePage.order_desc')
                : t('RefereePage.order_asc')}
            </h1>
            <div onClick={toggleSortOrder} className="cursor-pointer">
              <Image
                url="/assets/filter.png"
                alt="filter icon"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
        <div className={`mt-4 mb-4`}>
          {sortedReferees && sortedReferees.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {sortedReferees.map((course, index) => {
                const isExpired =
                  beautifyDate(new Date()) > beautifyDate(course.end_date)

                return (
                  <div
                    key={index}
                    className="px-4 lg:px-10 h-[178px] lg:h-[112px] gap-6 border border-white background-card boxBlurShadow flex flex-col sm:flex-row items-center justify-between"
                  >
                    <div
                      className={`flex flex-col justify-start w-full sm:w-auto ${
                        isMobile ? 'mt-2' : ''
                      }`}
                    >
                      <div className="font-semibold text-lg text-white mb-2 text-left leading-[150%] break-words category_mobile">
                        {course.name}
                      </div>
                      <div className="flex flex-row gap-2 lg:gap-3 items-center flex-wrap">
                        <div className="w-fit flex items-center font-semibold text-xs lg:text-sm bg-[#009465] text-white p-2">
                          {course.grade}
                        </div>
                        <div className="w-fit flex items-center font-semibold text-xs lg:text-sm bg-[#009465] text-white p-2">
                          {course.location}
                        </div>
                        <div className="w-fit flex items-center font-semibold text-xs lg:text-sm bg-[#009465] text-white p-2">
                          {beautifyDateForReferee(course.start_date)} -{' '}
                          {beautifyDateForReferee(course.end_date)}
                        </div>
                      </div>
                    </div>
                    {isMobile ? (
                      <>
                        <hr className="w-full border-t border-white" />
                      </>
                    ) : null}
                    <div
                      className={`w-full ${
                        isMobile ? 'mb-4' : ''
                      } sm:mt-0 sm:w-auto`}
                    >
                      <button
                        className={`w-full flex justify-center items-center h-[37px] lg:h-[48px] ${
                          isExpired ? 'bg-[#D9D9D9]' : 'bg-[#009919]'
                        }  lg:w-[96px] sm:w-auto`}
                        onClick={() => handleRegister(course.id)}
                        disabled={isExpired}
                        style={{
                          cursor: isExpired ? 'default' : 'pointer',
                        }}
                      >
                        <span
                          className={`${
                            isExpired ? 'text-[#979797]' : 'text-white'
                          }  font-medium text-sm lg:text-base leading-[150%]`}
                        >
                          {t('RefereePage.en_roll')}
                        </span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full border border-white background-card boxBlurShadow px-6 py-4">
              <CardEmpty />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  const referees = await getRefereeCourses(
    `?language=${locale === 'en' ? 'ENGLISH' : 'CHINESE'}`
  )
  return {
    props: {
      courses: referees?.data?.data,
      ...(await serverSideTranslations(locale)),
    },
  }
}
