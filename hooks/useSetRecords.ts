import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useSetRecords = (query: string = '', enabled: boolean = false) => {
  return useQuery(['set-records', query], (_: any) => getRecords(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
    enabled,
  })
}

const getRecords = async (_: any, query: string = '') => {
  const response = await GET('set-records', query)
  return response
}
