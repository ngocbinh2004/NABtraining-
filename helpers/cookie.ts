import { getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const decodeSessionCookie = () => {
  const sessionId = getCookie('SESSION')
  if (!sessionId || typeof sessionId !== 'string') {
    return
  }

  const user = jwt.decode(sessionId) as JwtPayload
  return user
}

export const userRole = () => decodeSessionCookie()?.role
export const userId = () => decodeSessionCookie()?.id
