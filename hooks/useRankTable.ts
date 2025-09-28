import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useRankTable = (query: string = '', enabled: boolean = false) => {
  return useQuery(['rank-table', query], (_: any) => getRankTable(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getRankTable = async (_: any, query: string = '') => {
  const response = await GET('rank-table', query)
  return response
}
