// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'  
// import SeoHead from '../components/SeoHead.jsx'
// import { signInAdmin } from '../services/authService.js'
// import { supabase } from '../supabase/client.js'

// export default function AdminLoginPage() {
//   const [form, setForm] = useState({ email: '', password: '' })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   function onChange(event) {
//     const { name, value } = event.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   async function onSubmit(event) {
//     event.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const { session, user } = await signInAdmin(form.email, form.password)
//       const authUser = user ?? session?.user

//       if (!authUser?.id) {
//         throw new Error('Login succeeded, but no auth session was returned.')
//       }

//       const { data, error: profileError } = await supabase
//         .from('users')
//         .select('role')
//         .eq('id', authUser.id)
//         .maybeSingle()

//       if (profileError) throw profileError
//       if (data?.role !== 'admin') throw new Error('Only admin users are allowed.')

//       navigate('/admin/dashboard', { replace: true })
//     } catch (err) {
//       setError(err.message || 'Login failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="container-shell flex min-h-screen items-center py-24">
//       <SeoHead title="Admin Login | Ocean Paradise Tours" description="Admin authentication portal for Ocean Paradise Tours." />

//       <form onSubmit={onSubmit} className="glass-card mx-auto w-full max-w-md space-y-4 p-7">
//         <h1 className="font-display text-3xl text-white">Admin Login</h1>
//         <label className="block text-sm text-cyan-100">Email
//           <input name="email" value={form.email} onChange={onChange} type="email" required className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
//         </label>
//         <label className="block text-sm text-cyan-100">Password
//           <input name="password" value={form.password} onChange={onChange} type="password" required className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white" />
//         </label>
//         <button disabled={loading} type="submit" className="btn-primary w-full">{loading ? 'Signing In...' : 'Sign In'}</button>
//         {error ? <p className="text-sm text-red-300">{error}</p> : null}
//       </form>
//     </section>
//   )
// }



import { useState } from 'react'
import { useNavigate } from 'react-router-dom'  
import SeoHead from '../components/SeoHead.jsx'
import { signInAdmin } from '../services/authService.js'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function onChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await signInAdmin(form.email, form.password)
      const authUser = data?.user

      if (!authUser?.id) {
        throw new Error('Login succeeded, but no auth session was returned.')
      }

      // Read role directly from the Auth metadata token instead of scanning the table
      const userRole = authUser.app_metadata?.role

      if (userRole !== 'admin') {
        throw new Error('Only admin users are allowed.')
      }

      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container-shell flex min-h-screen items-center py-24">
      <SeoHead title="Admin Login | Ocean Paradise Tours" description="Admin authentication portal for Ocean Paradise Tours." />

      <form onSubmit={onSubmit} className="glass-card mx-auto w-full max-w-md space-y-4 p-7">
        <h1 className="font-display text-3xl text-white">Admin Login</h1>
        <label className="block text-sm text-cyan-100">Email
          <input name="email" value={form.email} onChange={onChange} type="email" required className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none" />
        </label>
        <label className="block text-sm text-cyan-100">Password
          <input name="password" value={form.password} onChange={onChange} type="password" required className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none" />
        </label>
        <button disabled={loading} type="submit" className="btn-primary w-full">{loading ? 'Signing In...' : 'Sign In'}</button>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>
    </section>
  )
}