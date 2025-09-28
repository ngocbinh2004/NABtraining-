import { ISeason } from 'interfaces/season_type';
import { getMonthName } from './getMonthName'
import { dateFromUnix } from './unixDate'

export const beautifyDate = (
  date: number | string | Date,
  showDateOnly: boolean = true
) => {
  const dt = new Date(typeof date === 'string' ? +date : date);
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, '0')
  const day = dt.getDate().toString().padStart(2, '0')
  const hour = dt.getHours().toString().padStart(2, '0')
  const min = dt.getMinutes().toString().padStart(2, '0')

  return `${year}/${month}/${day}${showDateOnly ? '' : ` ${hour}:${min}`}`
}

export const beautifyMatchDate = (date: number | string | Date) => {
  const dt = new Date(typeof date === 'string' ? +date : date)

  const day = dt.toLocaleString('en-us', { weekday: 'long' })

  return `${dt
    .getDate()
    .toString()
    .padStart(2, '0')}/${dt.getMonth()}/${dt.getFullYear()};${day}`
}

export const beautifyUnixDate = (unixTime: number) => {
  const dt = dateFromUnix(unixTime)
  return beautifyDate(dt)
}

export const beautifyISODate = (
  date: number | string | Date,
  showDateOnly?: boolean
) => {
  const dt = new Date(date)
    .toISOString()
    ?.replace('T', ' ')
    .substring(0, showDateOnly ? 10 : 16)
  return dt
}

export const formatDate = (dateString: string, locale: string = 'zh-CN') => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', {
    month: 'short',
  })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

export const beautifyDateForReferee = (date: number | string | Date) => {
  const dt = new Date(typeof date === 'string' ? +date : date)

  return `${dt.getMonth() + 1}/${dt.getDate().toString().padStart(2, '0')}`
}

export const beautifyHourMinuteForReferee = (
  dateString: number | string | Date
): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export const beautifyDayMonthForReferee = (
  dateString: string,
  locale: string = 'zh-CN'
) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

export const getYearMonthDay = (
  dateString: string | Date,
  locale: string = 'zh-CN'
) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-US', {
    month: '2-digit',
  })
  const year = date.getFullYear()
  return `${year}/${month}/${day}`
}

export const formatScheduleDateTime = (
  dateString: string,
  t: (key: string) => string
) => {
  const date = new Date(dateString)

  const pad = (n: number) => String(n).padStart(2, '0')

  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  const weekDays = [
    t('Schedule.date.Sunday'),
    t('Schedule.date.Monday'),
    t('Schedule.date.Tuesday'),
    t('Schedule.date.Wednesday'),
    t('Schedule.date.Thursday'),
    t('Schedule.date.Friday'),
    t('Schedule.date.Saturday')
  ]
  const weekday = weekDays[date.getDay()]

  return {
    datePart: `${month}/${day} (${weekday})`,
    timePart: `${hours}:${minutes}`
  }
}

//Ex. 2023-24
export const formatSeasonYear = (season: ISeason) => {
  const startYear = new Date(season.startTime).getFullYear();
  const endYear = new Date(season.endTime).getFullYear();
  return `${startYear}-${String(endYear).slice(-2)}`;
};
