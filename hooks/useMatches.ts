import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useMatches = (query: string = '', enabled?: boolean) => {
  return useQuery(['matches', query], (_: any) => getMatches(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getMatches = async (_: any, query: string = '') => {
  const response = await GET('matches', query)
  return response
}
