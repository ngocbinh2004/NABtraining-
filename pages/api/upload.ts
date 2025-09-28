import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import S3 from 'aws-sdk/clients/s3'

import { api } from 'constants/api'

axios.defaults.baseURL = api

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

const s3 = new S3({
  region: process.env.NEXT_AWS_REGION,
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_AWS_SECRET,
})

export const config = {
  api: {
    responseLimit: false,
    bodyParse: {
      sizeLimit: false,
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    /*const sessionId = getCookie('SESSION', { req, res })
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(401).json('Unauthorized')
    }
    const { id: userId } = jwt.decode(sessionId) as JwtPayload
    if (!userId) {
      return res.status(401).json('Unauthorized')
    }*/
    const userId = getRandomInt(1000);
    const { file: { type = 'png', name = 'image' } = {} } = req?.body
      ? JSON.parse(req?.body)
      : {}

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const fileParams = {
      Bucket: `${process.env.NEXT_AWS_BUCKET}`,
      Key: `${name}-${userId}-${year}-${month}-${day}-${hours}-${minutes}-${seconds}-${milliseconds}.${type}`,
      Expires: 600,
      CacheControl: 'no-cache',
      ACL: 'public-read',
      ContentType: 'image/png',
    }
    const url = await s3.getSignedUrlPromise('putObject', fileParams)
    res.status(200).json(`${url}`)
  } catch (error: any) {
    console.log(error)
    res.status(400).json(error?.response?.data)
  }
}
