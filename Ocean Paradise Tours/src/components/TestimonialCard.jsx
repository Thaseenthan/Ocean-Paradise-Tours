export default function TestimonialCard({ item }) {
  return (
    <article className="glass-card p-6">
      <p className="text-cyan-100/90">“{item.message}”</p>
      <div className="mt-5 flex items-center justify-between text-sm">
        <p className="font-semibold text-white">{item.name}</p>
        <p className="text-cyan-100">{'⭐'.repeat(item.rating ?? 5)}</p>
      </div>
    </article>
  )
}
