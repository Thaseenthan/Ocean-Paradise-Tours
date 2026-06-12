import { useEffect, useState } from 'react'
import ContactForm from '../components/ContactForm.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { SOCIAL_LINKS } from '../utils/constants.js'
import { DEFAULT_CONTACT_DETAILS, getContactDetails } from '../services/contentService.js'

function normalizeWhatsAppPhone(phone) {
  return String(phone || '').replace(/[^\d]/g, '')
}

export default function ContactPage() {
  const [contactDetails, setContactDetails] = useState(DEFAULT_CONTACT_DETAILS)

  useEffect(() => {
    let mounted = true

    async function load() {
      const details = await getContactDetails()
      if (mounted) setContactDetails(details)
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="container-shell py-32">
      <SeoHead
        title="Ocean Paradise Tours | Contact"
        description="Contact Ocean Paradise Tours via form, phone, email, social media, map, or WhatsApp."
      />

      <h1 className="section-title">Contact Us</h1>
      <p className="section-subtitle mt-2">We usually respond within one business day.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="glass-card grid gap-4 p-6">
          <ContactForm source="Contact page" />
        </article>

        <div className="space-y-4">
          <article className="glass-card p-5 text-sm text-cyan-100/85">
            <p>Email: {contactDetails.email}</p>
            <p className="mt-2">Phone: {contactDetails.phone}</p>
            <p className="mt-2">WhatsApp: {contactDetails.whatsapp}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${normalizeWhatsAppPhone(contactDetails.adminWhatsappPhone)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp px-4 py-2 text-xs"
              >
                WhatsApp Us
              </a>
              {SOCIAL_LINKS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-2 text-xs">
                  {social.label}
                </a>
              ))}
            </div>
          </article>

          <iframe
            title="Ocean Paradise Location"
            className="h-72 w-full rounded-3xl border border-white/20"
            loading="lazy"
            src={contactDetails.mapUrl}
          />
        </div>
      </div>

      <a
        href={`https://wa.me/${normalizeWhatsAppPhone(contactDetails.adminWhatsappPhone)}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-xl"
      >
        WhatsApp Us
      </a>
    </section>
  )
}
