import GalleryGrid from '../components/GalleryGrid.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SeoHead from '../components/SeoHead.jsx'
import useFetch from '../hooks/useFetch.js'
import { getGalleryImages } from '../services/galleryService.js'

export default function GalleryPage() {
  const { data, loading, error } = useFetch(getGalleryImages, [])

  return (
    <section className="container-shell py-32">
      <SeoHead
        title="Ocean Paradise Tours | Gallery"
        description="View breathtaking tropical moments captured from our premium water sports and tours."
      />

      <h1 className="section-title">Island Gallery</h1>
      <p className="section-subtitle mt-2">A visual diary of reef dives, dolphin encounters, and golden sunsets.</p>

      <div className="mt-8">
        {loading ? <LoadingSpinner /> : <GalleryGrid images={data} />}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>
    </section>
  )
}
