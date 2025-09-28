import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const headers = {
    Authorization: getCookie('SESSION', { req, res }),
  }
  try {
    let resp
    switch (req.method) {
      case 'GET': {
        resp = await axios.get('/events', {
          params: req?.query,
          headers,
        })
        break
      }
      case 'PUT': {
        resp = await axios.put(
          `/events/${req?.query?.id}`,
          JSON.parse(req.body),
          {
            headers,
          }
        )
        break
      }
      case 'POST': {
        resp = await axios.post('/events', JSON.parse(req.body), {
          headers,
        })
        break
      }
      case 'DELETE': {
        resp = await axios.delete(`/events/${req?.query?.id}`, {
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
