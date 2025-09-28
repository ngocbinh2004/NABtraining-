import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useRegisteredTeam = (
  query: string = '',
  enabled: boolean = false
) => {
  return useQuery(
    ['registered-team', query],
    (_: any) => getRegisteredTeam(_, query),
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      refetchOnMount: false,
      enabled,
    }
  )
}

const getRegisteredTeam = async (_: any, query: string = '') => {
  const response = await GET('registered-team', query)
  return response
}
