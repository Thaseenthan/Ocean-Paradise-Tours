import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GalleryGrid({ images }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <section className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
        {images.map((item) => (
          <motion.button
            type="button"
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-left"
            onClick={() => setSelected(item)}
          >
            <img src={item.image_url} alt={item.caption || 'Gallery image'} className="w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-4">
              <p className="text-sm text-cyan-100">{item.caption}</p>
            </div>
          </motion.button>
        ))}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white"
            >
              Close
            </button>
            <img src={selected.image_url} alt={selected.caption || 'Preview'} className="max-h-[90vh] w-full object-contain" />
          </div>
        </div>
      ) : null}
    </>
  )
}
