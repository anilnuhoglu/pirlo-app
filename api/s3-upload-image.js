import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from 'uuid'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  
    if (req.method === "OPTIONS") {
      return res.status(200).end()
    }
  
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method not allowed" })
    }
  
    try {
      const ext = req.query.ext || "jpg"
      const filename = `images/${uuidv4()}.${ext}`
  
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        ContentType: `image/${ext}`
      })
  
      const url = await getSignedUrl(s3, command, { expiresIn: 300 })
  
      const publicUrl =`https://pirlo-menu-app.s3.eu-central-1.amazonaws.com/${filename}`
  
      res.status(200).json({ url, publicUrl })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to generate image upload URL" })
    }
  }
  