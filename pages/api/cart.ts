import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const sessionId = getCookie('SESSION', { req, res })
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(401).json('Unauthorized')
  }

  const headers = {
    Authorization: sessionId,
  }
  const { id: userId } = jwt.decode(sessionId) as JwtPayload
  try {
    let resp
    switch (req.method) {
      // case 'GET': {
      //   resp = await axios.get('/carts', {
      //     params: req?.query,
      //     headers,
      //   })
      //   break
      // }
      case 'PUT': {
        resp = await axios.put(
          `/carts/${req?.query?.id}`,
          JSON.parse(req.body),
          {
            headers,
          }
        )
        break
      }
      case 'POST': {
        resp = await axios.post(
          '/carts',
          {
            ...JSON.parse(req.body),
            user_id: userId,
          },
          {
            headers,
          }
        )
        break
      }
      case 'DELETE': {
        resp = await axios.delete(`/carts/${req?.query?.id}`, {
          headers,
        })
        break
      }
      default:
        break
    }

    res.status(resp?.status || 200).json(resp?.data || {})
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
