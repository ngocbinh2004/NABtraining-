import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'

export default async function uploadImage({
  name,
  image,
}: {
  name: string
  image: string
}) {
  const signedUrl = await POST('upload', {
    name: name,
    type: 'png',
  })
  // Fetching out an url
  if (signedUrl) {
    // Uploading a file
    const result = await fetch(signedUrl, {
      method: 'PUT',
      body: Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      ),
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': '*',
      },
    })
    return result?.url?.split('?AWSAccessKeyId')?.[0]
  }
}
