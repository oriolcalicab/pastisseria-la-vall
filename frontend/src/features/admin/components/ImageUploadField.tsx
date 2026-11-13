import type { ChangeEvent } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'

type ImageUploadFieldProps = {
  imageUrl: string
  onChange: (imageUrl: string) => void
}

const ImageUploadField = ({ imageUrl, onChange }: ImageUploadFieldProps) => {
  const { upload, isUploading, error } = useImageUpload(onChange)

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) void upload(file)

    event.target.value = ''
  }

  return (
    <div>
      <label htmlFor="image" className="block font-medium">
        Imatge del producte (JPG, PNG o WebP, fins a 5 MB)
      </label>

      {imageUrl && (
        <div className="mt-2 flex items-end gap-4">
          <img
            src={imageUrl}
            alt="Vista prèvia de la imatge del producte"
            className="h-32 w-32 rounded-2xl object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-sm text-red-700 underline"
          >
            Treu la imatge
          </button>
        </div>
      )}

      <input
        id="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={isUploading}
        className="mt-2 block text-sm"
      />

      {isUploading && (
        <p role="status" className="mt-1 text-sm text-mocha">
          Pujant la imatge...
        </p>
      )}

      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default ImageUploadField
