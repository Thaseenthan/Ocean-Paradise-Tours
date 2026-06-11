import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContactDetails } from '../services/contentService.js'

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ])

  useEffect(() => {
    getContactDetails().then((details) => {
      const links = []
      if (details.instagram) links.push({ label: 'Instagram', href: details.instagram })
      if (details.facebook) links.push({ label: 'Facebook', href: details.facebook })
      if (details.youtube) links.push({ label: 'YouTube', href: details.youtube })
      if (links.length > 0) setSocialLinks(links)
    })
  }, [])

  return (
    <footer className="mt-24 border-t border-cyan-100/20 bg-slate-950/40">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">Ocean Paradise Tours</p>
          <p className="mt-3 text-sm text-cyan-100/75">
            Premium tropical adventures, curated with safety, elegance, and unforgettable ocean moments.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-100/80">
            <li><Link to="/tours" className="hover:text-white">Tours</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/booking" className="hover:text-white">Booking</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Social</p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-100/80">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" className="hover:text-white">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cyan-100/10 py-4 text-center text-xs text-cyan-100/70">
        © {new Date().getFullYear()} Ocean Paradise Tours. All rights reserved.
      </div>
    </footer>
  )
}