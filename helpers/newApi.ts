import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_CUSTOMER_API,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_CUSTOMER_API_KEY,
    withCredentials: true,
  },
})

export const getMatches = async (query = '', options = {}) => {
  return await api.get(`/matches${query}`, options)
}

export const getTeam = async (id: string | number, options = {}) => {
  return await axios.get(`/api/proxy/team?id=${id}`, options)
}

export const getSquad = async (eventId: string | number) => {
  return await api.get(`events/${eventId}/squads`)
}

//Use to fetch squads in component
export const getSquadsClientSide = async (eventId: string | number) => {
  return await axios.get(`/api/proxy/events/${eventId}/squads`)
}

export const getSquadDetail = async (
  squadId: number | string,
  options = {}
) => {
  return await api.get(`/squads/${squadId}`, options)
}

export const getRoster = async (squadId: number | string, options = {}) => {
  return await api.get(`/squads/${squadId}/rosters`, options)
}

//Use to fetch rosters in component
export const getRostersClientSide = async (squadId: string | number) => {
  return await axios.get(`/api/proxy/squads/${squadId}/rosters`)
}

export const getEvents = async (seasonId: number | string, options = {}) => {
  return await api.get(`/events?seasonId=${seasonId}`, options)
}

//Use to fetch events in component
export const getEventsClientSide = async (seasonId: string | number) => {
  return await axios.get(`/api/proxy/events?seasonId=${seasonId}`)
}

export const getEventDetail = async (
  eventId: number | string,
  options = {}
) => {
  return await api.get(`/events/${eventId}`, options)
}

export const getRosterDetail = async (
  rosterId: number | string,
  options = {}
) => {
  return await api.get(`/rosters/${rosterId}`, options)
}

export const getSeasons = async (leagueId: number | string, options = {}) => {
  return await api.get(`/seasons?leagueId=${leagueId}`, options)
}

export const getSeasonDetails = async (seasonId: number | string, options = {}) => {
  return await api.get(`/seasons/${seasonId}`, options)
}

export const getEventRosterStatistics = async (
  eventId: number | string,
  rosterId: number | string,
  options = {}
) => {
  return await api.get(
    `/stats/volleyball/events/${eventId}/matches/aggregated/rosters/${rosterId}`,
    options
  )
}

//Use to fetch Event Roster Statistics in component
export const getEventRosterStatisticsClientSide = async (
  eventId: string | number,
  rosterId: string | number
) => {
  return await axios.get(
    `/api/proxy/stats/volleyball/events/${eventId}/matches/aggregated/rosters/${rosterId}`
  )
}
export const getCrew = async (squadId: number | string, options = {}) => {
  return await api.get(`/squads/${squadId}/crews`, options)
}

export const getMatchStats = async (matchId: string | number) => {
    return await api.get(`stats/volleyball/matches/${matchId}`)
}