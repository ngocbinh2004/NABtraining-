import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { data, status } = await axios.post(
      '/user_teams/invite',
      JSON.parse(req.body),
      {
        headers: {
          Authorization: getCookie('SESSION', { req, res }),
        },
      }
    )

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
