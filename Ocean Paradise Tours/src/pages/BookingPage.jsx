import BookingForm from '../components/BookingForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SeoHead from '../components/SeoHead.jsx'
import useFetch from '../hooks/useFetch.js'
import { getTours } from '../services/tourService.js'
import { useSearchParams } from 'react-router-dom'

export default function BookingPage() {
  const { data, loading } = useFetch(getTours, [])
  const [searchParams] = useSearchParams()
  const selectedTourId = searchParams.get('tour_id') || ''

  return (
    <section className="container-shell py-32">
      <SeoHead
        title="Ocean Paradise Tours | Book Your Adventure"
        description="Reserve your premium ocean experience with our secure online booking form."
      />

      <h1 className="section-title">Book Your Adventure</h1>
      <p className="section-subtitle mt-2">Fill in your details and our team will confirm your reservation quickly.</p>

      <div className="mt-8">
        {loading ? <LoadingSpinner /> : <BookingForm tours={data} selectedTourId={selectedTourId} />}
      </div>
    </section>
  )
}
