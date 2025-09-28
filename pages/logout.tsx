import type { NextApiRequest, NextApiResponse } from 'next'
import { removeCookies } from 'cookies-next'

export default function Logout() {
  return null
}

export function getServerSideProps({
  query,
  req,
  res,
}: {
  query: { [key: string]: any }
  res: NextApiResponse
  req: NextApiRequest
}) {
  removeCookies('SESSION', { req, res })
  removeCookies('FROM', { req, res })

  const destination = query?.redirect === '/forgot-password' ? '/login' : '/'

  return {
    redirect: { destination, permanent: false },
  }
}
