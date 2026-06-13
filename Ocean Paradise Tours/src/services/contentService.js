import { supabase } from '../supabase/client.js'
import { TABLES } from '../supabase/queries.js'

export const DEFAULT_CONTACT_DETAILS = {
  email: 'hello@oceanparadisetours.com',
  phone: '+94 76 555 8899',
  whatsapp: '+94 76 555 8899',
  adminWhatsappPhone: '+94 76 555 8899',
  heroBackgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
  intro: 'We usually respond within one business day.',
  mapUrl: 'https://maps.google.com/maps?q=trincomalee%20beach&t=&z=13&ie=UTF8&iwloc=&output=embed',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
}

export const DEFAULT_HERO_CONTENT = {
  title: 'Sail Into Paradise',
  subtitle: 'Discover crystal waters, world-class marine adventures, and luxury island escapes curated by local experts.',
  backgroundImage: DEFAULT_CONTACT_DETAILS.heroBackgroundImage,
}

export const DEFAULT_ABOUT_CONTENT =
  'Ocean Paradise Tours began as a family-run coastal operation and has grown into a premium tropical travel brand trusted by guests worldwide. We blend local island knowledge with luxury service standards to deliver safe, memorable marine adventures.'

function parseContactDetails(content) {
  if (!content) return DEFAULT_CONTACT_DETAILS

  try {
    const parsed = JSON.parse(content)
    return { ...DEFAULT_CONTACT_DETAILS, ...parsed }
  } catch {
    return { ...DEFAULT_CONTACT_DETAILS, intro: content }
  }
}

function parseHeroContent(content) {
  if (!content) return DEFAULT_HERO_CONTENT

  try {
    const parsed = JSON.parse(content)
    return { ...DEFAULT_HERO_CONTENT, ...parsed }
  } catch {
    return { ...DEFAULT_HERO_CONTENT, subtitle: content }
  }
}

function parseTextContent(content, fallback) {
  return content || fallback
}

export async function getWebsiteContent() {
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from(TABLES.websiteContent).select('*')
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function upsertWebsiteContent(sectionName, content) {
  if (!supabase) return { section_name: sectionName, content }
  try {
    const payload = { section_name: sectionName, content }
    const { data, error } = await supabase
      .from(TABLES.websiteContent)
      .upsert(payload, { onConflict: 'section_name' })
      .select()
      .single()
    if (error) throw error
    return data
  } catch {
    return { section_name: sectionName, content }
  }
}

export async function getContactDetails() {
  const rows = await getWebsiteContent()
  const contactRow = rows.find((row) => row.section_name === 'contact')
  return parseContactDetails(contactRow?.content)
}

export async function getHeroContent() {
  const rows = await getWebsiteContent()
  const heroRow = rows.find((row) => row.section_name === 'hero')
  return parseHeroContent(heroRow?.content)
}

export async function getAboutContent() {
  const rows = await getWebsiteContent()
  const aboutRow = rows.find((row) => row.section_name === 'about')
  return parseTextContent(aboutRow?.content, DEFAULT_ABOUT_CONTENT)
}

export async function upsertContactDetails(details) {
  return upsertWebsiteContent('contact', JSON.stringify({ ...DEFAULT_CONTACT_DETAILS, ...details }))
}

export async function upsertHeroContent(details) {
  return upsertWebsiteContent('hero', JSON.stringify({ ...DEFAULT_HERO_CONTENT, ...details }))
}

export async function upsertAboutContent(content) {
  return upsertWebsiteContent('about', content)
}
