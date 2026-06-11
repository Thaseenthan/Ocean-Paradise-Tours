import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '../utils/formatters.js'
import BookingForm from './BookingForm.jsx'

export default function TourModal({ tour, onClose }) {
  const [showBooking, setShowBooking] = useState(false)

  if (!tour) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition"
          >
            ✕
          </button>

          {/* Image */}
          <div className="relative h-56 w-full overflow-hidden rounded-t-3xl sm:h-72">
            <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="rounded-full bg-cyan-200/20 px-3 py-1 text-xs font-medium text-cyan-100">
                ⭐ {tour.rating ?? 5}
              </span>
            </div>
          </div>

          {!showBooking ? (
            /* Step 1: Full Tour Details */
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{tour.title}</h2>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/10 px-4 py-3 text-cyan-100">
                  <span className="block text-xs text-cyan-100/60">Duration</span>
                  {tour.duration}
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3 text-cyan-100">
                  <span className="block text-xs text-cyan-100/60">Price</span>
                  {formatCurrency(tour.price, tour.currency)}
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-cyan-100/80">{tour.description}</p>

              {tour.highlights && tour.highlights.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-white">Highlights</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-cyan-100/80">
                    {tour.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 text-cyan-400">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowBooking(true)}
                  className="btn-primary flex-1 py-3 text-center"
                >
                  Book Now
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1 py-3 text-center"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Booking Form */
            <div className="p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Book: {tour.title}</h2>
                  <p className="mt-1 text-sm text-cyan-100/60">Fill in your details to reserve this experience.</p>
                </div>
                <button
                  onClick={() => setShowBooking(false)}
                  className="text-sm text-cyan-100/70 hover:text-cyan-100 transition"
                >
                  ← Back to details
                </button>
              </div>
              <BookingForm tours={[tour]} selectedTourId={String(tour.id)} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}