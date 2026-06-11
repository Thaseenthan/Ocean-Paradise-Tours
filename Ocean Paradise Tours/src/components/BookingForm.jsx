import { useMemo, useState } from 'react'
import { createBooking } from '../services/bookingService.js'
import { TOUR_OPTIONS_FALLBACK } from '../utils/constants.js'

const initialForm = {
  customer_name: '',
  email: '',
  phone: '',
  tour_id: '',
  booking_date: '',
  people_count: 1,
  notes: '',
}

function normalizeWhatsAppPhone(phone) {
  return String(phone || '').replace(/[^\d]/g, '')
}

function buildWhatsAppMessage(booking, tourTitle) {
  const lines = [
    'Hello, I have a new tour booking:',
    `Name: ${booking.customer_name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Tour: ${tourTitle || 'Selected tour'}`,
    `Date: ${booking.booking_date}`,
    `Guests: ${booking.people_count}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
  ].filter(Boolean)

  return lines.join('\n')
}

export default function BookingForm({ tours, selectedTourId = '' }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    tour_id: selectedTourId ? String(selectedTourId) : '',
  }))
  const [status, setStatus] = useState({ loading: false, message: '', error: '' })

  const options = useMemo(() => {
    if (tours?.length) return tours
    return TOUR_OPTIONS_FALLBACK.map((title, idx) => ({ id: idx + 1, title }))
  }, [tours])

  const isTourLocked = Boolean(selectedTourId)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, message: '', error: '' })
    const whatsappWindow = window.open('', '_blank', 'noopener,noreferrer')

    const selectedTour = options.find((item) => String(item.id) === String(form.tour_id))

    try {
      const result = await createBooking({
        ...form,
        status: 'pending',
        tour_title: selectedTour?.title ?? '',
      })

      if (result?.adminWhatsappPhone) {
        const whatsappPhone = normalizeWhatsAppPhone(result.adminWhatsappPhone)
        if (whatsappPhone) {
          const whatsappMessage = buildWhatsAppMessage(form, selectedTour?.title ?? '')
          const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
          if (whatsappWindow) {
            whatsappWindow.location.href = whatsappUrl
          } else {
            window.location.href = whatsappUrl
          }
        }
      }

      setForm({ ...initialForm, tour_id: selectedTourId ? String(selectedTourId) : '' })
      if (result?.emailSent === false) {
        setStatus({
          loading: false,
          message: 'Booking submitted. WhatsApp opened for the admin message.',
          error: result.emailError || 'Check Gmail secrets and deployed function status.',
        })
      } else {
        setStatus({ loading: false, message: 'Booking submitted. WhatsApp opened for the admin message.', error: '' })
      }
    } catch (error) {
      setStatus({ loading: false, message: '', error: error.message || 'Could not submit booking.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card grid gap-4 p-6 sm:grid-cols-2" aria-label="Booking form">
      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Customer Name</span>
        <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Email</span>
        <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Phone</span>
        <input name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Tour Selection</span>
        <select
          name="tour_id"
          value={form.tour_id}
          onChange={handleChange}
          required
          disabled={isTourLocked}
          className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-90"
        >
          <option value="">Select a tour</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
        {isTourLocked ? <p className="text-xs text-cyan-100/70">This tour is preselected from the tour card.</p> : null}
      </label>

      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Date</span>
        <input type="date" name="booking_date" value={form.booking_date} onChange={handleChange} required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <label className="space-y-1 text-sm sm:col-span-1">
        <span className="text-cyan-100">Number of People</span>
        <input type="number" min="1" name="people_count" value={form.people_count} onChange={handleChange} required className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <label className="space-y-1 text-sm sm:col-span-2">
        <span className="text-cyan-100">Notes</span>
        <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
      </label>

      <div className="sm:col-span-2">
        <button disabled={status.loading} className="btn-primary w-full" type="submit">
          {status.loading ? 'Submitting...' : 'Book Via WhatsApp'}
        </button>
      </div>

      {status.message ? <p className="sm:col-span-2 text-sm text-emerald-300">{status.message}</p> : null}
      {status.error ? <p className="sm:col-span-2 text-sm text-red-300">{status.error}</p> : null}
    </form>
  )
}
