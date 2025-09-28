import { useQuery } from 'react-query'
import axios from 'axios'

import { GET } from 'helpers/ssrRequest'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export const useVideos = (query: string = '', enabled: boolean = false) => {
  return useQuery(['videos', query], (_: any) => getVideos(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getVideos = async (_: any, query: string = '') => {
  const response = await GET('videos', query)
  return response
}
