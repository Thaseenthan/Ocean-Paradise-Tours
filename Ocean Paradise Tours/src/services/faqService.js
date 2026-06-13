import { supabase } from '../supabase/client.js'
import { TABLES } from '../supabase/queries.js'

const demoFaqs = [
  { id: 1, question: 'What is the best time to visit?', answer: 'Year-round is great, but dry season (May-September) offers the calmest waters.' },
  { id: 2, question: 'Do I need diving certification?', answer: 'For snorkeling tours, no certification needed. Scuba requires valid PADI certification.' },
  { id: 3, question: 'What should I bring?', answer: 'Bring sunscreen, towel, water, and a waterproof camera for photos.' },
]

export async function getFaqs() {
  if (!supabase) return demoFaqs
  try {
    const { data, error } = await supabase.from(TABLES.faq).select('*').order('id')
    if (error) throw error
    return data || demoFaqs
  } catch {
    return demoFaqs
  }
}

export async function addFaq(payload) {
  if (!supabase) return { ...payload, id: Date.now() }
  try {
    const { data, error } = await supabase.from(TABLES.faq).insert(payload).select().single()
    if (error) throw error
    return data
  } catch {
    return { ...payload, id: Date.now() }
  }
}

export async function updateFaq(id, payload) {
  if (!supabase) return { ...payload, id }
  try {
    const { data, error } = await supabase
      .from(TABLES.faq)
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

export async function deleteFaq(id) {
  if (!supabase) return
  try {
    const { error } = await supabase.from(TABLES.faq).delete().eq('id', id)
    if (error) throw error
  } catch {
    // Silent fail in demo mode
  }
}
