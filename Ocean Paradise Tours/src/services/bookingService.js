import { supabase } from '../supabase/client.js'
import { TABLES } from '../supabase/queries.js'
import { getContactDetails } from './contentService.js'

async function sendBookingConfirmationEmail(booking) {
  if (!supabase) return { sent: false }

  try {
    const contactDetails = await getContactDetails()
    const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
      body: { booking, adminWhatsappPhone: contactDetails.adminWhatsappPhone },
    })

    if (error) throw error
    return data ?? { sent: true }
  } catch (error) {
    return { sent: false, error: error?.message || 'Could not send confirmation email.' }
  }
}

export async function createBooking(payload) {
  const { tour_title: tourTitle, ...bookingPayload } = payload
  const contactDetails = await getContactDetails()

  if (!supabase) {
    return {
      ...bookingPayload,
      tour_title: tourTitle,
      adminWhatsappPhone: contactDetails.adminWhatsappPhone,
      id: Date.now(),
      created_at: new Date().toISOString(),
    }
  }

  try {
    const { data, error } = await supabase.from(TABLES.bookings).insert(bookingPayload).select().single()
    if (error) throw error

    const emailResult = await sendBookingConfirmationEmail({ ...data, tour_title: tourTitle })

    return {
      ...data,
      adminWhatsappPhone: contactDetails.adminWhatsappPhone,
      emailSent: Boolean(emailResult?.sent),
      emailError: emailResult?.error || '',
    }
  } catch {
    return {
      ...bookingPayload,
      tour_title: tourTitle,
      adminWhatsappPhone: contactDetails.adminWhatsappPhone,
      id: Date.now(),
      created_at: new Date().toISOString(),
    }
  }
}

export async function getBookings() {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from(TABLES.bookings)
      .select('*, tours(title)')
      .order('id', { ascending: false })
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function updateBookingStatus(id, status) {
  if (!supabase) return { id, status }
  try {
    const { data, error } = await supabase
      .from(TABLES.bookings)
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  } catch {
    return { id, status }
  }
}

export async function deleteBooking(id) {
  if (!supabase) return
  try {
    const { error } = await supabase.from(TABLES.bookings).delete().eq('id', id)
    if (error) throw error
  } catch {
    // Silent fail in demo mode
  }
}
