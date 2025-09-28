import { useQuery } from 'react-query'
import axios from 'axios'

import { GET } from 'helpers/ssrRequest'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export const useEventScore = (query: string = '', enabled: boolean = false) => {
  return useQuery(['eventRecord', query], (_: any) => getEventScore(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getEventScore = async (_: any, query: string = '') => {
  const response = await GET('game-record', query)
  return response
}
