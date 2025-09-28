import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    switch (req.method) {
      case 'POST': {
        const { data, status } = await axios.post(
          '/referee_registration',
          JSON.parse(req.body)
        )

        return res.status(status).json(data)
      }
      case 'PUT': {
        const last_payment_account = JSON.parse(req.body).last_payment_account
        const portrait_photo = JSON.parse(req.body).portrait_photo
        const referee_certificate = JSON.parse(req.body).referee_certificate
        let input = {}
        if (last_payment_account && last_payment_account !== 'undefined') {
          input = {
            ...input,
            last_payment_account: last_payment_account,
          }
        }
        if (portrait_photo && portrait_photo !== 'undefined') {
          input = { ...input, portrait_photo: portrait_photo }
        }
        if (referee_certificate && referee_certificate !== 'undefined') {
          input = { ...input, referee_certificate: referee_certificate }
        }

        const { data, status } = await axios.put(
          `/referee_registration/${+JSON.parse(req.body)
            .referee_registration_id}`,
          input
        )
        return res.status(status).json(data)
      }
      default:
        return res.status(405).json('Method Not Allowed')
    }
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
