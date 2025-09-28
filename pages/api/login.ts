import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { setCookie } from 'cookies-next'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { data, status } = await axios.post(
      '/users/login',
      JSON.parse(req.body)
    )

    setCookie('SESSION', data, { req, res })

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
