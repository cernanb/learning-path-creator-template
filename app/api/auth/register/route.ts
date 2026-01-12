// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { validate, registerSchema } from '@/lib/validation/schemas'

/**
 * User Registration Endpoint
 *
 * TODO: Implement user registration
 *
 * Requirements:
 * 1. Parse and validate request body using registerSchema
 * 2. Create user account with Supabase Auth
 * 3. Handle errors appropriately
 * 4. Return success response
 *
 * Testing:
 * - Use Thunder Client or Postman to test
 * - Try with invalid email, weak password
 * - Verify user appears in Supabase dashboard
 */
export async function POST(req: Request) {
  try {
    // TODO: Parse request body

    // TODO: Validate with registerSchema

    // TODO: Create user with supabase.auth.signUp()

    // TODO: Return success response

    return NextResponse.json({
      success: true,
      // TODO: Add user data
    })
  } catch (error) {
    // TODO: Handle errors properly
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

/**
 * HINTS:
 * - Import createServiceClient from '@/lib/supabase/client'
 * - Use validate() function: validate(registerSchema, body)
 * - Supabase method: supabase.auth.signUp({ email, password })
 *
 * COMMON MISTAKES:
 * - Forgetting to validate input
 * - Not handling the error case from Supabase
 * - Returning the wrong HTTP status code
 */
