import { supabase } from '../supabase/client.js'
import { BUCKETS, TABLES } from '../supabase/queries.js'

const demoTours = [
  {
    id: 1,
    title: 'Whale Watching',
    description: 'Experience majestic whales in their natural habitat with expert guides.',
    price: 120,
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60',
    rating: 5,
  },
  {
    id: 2,
    title: 'Dolphin Watching',
    description: 'Swim and play with playful dolphins in crystal-clear tropical waters.',
    price: 95,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60',
    rating: 5,
  },
  {
    id: 3,
    title: 'Pigeon Island Snorkeling',
    description: 'Explore vibrant coral reefs teeming with tropical fish.',
    price: 75,
    duration: '2.5 hours',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
  },
  {
    id: 4,
    title: 'Scuba Diving',
    description: 'Deep dive adventure for certified divers exploring underwater wonders.',
    price: 150,
    duration: '5 hours',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
  },
  {
    id: 5,
    title: 'Deep Sea Fishing',
    description: 'Thrilling deep-sea fishing expedition with professional equipment and crew.',
    price: 180,
    duration: '6 hours',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
  },
  {
    id: 6,
    title: 'Sunset Boat Tour',
    description: 'Romantic evening cruise watching the sun dip into the horizon.',
    price: 85,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
  },
]

export async function getTours() {
  if (!supabase) return demoTours
  try {
    const { data, error } = await supabase.from(TABLES.tours).select('*').order('id')
    if (error) throw error
    return data || demoTours
  } catch {
    return demoTours
  }
}

export async function createTour(payload) {
  if (!supabase) return { ...payload, id: Date.now() }
  try {
    const { data, error } = await supabase.from(TABLES.tours).insert(payload).select().single()
    if (error) throw error
    return data
  } catch (err) {
    // If supabase is configured but request failed, surface the error to the caller
    if (!supabase) return { ...payload, id: Date.now() }
    throw err
  }
}

export async function updateTour(id, payload) {
  if (!supabase) return { ...payload, id }
  try {
    const { data, error } = await supabase
      .from(TABLES.tours)
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (err) {
    if (!supabase) return { ...payload, id }
    throw err
  }
}

export async function deleteTour(id) {
  if (!supabase) return
  try {
    const { error } = await supabase.from(TABLES.tours).delete().eq('id', id)
    if (error) throw error
  } catch {
    // Surface errors when supabase is configured
    if (!supabase) return
    throw new Error('Failed to delete tour')
  }
}

export async function uploadTourImage(file) {
  if (!supabase) {
    return URL.createObjectURL(file)
  }
  try {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `tours/${fileName}`
    const { error } = await supabase.storage.from(BUCKETS.tourImages).upload(path, file, {
      upsert: true,
    })
    if (error) throw error
    const { data } = supabase.storage.from(BUCKETS.tourImages).getPublicUrl(path)
    return data.publicUrl
  } catch {
    return URL.createObjectURL(file)
  }
}
