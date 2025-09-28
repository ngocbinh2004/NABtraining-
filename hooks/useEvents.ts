import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useEvents = (query: string = '', enabled: boolean = false) => {
  return useQuery(['events', query], (_: any) => getEvents(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getEvents = async (_: any, query: string = '') => {
  const response = await GET('events', query)
  return response
}
