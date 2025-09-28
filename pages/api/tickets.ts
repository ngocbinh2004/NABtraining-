import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const sessionId = getCookie('SESSION', { req, res })

    const { data, status } = await axios.get('/tickets', {
      params: req?.query,
      headers: {
        Authorization: sessionId,
      },
    })

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
