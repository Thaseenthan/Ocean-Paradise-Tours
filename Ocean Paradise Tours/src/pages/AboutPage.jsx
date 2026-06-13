import { useEffect, useState } from 'react'
import SeoHead from '../components/SeoHead.jsx'
import { DEFAULT_ABOUT_CONTENT, getAboutContent } from '../services/contentService.js'

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(DEFAULT_ABOUT_CONTENT)

  useEffect(() => {
    let mounted = true

    async function load() {
      const content = await getAboutContent()
      if (mounted) setAboutContent(content)
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="container-shell py-32">
      <SeoHead
        title="Ocean Paradise Tours | About Us"
        description="Learn our mission, vision, team values, and safety-first approach to premium ocean tourism."
      />

      <h1 className="section-title">About Ocean Paradise Tours</h1>
      <p className="mt-4 max-w-3xl text-cyan-100/85">{aboutContent}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Our Mission</h2>
          <p className="mt-2 text-cyan-100/80">
            To create exceptional, sustainable ocean experiences that connect travelers with marine beauty while supporting local communities.
          </p>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Our Vision</h2>
          <p className="mt-2 text-cyan-100/80">
            To be the region’s benchmark for luxury water tourism, known for hospitality, safety, and environmental responsibility.
          </p>
        </article>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Team</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {['Marine Guide', 'Dive Instructor', 'Guest Experience Lead'].map((role) => (
            <article key={role} className="glass-card p-6">
              <p className="font-semibold text-white">{role}</p>
              <p className="mt-2 text-sm text-cyan-100/80">Certified professionals with years of ocean safety and hospitality training.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Safety Certifications</h2>
        <ul className="mt-4 space-y-2 text-cyan-100/85">
          <li>• ISO-aligned maritime safety procedures</li>
          <li>• PADI-certified diving protocols</li>
          <li>• Emergency first-response trained crew</li>
        </ul>
      </section>
    </section>
  )
}
