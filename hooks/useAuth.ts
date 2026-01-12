'use client'

import { useState, useEffect } from 'react'
import { AuthUser } from '@/types'
import { createClient } from '@/lib/supabase/client'

/**
 * Custom hook for authentication
 *
 * TODO: Implement authentication state management and auth methods
 *
 * This hook should:
 * 1. Track the current user
 * 2. Provide loading state while checking auth
 * 3. Provide error state for auth operations
 * 4. Expose sign in, sign up, and sign out methods
 * 5. Listen for auth state changes (user logs in/out in another tab)
 *
 * Learning Objectives:
 * - Managing complex state in React hooks
 * - Using useEffect for side effects (auth listeners)
 * - Async operations in React
 * - Error handling in UI
 * - Supabase Auth API
 */

export function useAuth(): AuthUser {
  // TODO: Add state for user
  // Hint: const [user, setUser] = useState<User | null>(null)

  // TODO: Add state for loading
  // Hint: Should be true initially while checking auth status

  // TODO: Add state for errors
  // Hint: Store error messages as strings

  const supabase = createClient()

  // TODO: Implement useEffect to get initial auth state
  // Requirements:
  // 1. Get the current session when component mounts
  // 2. Set user if session exists
  // 3. Set loading to false when done
  // 4. Handle errors appropriately
  //
  // Hint: Use supabase.auth.getSession()
  useEffect(() => {
    // TODO: Implement initial auth check
  }, [supabase])

  // TODO: Implement useEffect to listen for auth changes
  // Requirements:
  // 1. Subscribe to auth state changes
  // 2. Update user when auth state changes
  // 3. Clean up subscription on unmount
  //
  // Hint: Use supabase.auth.onAuthStateChange()
  useEffect(() => {
    // TODO: Set up auth state listener
    // TODO: Return cleanup function to unsubscribe
  }, [supabase])

  /**
   * Sign in with email and password
   *
   * TODO: Implement sign in logic
   * Requirements:
   * 1. Clear any existing errors
   * 2. Call Supabase signInWithPassword
   * 3. Handle errors and set error state
   * 4. Throw error so calling component can handle it
   *
   * Hint: Use supabase.auth.signInWithPassword({ email, password })
   */
  const signIn = async (email: string, password: string) => {
    // TODO: Implement sign in
  }

  /**
   * Sign up with email and password
   *
   * TODO: Implement sign up logic
   * Requirements:
   * 1. Clear any existing errors
   * 2. Call Supabase signUp
   * 3. Handle errors and set error state
   * 4. Throw error so calling component can handle it
   *
   * Hint: Use supabase.auth.signUp({ email, password })
   */
  const signUp = async (email: string, password: string) => {
    // TODO: Implement sign up
  }

  /**
   * Sign out current user
   *
   * TODO: Implement sign out logic
   * Requirements:
   * 1. Clear any existing errors
   * 2. Call Supabase signOut
   * 3. Handle errors and set error state
   * 4. Throw error so calling component can handle it
   *
   * Hint: Use supabase.auth.signOut()
   */
  const signOut = async () => {
    // TODO: Implement sign out
  }

  return {
    user: null, // TODO: Return actual user state
    loading: true, // TODO: Return actual loading state
    error: null, // TODO: Return actual error state
    signIn,
    signUp,
    signOut,
  }
}

/**
 * IMPLEMENTATION HINTS:
 *
 * 1. Initial Auth Check:
 *    const { data: { session } } = await supabase.auth.getSession()
 *    setUser(session?.user ?? null)
 *
 * 2. Auth State Listener:
 *    const { data: { subscription } } = supabase.auth.onAuthStateChange(
 *      (_event, session) => {
 *        setUser(session?.user ?? null)
 *      }
 *    )
 *    return () => subscription.unsubscribe()
 *
 * 3. Error Handling Pattern:
 *    try {
 *      setError(null)
 *      const { error } = await supabase.auth.signIn(...)
 *      if (error) throw error
 *    } catch (err) {
 *      const message = err instanceof Error ? err.message : 'Auth failed'
 *      setError(message)
 *      throw err
 *    }
 *
 * COMMON MISTAKES:
 * - Forgetting to clean up the auth listener (memory leak!)
 * - Not handling the case where session is null
 * - Setting loading=false before auth check completes
 * - Not clearing errors before new auth operations
 *
 * TESTING:
 * 1. Test initial load: Should show loading=true then loading=false
 * 2. Test sign up: Should create user and update state
 * 3. Test sign in: Should authenticate and update state
 * 4. Test sign out: Should clear user and update state
 * 5. Test errors: Should set error state on failed operations
 * 6. Test multiple tabs: Sign out in one tab should update others
 *
 * SUCCESS CRITERIA:
 * ✅ User state updates when auth changes
 * ✅ Loading state prevents premature UI rendering
 * ✅ Errors are captured and displayed to user
 * ✅ Auth listener is properly cleaned up
 * ✅ Works across multiple tabs/windows
 */

/**
 * USAGE EXAMPLE:
 *
 * function LoginForm() {
 *   const { user, loading, error, signIn } = useAuth()
 *
 *   if (loading) return <div>Loading...</div>
 *   if (user) return <div>Welcome {user.email}</div>
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault()
 *     try {
 *       await signIn(email, password)
 *       router.push('/dashboard')
 *     } catch (err) {
 *       // Error already set in hook
 *       console.error('Login failed:', err)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <p className="text-red-500">{error}</p>}
 *       <input type="email" />
 *       <input type="password" />
 *       <button type="submit">Sign In</button>
 *     </form>
 *   )
 * }
 */
