const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryReady = !!(CLOUD_NAME && UPLOAD_PRESET)

async function cloudinaryUpload(file, resourceType) {
  if (!cloudinaryReady) {
    throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local')
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `${resourceType} upload failed.`)
  }
  const data = await res.json()
  return data.secure_url
}

export const uploadImage = (file) => cloudinaryUpload(file, 'image')
export const uploadVideo = (file) => cloudinaryUpload(file, 'video')
