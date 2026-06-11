import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import {
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_HERO_CONTENT,
  getAboutContent,
  getContactDetails,
  getHeroContent,
  upsertContactDetails,
  upsertAboutContent,
  upsertHeroContent,
} from '../services/contentService.js'

export default function ContentManagerPage() {
  const [loading, setLoading] = useState(true)
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO_CONTENT)
  const [aboutContent, setAboutContent] = useState('')
  const [contactDetails, setContactDetails] = useState(DEFAULT_CONTACT_DETAILS)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setHeroContent(await getHeroContent())
      setAboutContent(await getAboutContent())
      setContactDetails(await getContactDetails())
      setLoading(false)
    }

    load()
  }, [])

  async function onSaveHero() {
    await upsertHeroContent(heroContent)
    setMessage('hero content updated.')
  }

  async function onSaveAbout() {
    await upsertAboutContent(aboutContent)
    setMessage('about content updated.')
  }

  async function onSaveContact() {
    await upsertContactDetails(contactDetails)
    setMessage('contact details updated.')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Content Editor</h2>
      <p className="mt-2 text-sm text-cyan-100/70">
        Update the home page hero, about section, and contact details from one place.
      </p>

      <div className="mt-5 space-y-4">
        <article className="rounded-2xl bg-white/5 p-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100/80">hero</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-cyan-100 md:col-span-2">
              <span>Hero Title</span>
              <input
                value={heroContent.title}
                onChange={(event) => setHeroContent((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-1 text-sm text-cyan-100 md:col-span-2">
              <span>Hero Subtitle</span>
              <textarea
                value={heroContent.subtitle}
                onChange={(event) => setHeroContent((prev) => ({ ...prev, subtitle: event.target.value }))}
                rows="4"
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-1 text-sm text-cyan-100 md:col-span-2">
              <span>Background Image URL</span>
              <input
                value={heroContent.backgroundImage}
                onChange={(event) => setHeroContent((prev) => ({ ...prev, backgroundImage: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
              />
            </label>
          </div>
          <button className="btn-primary mt-3" type="button" onClick={onSaveHero}>
            Save hero
          </button>
        </article>

        <article className="rounded-2xl bg-white/5 p-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100/80">about</p>
          <textarea
            value={aboutContent}
            onChange={(event) => setAboutContent(event.target.value)}
            rows="7"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
          />
          <button className="btn-primary mt-3" type="button" onClick={onSaveAbout}>
            Save about
          </button>
        </article>
      </div>

      <article className="mt-5 rounded-2xl bg-white/5 p-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100/80">contact details</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Email</span>
            <input
              value={contactDetails.email}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Phone</span>
            <input
              value={contactDetails.phone}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>WhatsApp</span>
            <input
              value={contactDetails.whatsapp}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, whatsapp: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Admin WhatsApp (for booking notifications)</span>
            <input
              value={contactDetails.adminWhatsappPhone}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, adminWhatsappPhone: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100 md:col-span-2">
            <span>Home Hero Background Image</span>
            <input
              value={contactDetails.heroBackgroundImage}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, heroBackgroundImage: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Map URL</span>
            <input
              value={contactDetails.mapUrl}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, mapUrl: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100 md:col-span-2">
            <span>Intro Text</span>
            <textarea
              value={contactDetails.intro}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, intro: event.target.value }))}
              rows="4"
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Instagram URL</span>
            <input
              value={contactDetails.instagram}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, instagram: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>Facebook URL</span>
            <input
              value={contactDetails.facebook}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, facebook: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
          <label className="space-y-1 text-sm text-cyan-100">
            <span>YouTube URL</span>
            <input
              value={contactDetails.youtube}
              onChange={(event) => setContactDetails((prev) => ({ ...prev, youtube: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
            />
          </label>
        </div>
        <button className="btn-primary mt-3" type="button" onClick={onSaveContact}>
          Save contact details
        </button>
      </article>

      {message ? <p className="mt-3 text-sm text-cyan-100">{message}</p> : null}
    </div>
  )
}
