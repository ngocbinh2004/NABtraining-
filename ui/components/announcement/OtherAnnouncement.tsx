import { Fragment } from 'react'
import { cx } from 'class-variance-authority'
import { getYearMonthDay } from 'helpers/beautifyDate'
import { IAnnouncement } from 'interfaces/announcement_type'
import { useTranslation } from 'next-i18next'
import LinkText from '@/molecules/LinkText'
import { useRouter } from 'next/router'
import { RiArrowRightSLine } from 'react-icons/ri'

interface AnnouncementProps {
  announcement: IAnnouncement
  className?: string
}

const Element: React.FC<AnnouncementProps> = ({ announcement, className }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div
      className={cx(
        'flex flex-col items-start px-4 lg:px-12 py-4 w-full lg:w-1/3',
        className
      )}
    >
      <div className="w-full">
        <div className="font-semibold text-white text-lg mb-2 truncate overflow-hidden whitespace-nowrap text-ellipsis w-full">
          {announcement.title}
        </div>
      </div>

      <div className="flex justify-between w-full">
        <span className="font-normal text-base">
          {getYearMonthDay(announcement.create_dt, router.locale)}
        </span>

        <div className="cursor-pointer flex items-center">
          <LinkText
            href={`/announcement/announcement-content?id=${announcement.id}&category=${announcement.category}`}
            size="unset"
            classNames="text-white font-medium flex items-center text-base"
          >
            {t('MainPage.ContainerPage.see_more')}
            <RiArrowRightSLine size={24} className="ml-1 text-white" />
          </LinkText>
        </div>
      </div>
    </div>
  )
}

interface OtherAnnouncementProps {
  isHorizontal?: boolean
  announcements: IAnnouncement[]
}

const OtherAnnouncement: React.FC<OtherAnnouncementProps> = ({
  isHorizontal,
  announcements,
}) => {
  const { t } = useTranslation()
  if (!announcements || announcements.length === 0) {
    return (
      <div className="border border-white background-card boxBlurShadow text-white flex justify-center items-center py-8 w-full">
        <p className="text-white text-center text-xl">{t('ComingSoon.title')}</p>
      </div>
    )
  }

  return (
    <div className="border border-white background-card boxBlurShadow text-white flex flex-col lg:flex-row justify-between items-center ">
      {announcements.map((item, index) => (
        <Fragment key={index}>
          <Element
            announcement={item}
            className={
              index < announcements.length - 1
                ? isHorizontal
                  ? 'bottom-line'
                  : 'vertical-line'
                : ''
            }
          />
        </Fragment>
      ))}

      {announcements.length < 3 &&
        new Array(3 - announcements.length)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="flex-grow" />
          ))}
    </div>
  )
}

export default OtherAnnouncement
