import { motion } from 'framer-motion'
import { formatCurrency } from '../utils/formatters.js'

export default function TourCard({ tour, onSeeDetails }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="glass-card overflow-hidden"
    >
      <img src={tour.image} alt={tour.title} className="h-56 w-full object-cover" />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{tour.title}</h3>
          <span className="rounded-full bg-cyan-200/20 px-3 py-1 text-xs font-medium text-cyan-100">
            ⭐ {tour.rating ?? 5}
          </span>
        </div>
        {/* <p className="text-sm text-cyan-100/80">{tour.description}</p> */}

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/10 px-3 py-2 text-cyan-100">Duration: {tour.duration}</div>
          {/* <div className="rounded-xl bg-white/10 px-3 py-2 text-cyan-100">{formatCurrency(tour.price, tour.currency)}</div> */}
        </div>

        {/* <ul className="mt-4 space-y-1 text-xs text-cyan-100/80">
          {(tour.highlights && tour.highlights.length ? tour.highlights : [
            'Safety briefing and equipment',
            'Certified local guide',
            'Complimentary refreshments',
          ]).map((h, i) => (
            <li key={i}>• {h}</li>
          ))}
        </ul> */}

        <button onClick={() => onSeeDetails?.(tour)} className="btn-primary mt-5 w-full">
          See Full Details
        </button>
      </div>
    </motion.article>
  )
}
