import { useMemo, useState } from 'react'
import SeoHead from '../components/SeoHead.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import TourCard from '../components/TourCard.jsx'
import TourModal from '../components/TourModal.jsx'
import useFetch from '../hooks/useFetch.js'
import { getTours } from '../services/tourService.js'

const keywordOptions = [
  { label: 'All Tours', value: '' },
  { label: 'Whale', value: 'whale' },
  { label: 'Dolphin', value: 'dolphin' },
  { label: 'Snorkeling', value: 'snorkel' },
  { label: 'Diving', value: 'diving' },
  { label: 'Fishing', value: 'fishing' },
  { label: 'Sunset', value: 'sunset' },
]

export default function ToursPage() {
  const { data, loading, error } = useFetch(getTours, [])
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const [selectedTour, setSelectedTour] = useState(null)

  const filteredTours = useMemo(() => {
    return data.filter((tour) => {
      const haystack = [tour.title, tour.description, tour.duration, ...(tour.highlights || [])].join(' ').toLowerCase()
      const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase())
      const matchesKeyword = !keyword || haystack.includes(keyword)
      return matchesSearch && matchesKeyword
    })
  }, [data, keyword, search])

  return (
    <section className="container-shell py-32">
      <SeoHead
        title="Ocean Paradise Tours | Explore Tours"
        description="Browse whale watching, dolphin watching, snorkeling, diving, deep sea fishing, and sunset boat tours."
      />

      <h1 className="section-title">Our Tours</h1>
      <p className="section-subtitle mt-2">Every package is crafted for beauty, safety, and unforgettable marine encounters.</p>

      <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="block">
          <span className="sr-only">Search tours</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by tour name, description, or activity..."
            className="w-full rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white placeholder:text-cyan-100/45"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {keywordOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setKeyword(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${keyword === option.value ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-cyan-100 hover:bg-white/15'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} onSeeDetails={setSelectedTour} />
        ))}
      </div>

      {selectedTour && (
        <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </section>
  )
}
