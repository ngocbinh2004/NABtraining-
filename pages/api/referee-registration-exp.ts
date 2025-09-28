import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const jsonObj = JSON.parse(req.body);
    const inputData = {
      experiences: jsonObj.data
    }
    const { data, status } = await axios.post(`/referee_registration/${jsonObj.referee_registration_id}/experiences`,
      inputData
    )

    res.status(status).json(data)
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
