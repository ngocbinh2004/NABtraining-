import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useUserTeam = (
  query: string = '',
  enabled: boolean = false,
  initialData?: any
) => {
  return useQuery(['user-team', query], (_: any) => getUserTeam(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    initialData,
    enabled,
  })
}

const getUserTeam = async (_: any, query: string = '') => {
  const response = await GET('user-team', query)
  return response
}
