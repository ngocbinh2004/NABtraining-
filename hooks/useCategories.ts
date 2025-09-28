import { useQuery } from 'react-query'

import { GET } from 'helpers/ssrRequest'

export const useCategories = (query: string = '', enabled: boolean = false) => {
  return useQuery(['categories', query], (_: any) => getCategories(_, query), {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchOnMount: false,
  })
}

const getCategories = async (_: any, query: string = '') => {
  const response = await GET('categories', query)
  return response
}
