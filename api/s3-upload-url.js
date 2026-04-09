import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const version = Date.now()
    const menuKey = `menu/menu-${version}.json`
    const manifestKey = 'menu/current.json'

    const menuCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: menuKey,
      ContentType: 'application/json',
      CacheControl: 'public, max-age=31536000, immutable'
    })

    const manifestCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: manifestKey,
      ContentType: 'application/json',
      CacheControl: 'no-store, max-age=0'
    })

    const menuUrl = await getSignedUrl(s3, menuCommand, {
      expiresIn: 300
    })

    const manifestUrl = await getSignedUrl(s3, manifestCommand, {
      expiresIn: 300
    })

    res.status(200).json({
      menuUrl,
      manifestUrl,
      version,
      menuKey
    })
  } catch (err) {
    console.error('S3 Signed URL Error:', err)
    res.status(500).json({ error: "Failed to generate presigned URL" })
  }
}
