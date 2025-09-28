import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useUserEvents = (
  query: string = '',
  enabled: boolean = false,
  initialData?: any
) => {
  return useQuery(['user-events', query], (_: any) => getUserEvents(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    initialData,
    enabled,
  })
}

const getUserEvents = async (_: any, query: string = '') => {
  const response = await GET('user-events', query)
  return response
}
