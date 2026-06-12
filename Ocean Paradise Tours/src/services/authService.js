// import { supabase } from '../supabase/client.js'

// function withTimeout(promise, timeoutMs, message) {
//   let timeoutId

//   const timeoutPromise = new Promise((_, reject) => {
//     timeoutId = setTimeout(() => {
//       reject(new Error(message))
//     }, timeoutMs)
//   })

//   return Promise.race([
//     promise.finally(() => clearTimeout(timeoutId)),
//     timeoutPromise,
//   ])
// }

// export async function signInAdmin(email, password) {
//   if (!supabase) throw new Error('Supabase not configured. Cannot authenticate.')
//   try {
//     const { data, error } = await withTimeout(
//       supabase.auth.signInWithPassword({ email, password }),
//       15000,
//       'Supabase login is taking too long. Check your network, auth user, and Supabase settings.',
//     )
//     if (error) throw error
//     return data
//   } catch (err) {
//     throw err
//   }
// }

// export async function signOut() {
//   if (!supabase) return
//   try {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   } catch (err) {
//     throw err
//   }
// }

// export async function getSession() {
//   if (!supabase) return null
//   try {
//     const { data, error } = await supabase.auth.getSession()
//     if (error) throw error
//     return data.session
//   } catch {
//     return null
//   }
// }


import { supabase } from '../supabase/client.js'

/**
 * Wraps a promise with a timeout mechanism.
 * If the promise doesn't resolve within the specified time, it rejects.
 */
function withTimeout(promise, timeoutMs, message) {
  let timeoutId

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message))
    }, timeoutMs)
  })

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise,
  ])
}

/**
 * Authenticates an admin user with email and password.
 * Includes a 15-second timeout safeguard.
 */
export async function signInAdmin(email, password) {
  if (!supabase) throw new Error('Supabase not configured. Cannot authenticate.')
  try {
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      25000,
      'Supabase login is taking too long. Check your network, auth user, and Supabase settings.',
    )
    if (error) throw error
    return data
  } catch (err) {
    throw err
  }
}

/**
 * Logs out the currently authenticated user session.
 */
export async function signOut() {
  if (!supabase) return
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    throw err
  }
}

/**
 * Retrieves the current active user session, if available.
 */
export async function getSession() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch {
    return null
  }
}

/**
 * Updates the currently logged-in user's password in Supabase Auth.
 * Used inside the Admin Settings page.
 */
export async function updateAdminPassword(newPassword) {
  if (!supabase) throw new Error('Supabase not configured.')
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  } catch (err) {
    throw err
  }
}