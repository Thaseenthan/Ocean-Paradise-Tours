import { useEffect, useState } from 'react'

export default function useFetch(fetcher, deps = [], initialData = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError('')
      try {
        const result = await fetcher()
        if (mounted) setData(result ?? [])
      } catch (err) {
        if (mounted) setError(err?.message ?? 'Something went wrong.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, deps)

  return { data, loading, error, setData }
}
