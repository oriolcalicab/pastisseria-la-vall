const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Tria una imatge JPG, PNG o WebP'
  if (file.size > MAX_SIZE_BYTES) return 'La imatge pot ocupar fins a 5 MB'

  return null
}
