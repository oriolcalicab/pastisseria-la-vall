import { getRequiredEnv } from '../config/env.js'
import { signCloudinaryParams } from '../utils/cloudinarySignature.js'

export const PRODUCT_IMAGE_FOLDER = 'pastisseria-la-vall/products'

export const createUploadSignature = (now = new Date()) => {
  const timestamp = Math.floor(now.getTime() / 1000)
  const params = { folder: PRODUCT_IMAGE_FOLDER, timestamp }

  return {
    cloudName: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getRequiredEnv('CLOUDINARY_API_KEY'),
    folder: PRODUCT_IMAGE_FOLDER,
    timestamp,
    signature: signCloudinaryParams(params, getRequiredEnv('CLOUDINARY_API_SECRET')),
  }
}
