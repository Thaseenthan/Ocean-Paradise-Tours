// import { createContext, useContext, useEffect, useMemo, useState } from 'react'
// import { supabase } from '../supabase/client.js'
// import { TABLES } from '../supabase/queries.js'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(null)
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true

//     async function loadSession() {
//       if (!supabase) {
//         if (mounted) setLoading(false)
//         return
//       }

//       try {
//         const { data } = await supabase.auth.getSession()
//         if (!mounted) return
//         setSession(data.session)

//         if (data.session?.user) {
//           const roleData = await getProfile(data.session.user.id)
//           if (mounted) setProfile(roleData)
//         }
//       } catch {
//         // Silently fail in demo mode
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }

//     loadSession()

//     if (!supabase) return

//     const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
//       if (!mounted) return
//       setSession(nextSession)

//       if (nextSession?.user) {
//         const roleData = await getProfile(nextSession.user.id)
//         if (mounted) setProfile(roleData)
//       } else {
//         setProfile(null)
//       }
//     })

//     return () => {
//       mounted = false
//       listener.subscription.unsubscribe()
//     }
//   }, [])

//   const value = useMemo(
//     () => ({
//       session,
//       user: session?.user ?? null,
//       profile,
//       loading,
//       isAdmin: profile?.role === 'admin',
//       setProfile,
//     }),
//     [loading, profile, session],
//   )

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// async function getProfile(userId) {
//   if (!supabase) return null
//   try {
//     const { data, error } = await supabase
//       .from(TABLES.users)
//       .select('id, email, role')
//       .eq('id', userId)
//       .maybeSingle()

//     if (error) return null
//     return data
//   } catch {
//     return null
//   }
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider')
//   }
//   return context
// }


import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      if (!supabase) {
        if (mounted) setLoading(false)
        return
      }

      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) {
          setSession(data.session)
        }
      } catch {
        // Silently fail in demo mode
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSession()

    if (!supabase) return

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // Instantly compute if admin based on JWT token app_metadata array
  const isAdmin = useMemo(() => {
    return session?.user?.app_metadata?.role === 'admin'
  }, [session])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isAdmin,
    }),
    [loading, session, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}