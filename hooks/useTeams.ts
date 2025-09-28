import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useTeams = (query: string = '', enabled: boolean = false) => {
  return useQuery(['teams', query], (_: any) => getTeams(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getTeams = async (_: any, query: string = '') => {
  const response = await GET('teams', query)
  return response
}
