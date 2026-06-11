import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../utils/constants.js'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-shell py-4">
        <nav className="glass-card flex items-center justify-between px-4 py-3 sm:px-6" aria-label="Main navigation">
          <Link to="/" className="font-display text-xl text-white">Ocean Paradise Tours</Link>

          <button
            type="button"
            className="rounded-xl border border-cyan-100/40 p-2 text-cyan-50 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="mt-1 block h-0.5 w-6 bg-current" />
            <span className="mt-1 block h-0.5 w-6 bg-current" />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-cyan-200/20 text-white' : 'text-cyan-100/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/booking" className="btn-primary ml-2 px-4 py-2 text-sm">Book Now</Link>
            </li>
          </ul>
        </nav>

        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-2 p-3 md:hidden"
          >
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-cyan-50 hover:bg-white/10"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </div>
    </header>
  )
}
