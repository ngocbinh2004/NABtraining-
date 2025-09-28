import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useTickets = (query: string = '', enabled: boolean = false) => {
  return useQuery(['tickets', query], (_: any) => getTickets(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getTickets = async (_: any, query: string = '') => {
  const response = await GET('tickets', query)
  return response
}
