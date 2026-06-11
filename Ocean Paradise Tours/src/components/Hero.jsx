import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero({ title, subtitle, backgroundImage }) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28">
      <img
        src={backgroundImage}
        alt="Tropical beach"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-cyan-950/50 to-slate-950/90" />

      <div className="container-shell relative flex min-h-[78vh] items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-card max-w-2xl p-8 sm:p-10"
        >
          <p className="mb-3 inline-flex rounded-full bg-cyan-200/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Luxury Tropical Experiences
          </p>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">{title}</h1>
          <p className="mt-5 text-base text-cyan-100/85 sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/booking" className="btn-primary">Book Now</Link>
            <Link to="/tours" className="btn-secondary">Explore Tours</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
