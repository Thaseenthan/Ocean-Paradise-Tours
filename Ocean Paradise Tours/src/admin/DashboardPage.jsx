import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { getDashboardStats } from '../services/adminService.js'
import { formatDate } from '../utils/formatters.js'

export default function DashboardPage() {
  const { data, loading, error } = useFetch(getDashboardStats, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />

  if (error) return <p className="text-sm text-red-300">{error}</p>

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs uppercase text-cyan-100/70">Total Bookings</p>
          <p className="mt-2 text-2xl font-semibold text-white">{data.totalBookings}</p>
        </article>
        <article className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs uppercase text-cyan-100/70">Total Tours</p>
          <p className="mt-2 text-2xl font-semibold text-white">{data.totalTours}</p>
        </article>
        <article className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs uppercase text-cyan-100/70">Gallery Images</p>
          <p className="mt-2 text-2xl font-semibold text-white">{data.totalGallery}</p>
        </article>
      </div>

      <h3 className="mt-8 text-lg font-semibold text-white">Recent Bookings</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-cyan-100/70">
              <th className="p-2">Customer</th>
              <th className="p-2">Tour</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentBookings.map((row) => (
              <tr key={row.id} className="border-t border-white/10 text-cyan-100/90">
                <td className="p-2">{row.customer_name}</td>
                <td className="p-2">{row.tours?.title}</td>
                <td className="p-2">{formatDate(row.booking_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
