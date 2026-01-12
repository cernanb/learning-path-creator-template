import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/client'
import { validate, loginSchema } from '@/lib/validation/schemas'

/**
 * User Login Endpoint
 *
 * TODO: Implement user login using Supabase Auth
 *
 * Requirements:
 * 1. Parse and validate request body (email, password)
 * 2. Authenticate user with Supabase Auth
 * 3. Return appropriate success/error response
 * 4. Set proper HTTP status codes
 *
 * Learning Objectives:
 * - API route handlers in Next.js
 * - Request validation with Zod
 * - Supabase Auth API (signInWithPassword)
 * - HTTP status codes (200, 400, 401, 500)
 * - Error handling and user feedback
 *
 * Reference: See /api/health/route.ts for complete example
 * Documentation: docs/authentication.md
 */
export async function POST(req: Request) {
  try {
    // TODO: Parse request body
    // Hint: const body = await req.json()

    // TODO: Validate request body with loginSchema
    // Hint: const validated = validate(loginSchema, body)
    // This will throw an error if validation fails

    // TODO: Get Supabase client
    // Hint: const supabase = createServiceClient()

    // TODO: Authenticate user with Supabase
    // Hint: const { data, error } = await supabase.auth.signInWithPassword({
    //   email: validated.email,
    //   password: validated.password,
    // })

    // TODO: Handle authentication error
    // If error exists, return 401 Unauthorized with error message
    // Hint: if (error) { return NextResponse.json({ error: error.message }, { status: 401 }) }

    // TODO: Return success response with user data
    // Return 200 OK with success flag and user info (id, email)
    // Hint: return NextResponse.json({ success: true, user: { ... } }, { status: 200 })

    return NextResponse.json({ error: 'Not implemented yet' }, { status: 501 })
  } catch (error) {
    // TODO: Handle validation errors
    // Validation errors should return 400 Bad Request

    // TODO: Handle unexpected errors
    // Log the error and return 500 Internal Server Error

    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

/**
 * IMPLEMENTATION STEPS:
 *
 * Step 1: Parse and validate request
 * ─────────────────────────────────────
 * const body = await req.json()
 * const validated = validate(loginSchema, body)
 * // validated now has type LoginInput with { email: string, password: string }
 *
 * Step 2: Authenticate with Supabase
 * ─────────────────────────────────────
 * const supabase = createServiceClient()
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: validated.email,
 *   password: validated.password,
 * })
 *
 * Step 3: Handle authentication result
 * ─────────────────────────────────────
 * if (error) {
 *   return NextResponse.json(
 *     { error: error.message },
 *     { status: 401 } // Unauthorized
 *   )
 * }
 *
 * Step 4: Return success
 * ─────────────────────────────────────
 * return NextResponse.json({
 *   success: true,
 *   user: {
 *     id: data.user?.id,
 *     email: data.user?.email,
 *   },
 * }, { status: 200 })
 */

/**
 * HTTP STATUS CODES TO USE:
 *
 * 200 - Success: User authenticated successfully
 * 400 - Bad Request: Invalid input (validation failed)
 * 401 - Unauthorized: Invalid credentials (wrong email/password)
 * 500 - Internal Server Error: Unexpected error occurred
 */

/**
 * COMMON MISTAKES TO AVOID:
 *
 * ❌ Not validating input before using it
 * ❌ Returning 200 when authentication fails
 * ❌ Exposing sensitive error details to client
 * ❌ Not logging errors for debugging
 * ❌ Forgetting to await async operations
 * ❌ Using wrong HTTP status codes
 */

/**
 * TESTING CHECKLIST:
 *
 * Test with Thunder Client, Postman, or curl:
 *
 * 1. Valid credentials:
 *    POST /api/auth/login
 *    Body: { "email": "test@example.com", "password": "Password123!" }
 *    Expected: 200, { success: true, user: { ... } }
 *
 * 2. Invalid email format:
 *    Body: { "email": "notanemail", "password": "Password123!" }
 *    Expected: 400, validation error
 *
 * 3. Wrong password:
 *    Body: { "email": "test@example.com", "password": "wrongpass" }
 *    Expected: 401, { error: "Invalid credentials" }
 *
 * 4. Missing fields:
 *    Body: { "email": "test@example.com" }
 *    Expected: 400, validation error
 *
 * 5. Non-existent user:
 *    Body: { "email": "nonexistent@example.com", "password": "Password123!" }
 *    Expected: 401, { error: "Invalid credentials" }
 */

/**
 * USAGE IN FRONTEND:
 *
 * const handleLogin = async (email: string, password: string) => {
 *   try {
 *     const response = await fetch('/api/auth/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ email, password }),
 *     })
 *
 *     const data = await response.json()
 *
 *     if (!response.ok) {
 *       throw new Error(data.error || 'Login failed')
 *     }
 *
 *     // Success! User is logged in
 *     console.log('Logged in as:', data.user.email)
 *     router.push('/dashboard')
 *   } catch (error) {
 *     setError(error.message)
 *   }
 * }
 */

/**
 * WHAT HAPPENS AFTER LOGIN?
 *
 * After successful login, Supabase automatically:
 * 1. Sets auth cookies in the browser
 * 2. Returns session tokens
 * 3. Updates auth state (useAuth hook will detect this)
 * 4. User stays logged in across page refreshes
 *
 * You don't need to manually manage sessions - Supabase handles it!
 */

/**
 * SUCCESS CRITERIA:
 * ✅ Request body is validated with Zod
 * ✅ Returns 401 for invalid credentials
 * ✅ Returns 400 for validation errors
 * ✅ Returns 200 with user data on success
 * ✅ Errors are logged for debugging
 * ✅ Error messages are user-friendly
 * ✅ All async operations are awaited
 */
