import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'

export const config = {
  api: {
    responseLimit: false,
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
    if (req.method === 'POST') {
      const { data, status } = await axios.put(
        `/users/${userId}`,
        JSON.parse(req.body),
        {
          headers: {
            Authorization: sessionId,
          },
        }
      )
      return res.status(status).json(data)
    }
    if (req.method === 'GET') {
      const { data, status } = await axios.get(`/users?id=${userId}`, {
        headers: {
          Authorization: sessionId,
        },
      })
      return res.status(status).json(data)
    }
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
