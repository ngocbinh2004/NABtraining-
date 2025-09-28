import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const sessionId = getCookie('SESSION', { req, res })
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(401).json('Unauthorized')
    }
    const { id: userId } = jwt.decode(sessionId) as JwtPayload
    if (!userId) {
      return res.status(401).json('Unauthorized')
    }

    const { data, status } = await axios.post(
      '/user_tickets/send_ticket_to_email',
      {
        ...JSON.parse(req.body),
        user_id: userId,
      },
      {
        headers: {
          Authorization: sessionId,
        },
      }
    )

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
