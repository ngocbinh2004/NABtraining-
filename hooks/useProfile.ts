import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useProfile = (query: string = '', enabled: boolean = false) => {
  return useQuery(['profile', query], (_: any) => getProfile(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getProfile = async (_: any, query: string = '') => {
  const response = await GET('profile', query)
  return response
}
