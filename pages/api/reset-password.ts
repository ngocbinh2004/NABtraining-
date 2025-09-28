import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { data, status } = await axios.post(
      '/users/reset-password',
      JSON.parse(req.body)
    )

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
