
import api from './api'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  // Jangan menetapkan Content-Type secara manual.
  // Browser/Axios akan menambahkan multipart boundary.
  const response = await api.post('/admin/upload', formData)

  if (!response.data?.success || !response.data?.data?.url) {
    throw new Error(response.data?.message || 'Upload gagal')
  }

  return {
    ...response.data.data,
    full_url: getFileUrl(response.data.data.url)
  }
}

export function getFileUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
