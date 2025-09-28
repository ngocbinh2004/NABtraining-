import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useSets = (query: string = '', enabled: boolean = false) => {
  return useQuery(['sets', query], (_: any) => getSets(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getSets = async (_: any, query: string = '') => {
  const response = await GET('sets', query)
  return response
}
