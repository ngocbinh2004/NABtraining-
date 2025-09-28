import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: false,
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const sessionId = getCookie('SESSION', { req, res })
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(401).json('Unauthorized')
  }

  const { id: userId } = jwt.decode(sessionId) as JwtPayload
  if (!userId) {
    return res.status(401).json('Unauthorized')
  }

  try {
    const { data, status } = await axios.get(
      `/events/user_events?user_id=${userId}`,
      {
        headers: {
          Authorization: sessionId,
        },
      }
    )

    res.status(status).json(data || {})
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
