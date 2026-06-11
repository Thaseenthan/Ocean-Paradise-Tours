import { useState } from 'react'
import { sendContactMessage } from '../services/contactService.js'

const initialForm = { name: '', email: '', message: '' }

export default function ContactForm({ source = 'Contact page' }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    const result = await sendContactMessage({ ...form, source })

    if (result?.sent) {
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Message sent. We will reply soon.' })
    } else {
      setStatus({ type: 'error', message: result?.error || 'Message could not be sent.' })
    }

    setLoading(false)
  }

  return (
    <form className="grid gap-4" aria-label={`${source} contact form`} onSubmit={handleSubmit}>
      <label className="space-y-1">
        <span className="text-cyan-100">Name</span>
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
          required
        />
      </label>
      <label className="space-y-1">
        <span className="text-cyan-100">Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
          required
        />
      </label>
      <label className="space-y-1">
        <span className="text-cyan-100">Message</span>
        <textarea
          rows="4"
          name="message"
          value={form.message}
          onChange={updateField}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
          required
        />
      </label>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      <p
        className={`text-sm ${status.type === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  )
}