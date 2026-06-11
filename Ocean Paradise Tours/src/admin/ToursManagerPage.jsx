import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { createTour, deleteTour, getTours, updateTour, uploadTourImage } from '../services/tourService.js'

const initial = {
  title: '',
  description: '',
  price: '',
  currency: 'USD',
  duration: '',
  image: '',
  rating: 5,
  highlights: '',
}

export default function ToursManagerPage() {
  const { data, loading, error, setData } = useFetch(getTours, [])
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setActionLoading(true)
    try {
      const imageUrl = await uploadTourImage(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
      setMessage('Image uploaded.')
    } catch (uploadError) {
      setMessage(uploadError.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function onSubmit(event) {
    event.preventDefault()
    setActionLoading(true)

    try {
      if (editingId) {
        const payload = { ...form, price: Number(form.price), rating: Number(form.rating) }
        // convert newline-separated highlights into array
        payload.highlights = (form.highlights || '').split('\n').map((s) => s.trim()).filter(Boolean)
        const updated = await updateTour(editingId, payload)
        setData((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
        setMessage('Tour updated.')
      } else {
        const payload = { ...form, price: Number(form.price), rating: Number(form.rating) }
        payload.highlights = (form.highlights || '').split('\n').map((s) => s.trim()).filter(Boolean)
        const created = await createTour(payload)
        setData((prev) => [...prev, created])
        setMessage('Tour added.')
      }
      setForm(initial)
      setEditingId(null)
    } catch (submitError) {
      setMessage(submitError.message)
    } finally {
      setActionLoading(false)
    }
  }

  function onEdit(item) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      description: item.description,
      price: item.price,
      currency: item.currency || 'USD',
      duration: item.duration,
      image: item.image,
      rating: item.rating,
      highlights: (item.highlights || []).join('\n'),
    })
  }

  async function onDelete(id) {
    try {
      await deleteTour(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setMessage(err?.message || 'Could not delete tour.')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Tour Management</h2>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white/5 p-4 md:grid-cols-2">
        <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <input name="duration" value={form.duration} onChange={onChange} placeholder="Duration" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <input name="price" value={form.price} onChange={onChange} type="number" min="0" placeholder="Price" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <label className="space-y-1 text-sm">
          <span className="text-cyan-100">Currency</span>
          <select name="currency" value={form.currency} onChange={onChange} className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-white">
            <option value="USD">USD</option>
            <option value="LKR">LKR</option>
          </select>
        </label>
        <input name="rating" value={form.rating} onChange={onChange} type="number" min="1" max="5" placeholder="Rating" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <input name="image" value={form.image} onChange={onChange} placeholder="Image URL" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white md:col-span-2" />
        <input type="file" accept="image/*" onChange={onFileChange} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white md:col-span-2" />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows="3" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white md:col-span-2" />
        <label className="md:col-span-2">
          <span className="text-sm text-cyan-100">Highlights (one per line)</span>
          <textarea name="highlights" value={form.highlights} onChange={onChange} placeholder="One feature per line" rows="3" className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        </label>
        <button disabled={actionLoading} className="btn-primary md:col-span-2" type="submit">
          {editingId ? 'Update Tour' : 'Add Tour'}
        </button>
      </form>

      {message ? <p className="text-sm text-cyan-200">{message}</p> : null}

      <div className="space-y-3">
        {data.map((tour) => (
          <article key={tour.id} className="rounded-2xl bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-white">{tour.title}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => onEdit(tour)} className="btn-secondary px-3 py-1 text-xs">Edit</button>
                <button type="button" onClick={() => onDelete(tour.id)} className="rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white">Delete</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-cyan-100/80">{tour.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
