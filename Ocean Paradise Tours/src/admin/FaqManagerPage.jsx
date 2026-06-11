import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { addFaq, deleteFaq, getFaqs, updateFaq } from '../services/faqService.js'

const initial = { question: '', answer: '' }

export default function FaqManagerPage() {
  const { data, loading, setData } = useFetch(getFaqs, [])
  const [form, setForm] = useState(initial)
  const [editingId, setEditingId] = useState(null)

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()

    if (editingId) {
      const updated = await updateFaq(editingId, form)
      setData((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
      setEditingId(null)
    } else {
      const created = await addFaq(form)
      setData((prev) => [...prev, created])
    }

    setForm(initial)
  }

  function onEdit(item) {
    setEditingId(item.id)
    setForm({ question: item.question, answer: item.answer })
  }

  async function onDelete(id) {
    await deleteFaq(id)
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">FAQ Management</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl bg-white/5 p-4">
        <input name="question" value={form.question} onChange={onChange} placeholder="Question" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
        <textarea name="answer" value={form.answer} onChange={onChange} placeholder="Answer" required className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" rows="3" />
        <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Add'} FAQ</button>
      </form>

      <div className="mt-5 space-y-3">
        {data.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white/5 p-4">
            <p className="font-semibold text-white">{item.question}</p>
            <p className="mt-1 text-sm text-cyan-100/85">{item.answer}</p>
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
