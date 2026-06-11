import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { addTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../services/testimonialService.js'

const initial = { name: '', message: '', rating: 5 }

export default function TestimonialsManagerPage() {
  const { data, loading, setData } = useFetch(getTestimonials, [])
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()

    if (editingId) {
      const updated = await updateTestimonial(editingId, { ...form, rating: Number(form.rating) })
      setData((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
      setEditingId(null)
    } else {
      const created = await addTestimonial({ ...form, rating: Number(form.rating) })
      setData((prev) => [created, ...prev])
    }

    setForm(initial)
  }

  function onEdit(item) {
    setEditingId(item.id)
    setForm({ name: item.name, message: item.message, rating: item.rating })
  }

  async function onDelete(id) {
    await deleteTestimonial(id)
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Testimonials Management</h2>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white/5 p-4">
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <textarea name="message" value={form.message} onChange={onChange} placeholder="Message" required rows="3" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={onChange} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Testimonial</button>
      </form>

      <div className="mt-5 space-y-3">
        {data.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white/5 p-4">
            <p className="font-semibold text-white">{item.name} ({item.rating}⭐)</p>
            <p className="mt-1 text-sm text-cyan-100/85">{item.message}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onEdit(item)} type="button" className="btn-secondary px-3 py-1 text-xs">Edit</button>
              <button onClick={() => onDelete(item.id)} type="button" className="rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
