import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'

import { api } from 'constants/api'

axios.defaults.baseURL = api

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
  const headers = {
    Authorization: getCookie('SESSION', { req, res }),
  }
  try {
    let resp
    switch (req.method) {
      case 'GET': {
        resp = await axios.get('/user_teams', {
          params: req?.query,
          headers,
        })
        break
      }
      case 'PUT': {
        resp = await axios.put(
          `/user_teams/${req?.query?.id}`,
          JSON.parse(req.body),
          {
            headers,
          }
        )
        break
      }
      case 'POST': {
        resp = await axios.post('/user_teams', JSON.parse(req.body), {
          headers,
        })
        break
      }
      case 'DELETE': {
        resp = await axios.delete(`/user_teams/${req?.query?.id}`, {
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
