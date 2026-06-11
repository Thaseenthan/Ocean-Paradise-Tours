import LoadingSpinner from '../components/LoadingSpinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { deleteBooking, getBookings } from '../services/bookingService.js'
import { formatDate } from '../utils/formatters.js'

export default function BookingsManagerPage() {
  const { data, loading, error, setData } = useFetch(getBookings, [])

  async function onDelete(id) {
    await deleteBooking(id)
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Booking Management</h2>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-cyan-100/70">
              <th className="p-2">Customer</th>
              <th className="p-2">Tour</th>
              <th className="p-2">Date</th>
              <th className="p-2">People</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-white/10 text-cyan-100/90">
                <td className="p-2">{row.customer_name}</td>
                <td className="p-2">{row.tours?.title}</td>
                <td className="p-2">{formatDate(row.booking_date)}</td>
                <td className="p-2">{row.people_count}</td>
                <td className="p-2">
                  <button onClick={() => onDelete(row.id)} type="button" className="rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
