// src/components/features/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

/**
 * LoginForm Component
 *
 * TODO: Build a user login form
 *
 * Requirements:
 * 1. Form with email and password fields
 * 2. Client-side validation (email format, required fields)
 * 3. Call useAuth hook's signIn method
 * 4. Show loading state during authentication
 * 5. Display error messages
 * 6. Redirect to dashboard on success
 *
 * Learning Objectives:
 * - Form handling in React
 * - Using custom hooks (useAuth)
 * - Client-side validation
 * - Navigation with Next.js router
 * - Error state management
 */
export function LoginForm() {
  const router = useRouter()
  const { signIn, error: authError, loading: authLoading } = useAuth()

  // TODO: Add state for form fields
  // Hint: const [email, setEmail] = useState('')
  //       const [password, setPassword] = useState('')

  // TODO: Add state for form-level errors
  // Hint: const [error, setError] = useState<string | null>(null)

  // TODO: Add loading state
  // Hint: const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Step 1 - Clear previous errors

    // TODO: Step 2 - Validate form
    // Check if email and password are not empty
    // Check if email format is valid (contains @)

    // TODO: Step 3 - Call signIn from useAuth hook
    // Wrap in try/catch
    // Set loading state

    // TODO: Step 4 - Redirect on success
    // Use router.push('/dashboard')

    // TODO: Step 5 - Handle errors
    // Set error state with user-friendly message

    console.log('TODO: Implement login')
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </a>
        </p>
      </div>

      {/* TODO: Error Alert */}
      {/* Show if error or authError exists */}
      {/* Red border, red text */}

      {/* TODO: Login Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* TODO: Email Input */}
        {/* Use the Input component from @/components/ui/Input */}
        {/* Props: label, type="email", required, value, onChange */}

        {/* TODO: Password Input */}
        {/* Use the Input component */}
        {/* Props: label, type="password", required, value, onChange */}

        {/* TODO: Forgot Password Link */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* TODO: Submit Button */}
        {/* Use the Button component */}
        {/* Props: type="submit", fullWidth, isLoading, disabled */}
      </form>
    </div>
  )
}

/**
 * IMPLEMENTATION HINTS:
 *
 * State:
 * ──────
 * const [email, setEmail] = useState('')
 * const [password, setPassword] = useState('')
 * const [error, setError] = useState<string | null>(null)
 * const [isLoading, setIsLoading] = useState(false)
 *
 * Validation:
 * ───────────
 * if (!email || !password) {
 *   setError('Please fill in all fields')
 *   return
 * }
 *
 * if (!email.includes('@')) {
 *   setError('Please enter a valid email')
 *   return
 * }
 *
 * Submit Handler:
 * ───────────────
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault()
 *   setError(null)
 *
 *   // Validation...
 *
 *   setIsLoading(true)
 *   try {
 *     await signIn(email, password)
 *     router.push('/dashboard')
 *   } catch (err) {
 *     setError('Invalid email or password')
 *   } finally {
 *     setIsLoading(false)
 *   }
 * }
 *
 * Using Input Component:
 * ──────────────────────
 * <Input
 *   label="Email address"
 *   type="email"
 *   required
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="you@example.com"
 * />
 */

/**
 * COMMON MISTAKES:
 * ❌ Not preventing form default submission
 * ❌ Not clearing errors before new submission
 * ❌ Not showing loading state (user clicks multiple times)
 * ❌ Showing technical error messages to users
 * ❌ Not disabling button during loading
 */

/**
 * SUCCESS CRITERIA:
 * ✅ Form validates email format
 * ✅ Both fields are required
 * ✅ Loading spinner shows during auth
 * ✅ Error messages are user-friendly
 * ✅ Redirects to dashboard on success
 * ✅ Button disabled during loading
 */
