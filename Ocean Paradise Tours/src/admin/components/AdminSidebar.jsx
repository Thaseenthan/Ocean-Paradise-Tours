import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Tours', path: '/admin/tours' },
  { label: 'Gallery', path: '/admin/gallery' },
  { label: 'Bookings', path: '/admin/bookings' },
  { label: 'Testimonials', path: '/admin/testimonials' },
  { label: 'FAQ', path: '/admin/faq' },
  { label: 'Contact Editor', path: '/admin/content' },
  { label: 'Settings', path: '/admin/settings' },
]

export default function AdminSidebar() {
  return (
    <aside className="glass-card h-fit w-full p-3 lg:sticky lg:top-24">
      <p className="mb-3 px-3 text-sm font-semibold text-cyan-100">Admin Panel</p>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm transition ${
                  isActive ? 'bg-cyan-300/25 text-white' : 'text-cyan-100/80 hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
