
import { useRef, useState } from 'react'
import { ImagePlus, UploadCloud, X } from 'lucide-react'
import { uploadFile } from '../services/upload'
import './ImageUploader.css'

export default function ImageUploader({
  value = '',
  onChange,
  label = 'Upload Image',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMB} MB`)
      event.target.value = ''
      return
    }

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setLoading(true)

    try {
      const uploaded = await uploadFile(file)
      setPreview(uploaded.full_url)
      onChange?.(uploaded.url, uploaded)
    } catch (err) {
      setPreview(value)
      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal mengunggah file'
      )
    } finally {
      setLoading(false)
      event.target.value = ''
      URL.revokeObjectURL(localPreview)
    }
  }

  const removeImage = () => {
    setPreview('')
    onChange?.('', null)
  }

  return (
    <div className="image-uploader">
      <label className="uploader-label">{label}</label>

      <div className="uploader-box">
        {preview ? (
          <div className="uploader-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="uploader-empty">
            <ImagePlus size={32} />
            <strong>Choose an image</strong>
            <span>JPG, PNG, WEBP · Max {maxSizeMB} MB</span>
          </div>
        )}

        <button
          type="button"
          className="upload-trigger"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud size={16} />
          {loading ? 'Uploading...' : 'Select File'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFile}
        />
      </div>

      {error && <p className="upload-error">{error}</p>}
    </div>
  )
}
