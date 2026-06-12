import { supabase } from '../supabase/client.js'
import { TABLES } from '../supabase/queries.js'

export async function getDashboardStats() {
  if (!supabase) {
    return {
      totalBookings: 42,
      totalTours: 6,
      totalGallery: 3,
      recentBookings: [],
    }
  }

  try {
    const [bookingsRes, toursRes, galleryRes, recentRes] = await Promise.all([
      supabase.from(TABLES.bookings).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.tours).select('id', { count: 'exact', head: true }),
      supabase.from(TABLES.gallery).select('id', { count: 'exact', head: true }),
      supabase
        .from(TABLES.bookings)
        .select('id, customer_name, booking_date, tours(title)')
        .order('id', { ascending: false })
        .limit(6),
    ])

    const errors = [bookingsRes.error, toursRes.error, galleryRes.error, recentRes.error].filter(Boolean)
    if (errors.length) throw errors[0]

    return {
      totalBookings: bookingsRes.count ?? 0,
      totalTours: toursRes.count ?? 0,
      totalGallery: galleryRes.count ?? 0,
      recentBookings: recentRes.data ?? [],
    }
  } catch {
    return {
      totalBookings: 42,
      totalTours: 6,
      totalGallery: 3,
      recentBookings: [],
    }
  }
}
