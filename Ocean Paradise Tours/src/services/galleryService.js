import { supabase } from '../supabase/client.js'
import { BUCKETS, TABLES } from '../supabase/queries.js'

const demoGallery = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60', caption: 'Whale breaching at sunset' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=500&q=60', caption: 'Vibrant coral reef' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=60', caption: 'Tropical sunset' },
]

export async function getGalleryImages() {
  if (!supabase) return demoGallery
  try {
    const { data, error } = await supabase.from(TABLES.gallery).select('*').order('id', { ascending: false })
    if (error) throw error
    return data || demoGallery
  } catch {
    return demoGallery
  }
}

export async function addGalleryImage(payload) {
  if (!supabase) return { ...payload, id: Date.now() }
  try {
    const { data, error } = await supabase.from(TABLES.gallery).insert(payload).select().single()
    if (error) throw error
    return data
  } catch {
    return { ...payload, id: Date.now() }
  }
}

export async function deleteGalleryImage(id) {
  if (!supabase) return
  try {
    // First, retrieve the row to find the storage path for the image
    const { data: row, error: fetchErr } = await supabase.from(TABLES.gallery).select('image_url').eq('id', id).single()
    if (fetchErr) throw fetchErr

    // Attempt to delete the file from storage if we can extract a path
    try {
      const imageUrl = row?.image_url || ''
      if (imageUrl) {
        // Supabase public storage URLs typically contain '/storage/v1/object/public/<bucket>/<path>'
        // We look for the bucket name in the URL and take the remainder as the object path.
        const bucketName = BUCKETS.gallery
        const parts = imageUrl.split(`/${bucketName}/`)
        if (parts.length > 1) {
          const objectPath = parts[1].split('?')[0]
          const { error: storageErr } = await supabase.storage.from(bucketName).remove([objectPath])
          if (storageErr) {
            // Log but do not prevent DB deletion
            // eslint-disable-next-line no-console
            console.warn('Failed to remove storage object:', storageErr.message)
          }
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error deleting storage object for gallery image:', err?.message || err)
    }

    const { error } = await supabase.from(TABLES.gallery).delete().eq('id', id)
    if (error) throw error
  } catch {
    // Silent fail in demo mode
  }
}

export async function uploadGalleryImage(file) {
  if (!supabase) {
    return URL.createObjectURL(file)
  }
  try {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `gallery/${fileName}`
    const { error } = await supabase.storage.from(BUCKETS.gallery).upload(path, file, {
      upsert: true,
    })
    if (error) throw error
    const { data } = supabase.storage.from(BUCKETS.gallery).getPublicUrl(path)
    return data.publicUrl
  } catch {
    return URL.createObjectURL(file)
  }
}
