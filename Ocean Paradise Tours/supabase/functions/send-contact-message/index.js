import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import nodemailer from 'npm:nodemailer'

const defaultSubject = 'New contact message from Ocean Paradise Tours'

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildContactEmail(contact) {
  const lines = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    contact.phone ? `Phone: ${contact.phone}` : '',
    contact.source ? `Source: ${contact.source}` : '',
    '',
    'Message:',
    contact.message,
  ].filter(Boolean)

  return lines.join('\n')
}

serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const gmailUser = Deno.env.get('GMAIL_USER')
  const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD')
  const fromName = Deno.env.get('GMAIL_FROM_NAME') || 'Ocean Paradise Tours'

  if (!gmailUser || !gmailAppPassword) {
    return json(
      {
        error: 'Gmail credentials are not configured yet. Set GMAIL_USER and GMAIL_APP_PASSWORD as function secrets.',
      },
      503,
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const contact = body?.contact
  if (!contact?.email || !contact?.name || !contact?.message) {
    return json({ error: 'Invalid contact payload.' }, 400)
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    await transporter.sendMail({
      from: `"${fromName}" <${gmailUser}>`,
      to: gmailUser,
      replyTo: contact.email,
      subject: `${defaultSubject}: ${contact.name}`,
      text: buildContactEmail(contact),
    })

    return json({ sent: true })
  } catch (error) {
    return json({ sent: false, error: error?.message ?? String(error) }, 500)
  }
})