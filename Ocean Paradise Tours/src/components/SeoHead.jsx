import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function SeoHead({ title, description }) {
  useDocumentMeta(title, description)
  return null
}
