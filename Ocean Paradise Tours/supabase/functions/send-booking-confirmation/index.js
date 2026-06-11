import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import nodemailer from 'npm:nodemailer'

const defaultSubject = 'Your Ocean Paradise Tours booking request'
const defaultAdminSubject = 'New booking received - Ocean Paradise Tours'

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildEmailBody(booking) {
  const tourName = booking.tour_title || 'your selected tour'
  const emailLines = [
    `Hi ${booking.customer_name},`,
    '',
    'Thank you for booking with Ocean Paradise Tours.',
    `We have received your request for ${tourName} on ${booking.booking_date}.`,
    '',
    `Guests: ${booking.people_count}`,
    `Phone: ${booking.phone}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
    '',
    'Our team will review your booking and contact you soon with the next steps.',
    '',
    'Warm regards,',
    'Ocean Paradise Tours',
  ].filter(Boolean)

  return emailLines.join('\n')
}

function buildAdminEmailBody(booking) {
  const tourName = booking.tour_title || 'your selected tour'
  const adminLines = [
    'A new booking has been received.',
    '',
    `Customer: ${booking.customer_name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Tour: ${tourName}`,
    `Date: ${booking.booking_date}`,
    `People: ${booking.people_count}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
    '',
    'Please review this booking in the admin dashboard.',
  ].filter(Boolean)

  return adminLines.join('\n')
}

serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const gmailUser = Deno.env.get('GMAIL_USER')
  const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD')
  const fromName = Deno.env.get('GMAIL_FROM_NAME') || 'Ocean Paradise Tours'
  const adminEmail = Deno.env.get('BOOKING_NOTIFICATION_EMAIL') || gmailUser

  if (!gmailUser || !gmailAppPassword) {
    return json(
      {
        error: 'Gmail credentials are not configured yet. Set GMAIL_USER and GMAIL_APP_PASSWORD as function secrets.',
      },
      503,
    )
  }

  const { booking } = await request.json()

  if (!booking?.email || !booking?.customer_name) {
    return json({ error: 'Invalid booking payload.' }, 400)
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  await transporter.sendMail({
    from: `"${fromName}" <${gmailUser}>`,
    to: booking.email,
    subject: defaultSubject,
    text: buildEmailBody(booking),
  })

  if (adminEmail) {
    await transporter.sendMail({
      from: `"${fromName}" <${gmailUser}>`,
      to: adminEmail,
      replyTo: booking.email,
      subject: defaultAdminSubject,
      text: buildAdminEmailBody(booking),
    })
  }

  return json({ sent: true, notifiedAdmin: Boolean(adminEmail) })
})