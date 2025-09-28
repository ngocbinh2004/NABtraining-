import axios from 'axios'

import { api } from '../constants/api'

axios.defaults.baseURL = api

export const getEvent = async (query = '') => await axios.get(`events${query}`)
export const getUserEvents = async (userId = '', options = {}) =>
  await axios.get(`/events/user_events?user_id=${userId}`, options)
export const getDailySets = async () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  return await axios.get(
    'sets?updated_dt=' + encodeURIComponent(`>`) + yesterday.getTime()
  )
}

export const getMatch = async (query = '') => await axios.get(`matches${query}`)
export const getGameRecord = async (query = '', options = {}) =>
  await axios.get(`${api}/events/total_team_score_on_event${query}`, options)

export const getCategories = async (query = '') =>
  await axios.get(`category${query}`)

export const getRankTable = async (query = '') =>
  await axios.get(`rank_tables${query}`)

export const getRegisteredTeam = async (query = '', options = {}) =>
  await axios.get(`${api}/registered_teams${query}`, options)

export const getTeam = async (query = '', options = {}) =>
  await axios.get(`${api}/teams${query}`, options)

export const getFaqs = async (query = '', options = {}) =>
  await axios.get(`${api}/faq${query}`, options)

export const getUserTeam = async (query = '', options = {}) =>
  await axios.get(`${api}/user_teams${query}`, options)

export const getNews = async (query = '', options = {}) =>
  await axios.get(`${api}/news${query}`, options)

export const getVideos = async (query = '', options = {}) =>
  await axios.get(`${api}/videos${query}`, options)

export const getPhotos = async (query = '', options = {}) =>
  await axios.get(`${api}/photos${query}`, options)

export const getBanners = async (query = '', options = {}) =>
  await axios.get(`${api}/banners${query}`, options)

export const getTickets = async (query = '', options = {}) =>
  await axios.get(`${api}/tickets${query}`, options)

export const getUserTickets = async (query = '', options = {}) =>
  await axios.get(`${api}/user_tickets${query}`, options)

export const getUserCarts = async (query = '', options = {}) =>
  await axios.get(`${api}/carts${query}`, options)

export const getUserFavorites = async (query = '', options = {}) =>
  await axios.get(`${api}/favorite_tickets${query}`, options)

export const getRefereeCourses = async (query = '', options = {}) =>
  await axios.get(`${api}/referee_course${query}`, options)

export const getRulesRefereeCourse = async (query = '', options = {}) =>
  await axios.get(`${api}/referee_course${query}`, options)

export const getRefereeCourseByID = async (query = '', options = {}) =>
  await axios.get(`${api}/referee_course${query}`, options)

export const getTimeBatchRefereeCourse = async (query = '', options = {}) =>
  await axios.get(`${api}/referee_course${query}`, options)

export const getRegisteredReferee = async (query = '', options = {}) =>
  await axios.get(`${api}/referee_registration${query}`, options)

export const getAnnouncement = async (query = '', options = {}) =>
  await axios.get(`${api}/announcements${query}`, options)

export const getPartners = async (query = '', options = {}) =>
  await axios.get(`${api}/partners${query}`, options)

export const getAlbums = async (query = '', options = {}) =>
  await axios.get(`${api}/albums${query}`, options)

export const getLeague = async (query = '', options = {}) =>
  await axios.get(`${api}/leagues${query}`, options)

export const getSchedule = async (query = '', options = {}) =>
  await axios.get(`${api}/schedules${query}`, options)

export const getLeagueRecord = async (query = '', options = {}) =>
  await axios.get(`${api}/leagues/records${query}`, options)

export const getRefereeIntroduction = async (query = '', options = {}) =>
  await axios.get(`${api}/referees${query}`, options)

export const getCity = async (query = '', options = {}) =>
  await axios.get(`${api}/Taiwan_city${query}`, options)

export const putRefereeRegistration = async (id: number, body = {}) => {
  return await axios.put(`${api}/referee_registration/${id}`, body)
}

export const getIndividuals = async (query = '', options = {}) =>
  await axios.get(`${api}/individual${query}`, options)

export const sendMailContactUs = async (body = {}) => {
  return await axios.post(`${api}/contact_us`, body)
}
