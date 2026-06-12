import { supabase } from '../supabase/client.js'

export async function sendContactMessage(contact) {
  if (!supabase) {
    return { sent: false, error: 'Supabase is not configured.' }
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-contact-message', {
      body: { contact },
    })

    if (error) throw error
    return data ?? { sent: true }
  } catch (error) {
    return { sent: false, error: error?.message || 'Could not send your message.' }
  }
}