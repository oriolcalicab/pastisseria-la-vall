import { apiUrl } from '../../../lib/api'

export type UploadSignature = {
  cloudName: string
  apiKey: string
  folder: string
  timestamp: number
  signature: string
}

export const fetchUploadSignature = async (token: string): Promise<UploadSignature> => {
  const response = await fetch(apiUrl('/api/admin/uploads/signature'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error(`Signature request failed with status ${response.status}`)

  return response.json() as Promise<UploadSignature>
}

export const uploadToCloudinary = async (file: File, signature: UploadSignature) => {
  const body = new FormData()
  body.append('file', file)
  body.append('api_key', signature.apiKey)
  body.append('timestamp', String(signature.timestamp))
  body.append('folder', signature.folder)
  body.append('signature', signature.signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: 'POST', body },
  )

  if (!response.ok) throw new Error(`Cloudinary upload failed with status ${response.status}`)

  const { secure_url: imageUrl } = (await response.json()) as { secure_url: string }

  return imageUrl
}
