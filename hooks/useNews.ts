import { useQuery } from 'react-query'
import axios from 'axios'

import { GET } from 'helpers/ssrRequest'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export const useNews = (query: string = '', enabled: boolean = false) => {
  return useQuery(['news', query], (_: any) => getNews(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getNews = async (_: any, query: string = '') => {
  const response = await GET('news', query)
  return response
}
