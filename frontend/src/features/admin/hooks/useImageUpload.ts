import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchUploadSignature, uploadToCloudinary } from '../services/imageUploadApi'
import { validateImageFile } from '../utils/imageFile'

export const useImageUpload = (onUploaded: (imageUrl: string) => void) => {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    const fileError = validateImageFile(file)

    if (fileError) {
      setError(fileError)
      return
    }

    if (!user) return

    setIsUploading(true)
    setError('')

    try {
      const signature = await fetchUploadSignature(await user.getIdToken())
      onUploaded(await uploadToCloudinary(file, signature))
    } catch {
      setError("No s'ha pogut pujar la imatge. Torna-ho a provar.")
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error }
}
