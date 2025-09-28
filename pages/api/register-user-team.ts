import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import { api } from 'constants/api'

axios.defaults.baseURL = api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const body = JSON.parse(req.body)
    const resp = await axios.post('/users/register-team-member', body)

    res.status(resp?.status || 200).json(resp?.data || {})
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
