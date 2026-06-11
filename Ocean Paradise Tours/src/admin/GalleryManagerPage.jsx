import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { addGalleryImage, deleteGalleryImage, getGalleryImages, uploadGalleryImage } from '../services/galleryService.js'

export default function GalleryManagerPage() {
  const { data, loading, setData } = useFetch(getGalleryImages, [])
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function onUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')
    try {
      const imageUrl = await uploadGalleryImage(file)
      const created = await addGalleryImage({ image_url: imageUrl, caption })
      setData((prev) => [created, ...prev])
      setCaption('')
      setMessage('Image uploaded successfully.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function onAddUrl() {
    if (!imageUrl) {
      setMessage('Please enter an image URL.')
      return
    }

    setUploading(true)
    setMessage('')
    try {
      const created = await addGalleryImage({ image_url: imageUrl, caption })
      setData((prev) => [created, ...prev])
      setCaption('')
      setImageUrl('')
      setMessage('Image added successfully.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function onDelete(id) {
    await deleteGalleryImage(id)
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Gallery Management</h2>
      <div className="mt-4 rounded-2xl bg-white/5 p-4">
        <label className="text-sm text-cyan-100">Caption
          <input value={caption} onChange={(event) => setCaption(event.target.value)} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        </label>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input type="file" accept="image/*" disabled={uploading} onChange={onUpload} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
          <div>
            <input placeholder="Or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
            <button type="button" disabled={uploading} onClick={onAddUrl} className="btn-primary mt-2 w-full">Add Image by URL</button>
          </div>
        </div>
        {message ? <p className="mt-2 text-sm text-cyan-100">{message}</p> : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img src={item.image_url} alt={item.caption} className="h-48 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm text-cyan-100/90">{item.caption}</p>
              <button type="button" onClick={() => onDelete(item.id)} className="mt-2 rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
