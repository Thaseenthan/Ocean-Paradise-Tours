import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="container-shell flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-5xl text-white">404</h1>
      <p className="text-cyan-100/80">The page you requested could not be found.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </section>
  )
}
