import { hasCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'

import { AUTH_PATH, NO_AUTH_PATH } from 'constants/route'

export function routeAuthentication({
  resolvedUrl,
  req,
  res,
}: {
  resolvedUrl: string
  res: NextApiResponse
  req: NextApiRequest
}) {
  const isLogin = hasCookie('SESSION', { req, res })

  const inPrivateRoute = AUTH_PATH.includes(resolvedUrl)
  const hasPrivateAccess = isLogin && inPrivateRoute

  const inNoAuthRoute = NO_AUTH_PATH.includes(resolvedUrl)
  const hasNoAuthAccess = !isLogin && inNoAuthRoute

  if (!inPrivateRoute && !inNoAuthRoute) return true

  return hasPrivateAccess || hasNoAuthAccess
}
