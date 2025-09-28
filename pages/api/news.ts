import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { data, status } = await axios.get('/news', {
      params: req?.query,
    })

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
