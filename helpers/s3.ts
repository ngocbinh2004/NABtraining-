import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const region = process.env.NEXT_AWS_REGION!
const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID!
const secretAccessKey = process.env.NEXT_AWS_SECRET!
const bucket = process.env.NEXT_AWS_BUCKET!

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
})

export const s3Api = {
  upload: async (params: { file: Buffer; title: string }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const key = `_${params.title}.png`
      const body = {
        Bucket: bucket,
        Key: key,
        Body: params.file,
        ContentType: 'image/png',
        CacheControl: 'no-cache',
      }

      const command = new PutObjectCommand(body)
      await s3Client.send(command)

      const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`
      resolve(url)
    })
  },
}
