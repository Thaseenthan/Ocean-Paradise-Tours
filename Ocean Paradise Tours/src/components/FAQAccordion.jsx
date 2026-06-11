import { useState } from 'react'

export default function FAQAccordion({ faq }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="space-y-3">
      {faq.map((item) => {
        const isOpen = openId === item.id
        return (
          <article key={item.id} className="glass-card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-white">{item.question}</span>
              <span className="text-cyan-100">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? <p className="px-5 pb-4 text-sm text-cyan-100/80">{item.answer}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
