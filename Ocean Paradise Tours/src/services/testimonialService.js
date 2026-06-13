import { supabase } from '../supabase/client.js'
import { TABLES } from '../supabase/queries.js'

const demoTestimonials = [
  { id: 1, name: 'Sarah Johnson', message: 'Best experience of my life! The crew was professional and the views were breathtaking.', rating: 5 },
  { id: 2, name: 'Michael Chen', message: 'Incredible adventure. Saw dolphins up close and the sunset was unforgettable.', rating: 5 },
  { id: 3, name: 'Emma Williams', message: 'Worth every penny. Safety briefing was thorough and everyone felt secure.', rating: 5 },
]

export async function getTestimonials() {
  if (!supabase) return demoTestimonials
  try {
    const { data, error } = await supabase.from(TABLES.testimonials).select('*').order('id', { ascending: false })
    if (error) throw error
    return data || demoTestimonials
  } catch {
    return demoTestimonials
  }
}

export async function addTestimonial(payload) {
  if (!supabase) return { ...payload, id: Date.now() }
  try {
    const { data, error } = await supabase.from(TABLES.testimonials).insert(payload).select().single()
    if (error) throw error
    return data
  } catch {
    return { ...payload, id: Date.now() }
  }
}

export async function updateTestimonial(id, payload) {
  if (!supabase) return { ...payload, id }
  try {
    const { data, error } = await supabase
      .from(TABLES.testimonials)
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  } catch {
    return { ...payload, id }
  }
}

export async function deleteTestimonial(id) {
  if (!supabase) return
  try {
    const { error } = await supabase.from(TABLES.testimonials).delete().eq('id', id)
    if (error) throw error
  } catch {
    // Silent fail in demo mode
  }
}
