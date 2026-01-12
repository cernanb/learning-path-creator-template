// src/components/features/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

/**
 * RegisterForm Component
 *
 * TODO: Build a user registration form
 *
 * Requirements:
 * 1. Form with email, password, and confirm password fields
 * 2. Password strength validation
 * 3. Password confirmation matching
 * 4. Call useAuth hook's signUp method
 * 5. Show loading state during registration
 * 6. Display validation errors
 * 7. Redirect to profile setup on success
 *
 * Learning Objectives:
 * - Complex form validation
 * - Password strength checking
 * - Matching field validation
 * - User feedback for password requirements
 */
export function RegisterForm() {
  const router = useRouter()
  const { signUp, error: authError, loading: authLoading } = useAuth()

  // TODO: Add state for form fields
  // Hint: const [email, setEmail] = useState('')
  //       const [password, setPassword] = useState('')
  //       const [confirmPassword, setConfirmPassword] = useState('')

  // TODO: Add state for errors
  // Hint: const [errors, setErrors] = useState<Record<string, string>>({})

  // TODO: Add loading state
  // Hint: const [isLoading, setIsLoading] = useState(false)

  /**
   * TODO: Implement password validation
   * Check for:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   */
  const validatePassword = (password: string): string[] => {
    const errors: string[] = []

    // TODO: Add validation checks
    // if (password.length < 8) errors.push('At least 8 characters')
    // if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
    // if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
    // if (!/[0-9]/.test(password)) errors.push('One number')

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Step 1 - Clear previous errors

    // TODO: Step 2 - Validate email
    // Check if email is not empty and contains @

    // TODO: Step 3 - Validate password strength
    // Use validatePassword() helper
    // If errors, display them and return

    // TODO: Step 4 - Check passwords match
    // if (password !== confirmPassword) set error and return

    // TODO: Step 5 - Call signUp from useAuth hook
    // Wrap in try/catch, set loading state

    // TODO: Step 6 - Redirect on success
    // router.push('/profile-setup')

    // TODO: Step 7 - Handle errors
    // Set error state with user-friendly message

    console.log('TODO: Implement registration')
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </a>
        </p>
      </div>

      {/* TODO: Error Alert */}
      {/* Show if there are any errors */}

      {/* TODO: Registration Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* TODO: Email Input */}
        {/* Use Input component */}
        {/* Show error if exists: error={errors.email} */}

        {/* TODO: Password Input */}
        {/* Use Input component */}
        {/* Show password requirements helper text */}
        {/* Show error if exists: error={errors.password} */}

        {/* TODO: Password Requirements Helper */}
        {/* Show list of requirements with checkmarks for met requirements */}
        <div className="text-sm text-gray-600">
          <p className="font-medium">Password must contain:</p>
          <ul className="mt-1 space-y-1">
            {/* TODO: Show requirements with checkmarks when met */}
            {/* Example: ✓ At least 8 characters (green if met, gray if not) */}
          </ul>
        </div>

        {/* TODO: Confirm Password Input */}
        {/* Use Input component */}
        {/* Show error if passwords don't match */}

        {/* TODO: Terms and Conditions Checkbox */}
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-900">
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* TODO: Submit Button */}
        {/* Use Button component with isLoading */}
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
 * const [confirmPassword, setConfirmPassword] = useState('')
 * const [errors, setErrors] = useState<Record<string, string>>({})
 * const [isLoading, setIsLoading] = useState(false)
 * const [termsAccepted, setTermsAccepted] = useState(false)
 *
 * Validation:
 * ───────────
 * const newErrors: Record<string, string> = {}
 *
 * if (!email || !email.includes('@')) {
 *   newErrors.email = 'Please enter a valid email'
 * }
 *
 * const passwordErrors = validatePassword(password)
 * if (passwordErrors.length > 0) {
 *   newErrors.password = passwordErrors.join(', ')
 * }
 *
 * if (password !== confirmPassword) {
 *   newErrors.confirmPassword = 'Passwords do not match'
 * }
 *
 * if (!termsAccepted) {
 *   newErrors.terms = 'Please accept the terms and conditions'
 * }
 *
 * if (Object.keys(newErrors).length > 0) {
 *   setErrors(newErrors)
 *   return
 * }
 *
 * Password Requirements Display:
 * ──────────────────────────────
 * const requirements = [
 *   { label: 'At least 8 characters', met: password.length >= 8 },
 *   { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
 *   { label: 'One lowercase letter', met: /[a-z]/.test(password) },
 *   { label: 'One number', met: /[0-9]/.test(password) },
 * ]
 *
 * {requirements.map((req, i) => (
 *   <li key={i} className={req.met ? 'text-green-600' : 'text-gray-500'}>
 *     {req.met ? '✓' : '○'} {req.label}
 *   </li>
 * ))}
 */

/**
 * COMMON MISTAKES:
 * ❌ Not validating password strength
 * ❌ Not checking if passwords match
 * ❌ Showing all errors at once (overwhelming)
 * ❌ Not giving real-time feedback on password requirements
 * ❌ Not requiring terms acceptance
 */

/**
 * SUCCESS CRITERIA:
 * ✅ Email validated for format
 * ✅ Password meets all strength requirements
 * ✅ Confirm password matches
 * ✅ Terms must be accepted
 * ✅ Real-time password strength feedback
 * ✅ Clear error messages
 * ✅ Loading state during registration
 * ✅ Redirects to profile setup on success
 */
