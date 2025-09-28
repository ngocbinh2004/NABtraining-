import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/atoms/Icon'
import Text from '@/atoms/Text'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getRefereeCourseByID, getRulesRefereeCourse } from 'helpers/api'
import { IRefereeCourse, ICourseRule } from 'interfaces/referee_type'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

interface IProps {
  course: IRefereeCourse
  courseRules?: ICourseRule[]
  courseID: number
}

export default function RefereePage({
  course,
  courseRules = [],
  courseID,
}: IProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const [openIndices, setOpenIndices] = useState<boolean[]>(
    Array(courseRules.length).fill(false)
  )
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false)
  const nextButtonRef = useRef<HTMLDivElement>(null)

  const handleToggle = (index: number) => {
    setOpenIndices((prevOpenIndices) => {
      const newOpenIndices = [...prevOpenIndices]
      newOpenIndices[index] = !newOpenIndices[index]
      return newOpenIndices
    })
  }

  const handleNextClick = () => {
    router.push(`/referee/referee-personal-information?course_id=${courseID}`)
  }

  useEffect(() => {
    const buttonRef = nextButtonRef.current

    if (!buttonRef) return

    const observer = new IntersectionObserver(
      ([entry], observer) => {
        setIsNextButtonVisible(entry.isIntersecting)
        if (entry.isIntersecting) {
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(buttonRef)

    return () => {
      observer.unobserve(buttonRef)
    }
  }, [])

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0')
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
    <div className="flex justify-center items-center p-4 min-h-screen">
      <div className="w-full max-w-screen-lg">
        <div className="flex flex-wrap my-4 lg:my-6">
          <Icon
            icon="referee-icon"
            height={isMobile ? 18 : 32}
            width={isMobile ? 18 : 32}
            classNames={`${isMobile ? 'mt-2' : ''}`}
          />
          <Text
            size="unset"
            classNames="flex-1 font-semibold text-2xl lg:text-[28px] text-white mx-2.5 flex items-center title_mobile"
          >
            {course.name}
          </Text>
        </div>

        <div className="w-full lg:max-w-[1200px] space-y-4 lg:space-y-6">
          {courseRules.map((rule, index) => (
            <div
              key={index}
              className="border border-white background-card boxBlurShadow p-10"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold lg:font-semibold text-lg lg:text-xl text-white leading-[150%]">
                  <span
                    className="font-semibold lg:font-bold text-lg lg:text-xl leading-[150%]"
                    style={{ color: '#FFFFFF' }}
                  >
                    {formatNumber(index + 1)}.
                  </span>{' '}
                  {rule.title}
                </span>
                <button onClick={() => handleToggle(index)}>
                  {openIndices[index] ? (
                    <IoIosArrowUp className="h-4 w-4 text-white" />
                  ) : (
                    <IoIosArrowDown className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
              {openIndices[index] && (
                <>
                  <hr className="w-full flex border-t border-white my-4 mx-auto" />
                  <div className="mt-2">
                    <p className="font-normal text-base lg:text-lg text-white whitespace-pre-wrap">
                      {rule.contents}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {!isNextButtonVisible && (
          <div className="w-[330px] h-[45px] lg:w-[510px] lg:h-[50px] fixed inset-x-0 bottom-[3.5rem] inline-flex flex-row items-center justify-center py-2 bg-black bg-opacity-90 rounded-md z-30 space-x-3 mx-auto pl-4">
            <div className="flex flex-col justify-start">
              <p className="font-medium text-sm lg:text-lg text-white">
                {t('RefereePage.scroll_down_tips')}
              </p>
            </div>
            <div className="flex justify-end">
              <Icon
                icon="angle-double-down"
                height={16}
                width={16}
                classNames="mr-4"
              />
            </div>
          </div>
        )}

        <div className="w-full flex flex-col lg:flex-row justify-center items-center mt-16 gap-2 lg:gap-4">
          <button
            className="w-full h-[51px] lg:h-[60px] border border-white text-white hover:border-none hover:text-black hover:bg-[#009919] font-medium text-base lg:text-lg"
            onClick={() => router.push('/referee/referee-list-course')}
          >
            {t('RefereePage.back')}
          </button>
          <button
            className="w-full h-[51px] lg:h-[60px] text-white hover:text-black bg-[#009919] hover:bg-[#009919] font-medium text-base lg:text-lg"
            onClick={handleNextClick}
          >
            {t('RefereePage.next')}
          </button>
        </div>

        <div ref={nextButtonRef}></div>
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

  const courseRules = await getRulesRefereeCourse(
    `/${courseID}/rules?language=${locale === 'en' ? 'ENGLISH' : 'CHINESE'}`
  )
  return {
    props: {
      course: courseReferee?.data?.data[0],
      courseRules: courseRules?.data?.data,
      courseID: courseID,
      ...(await serverSideTranslations(locale)),
    },
  }
}
