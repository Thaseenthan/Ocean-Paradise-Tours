import { Outlet } from 'react-router-dom'
import AdminNavbar from '../admin/components/AdminNavbar.jsx'
import AdminSidebar from '../admin/components/AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="container-shell py-24">
      <AdminNavbar />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <section className="glass-card p-5">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
