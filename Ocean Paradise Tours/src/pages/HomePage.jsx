import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FAQAccordion from '../components/FAQAccordion.jsx'
import BookingForm from '../components/BookingForm.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import Hero from '../components/Hero.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SeoHead from '../components/SeoHead.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import TourCard from '../components/TourCard.jsx'
import TourModal from '../components/TourModal.jsx'
import ContactForm from '../components/ContactForm.jsx'
import useFetch from '../hooks/useFetch.js'
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_HERO_CONTENT,
  getAboutContent,
  getContactDetails,
  getHeroContent,
} from '../services/contentService.js'
import { getFaqs } from '../services/faqService.js'
import { getGalleryImages } from '../services/galleryService.js'
import { getTestimonials } from '../services/testimonialService.js'
import { getTours } from '../services/tourService.js'

function normalizeWhatsAppPhone(phone) {
  return String(phone || '').replace(/[^\d]/g, '')
}

export default function HomePage() {
  const [selectedTour, setSelectedTour] = useState(null)
  const toursState = useFetch(getTours, [])
  const testimonialsState = useFetch(getTestimonials, [])
  const faqState = useFetch(getFaqs, [])
  const galleryState = useFetch(getGalleryImages, [])
  const contactState = useFetch(getContactDetails, [], DEFAULT_CONTACT_DETAILS)
  const heroState = useFetch(getHeroContent, [], DEFAULT_HERO_CONTENT)
  const aboutState = useFetch(getAboutContent, [], DEFAULT_ABOUT_CONTENT)

  const featuredTours = toursState.data.slice(0, 3)
  const testimonials = testimonialsState.data.slice(0, 3)
  const galleryPreview = galleryState.data.slice(0, 6)

  return (
    <>
      <SeoHead
        title="Ocean Paradise Tours | Luxury Tropical Adventures"
        description="Explore premium whale watching, snorkeling, diving, and sunset cruises with Ocean Paradise Tours."
      />

      <Hero
        title={heroState.data.title}
        subtitle={heroState.data.subtitle}
        backgroundImage={heroState.data.backgroundImage}
      />

      <section className="container-shell py-20">
        <div className="mb-10 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Featured Tours</h2>
            <p className="section-subtitle mt-2">Handpicked ocean experiences designed for comfort and excitement.</p>
          </div>
          <Link to="/tours" className="btn-secondary hidden sm:inline-flex">All Tours</Link>
        </div>

        {toursState.loading ? <LoadingSpinner /> : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onSeeDetails={setSelectedTour} />
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { value: '25K+', label: 'Happy Guests' },
            { value: '12+', label: 'Years Experience' },
            { value: '4.9', label: 'Average Rating' },
          ].map((stat) => (
            <motion.article key={stat.label} whileInView={{ opacity: [0, 1], y: [12, 0] }} className="glass-card p-6 text-center">
              <p className="font-display text-4xl text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-cyan-100/75">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            'Certified crew with international safety standards',
            'Premium vessels with luxury comfort and amenities',
            'Sustainable tourism approach for marine protection',
          ].map((item) => (
            <article key={item} className="glass-card p-6 text-cyan-100/85">{item}</article>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100/70">About Us</p>
            <h2 className="mt-3 section-title">Ocean Paradise Tours</h2>
            <p className="mt-4 max-w-3xl leading-7 text-cyan-100/85">{aboutState.data}</p>
          </article>

          <div className="grid gap-5">
            <article className="glass-card p-6">
              <p className="text-lg font-semibold text-white">Our Mission</p>
              <p className="mt-2 text-cyan-100/80">
                To create exceptional, sustainable ocean experiences that connect travelers with marine beauty while supporting local communities.
              </p>
            </article>
            <article className="glass-card p-6">
              <p className="text-lg font-semibold text-white">Our Vision</p>
              <p className="mt-2 text-cyan-100/80">
                To be the region’s benchmark for luxury water tourism, known for hospitality, safety, and environmental responsibility.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <h2 className="section-title">Guest Testimonials</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => <TestimonialCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="section-title">Gallery Preview</h2>
          <Link to="/gallery" className="btn-secondary hidden sm:inline-flex">View Full Gallery</Link>
        </div>
        <GalleryGrid images={galleryPreview} />
      </section>

      <section className="container-shell py-16">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="mt-6">
          {faqState.loading ? <LoadingSpinner /> : <FAQAccordion faq={faqState.data} />}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Contact</h2>
            <p className="section-subtitle mt-2">Have a question or need help planning a trip? Reach us here.</p>
          </div>
          <Link to="/contact" className="btn-secondary hidden sm:inline-flex">Open Contact Page</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="glass-card p-6 text-sm text-cyan-100/85">
            <p className="text-base font-semibold text-white">Ocean Paradise Tours</p>
            <p className="mt-3">Email: {contactState.data.email}</p>
            <p className="mt-2">Phone: {contactState.data.phone}</p>
            <p className="mt-2">WhatsApp: {contactState.data.whatsapp}</p>
            <p className="mt-4 leading-6 text-cyan-100/75">
              {contactState.data.intro}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`mailto:${contactState.data.email}`} className="btn-primary px-4 py-2 text-sm">Email Us</a>
              <a
                href={`https://wa.me/${normalizeWhatsAppPhone(contactState.data.adminWhatsappPhone)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp px-4 py-2 text-xs"
              >
                WhatsApp Us
              </a>
            </div>
          </article>

          <article className="glass-card p-6 text-sm text-cyan-100/85">
            <p className="text-base font-semibold text-white">Contact Form</p>
            <div className="mt-4">
              <ContactForm source="Home page contact form" />
            </div>
          </article>

          <article className="glass-card overflow-hidden p-0 text-sm text-cyan-100/85">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-base font-semibold text-white">Location Map</p>
              <p className="mt-1 text-cyan-100/70">Find us in Trincomalee.</p>
            </div>
            <iframe title="Ocean Paradise Location" className="h-80 w-full border-0" loading="lazy" src={contactState.data.mapUrl} />
          </article>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Booking</h2>
            <p className="section-subtitle mt-2">Reserve your ocean experience without leaving the home page.</p>
          </div>
          <Link to="/booking" className="btn-secondary hidden sm:inline-flex">Open Booking Page</Link>
        </div>

        <BookingForm tours={toursState.data} />
      </section>

      {selectedTour && (
        <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </>
  )
}
