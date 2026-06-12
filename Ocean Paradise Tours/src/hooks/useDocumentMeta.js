import { useEffect } from 'react'

export default function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title
    const existingMeta = document.querySelector('meta[name="description"]')

    if (existingMeta) {
      existingMeta.setAttribute('content', description)
      return
    }

    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = description
    document.head.appendChild(meta)
  }, [title, description])
}
