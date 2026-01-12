import { z } from 'zod'

/**
 * Zod validation schemas
 *
 * Use these to validate user input on both client and server.
 * Zod provides:
 * - Type safety: TypeScript types are inferred from schemas
 * - Runtime validation: Catch invalid data before it reaches your database
 * - Clear error messages: Helpful validation errors for users
 *
 * Learn more: https://zod.dev
 */

// ============================================================================
// Reusable Field Schemas
// ============================================================================

/**
 * Email validation
 * Checks for valid email format
 */
export const emailSchema = z.email().min(1, 'Email is required').toLowerCase().trim()

/**
 * Password validation with strength requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * Optional password for updates (less strict)
 * Use this when password is optional (like profile updates)
 */
export const optionalPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .optional()

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * Registration schema
 * Validates new user signup with password confirmation
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Show error on confirmPassword field
  })

/**
 * Login schema
 * Simpler validation - just check fields aren't empty
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

/**
 * Password reset confirmation schema
 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Infer TypeScript types from schemas
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>

// ============================================================================
// User Profile Schemas
// ============================================================================

/**
 * Profile update schema
 * For updating user profile information
 */
export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').trim().optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

// ============================================================================
// AI Prompt Schemas
// ============================================================================

/**
 * Experience level enum
 * Used across multiple schemas
 */
export const experienceLevelEnum = z.enum(['beginner', 'intermediate', 'advanced'])

/**
 * AI profile suggestions request schema
 * Validates input for generating personalized learning suggestions
 */
export const aiPromptSchema = z.object({
  userBackground: z
    .string()
    .min(10, 'Please provide more details about your background (at least 10 characters)')
    .max(2000, 'Background description is too long (max 2000 characters)')
    .trim(),
  currentGoals: z
    .string()
    .max(1000, 'Goals description is too long (max 1000 characters)')
    .trim()
    .optional(),
  experienceLevel: experienceLevelEnum,
})

export type AiPromptInput = z.infer<typeof aiPromptSchema>

/**
 * Single suggestion schema
 * Validates the structure of AI-generated suggestions
 */
export const suggestionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  reason: z.string().min(1, 'Reason is required'),
  action: z.string().min(1, 'Action is required'),
})

/**
 * AI response schema
 * Validates the complete AI response structure
 */
export const aiResponseSchema = z.object({
  suggestions: z.array(suggestionSchema).min(1).max(10),
})

export type Suggestion = z.infer<typeof suggestionSchema>
export type AiResponse = z.infer<typeof aiResponseSchema>

// ============================================================================
// Suggestion Management Schemas
// ============================================================================

/**
 * Mark suggestion as completed
 */
export const completeSuggestionSchema = z.object({
  suggestionId: z.uuid('Invalid suggestion ID'),
  suggestionTitle: z.string().min(1, 'Suggestion title is required'),
})

/**
 * Rate suggestions
 */
export const rateSuggestionsSchema = z.object({
  suggestionId: z.uuid('Invalid suggestion ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
})

export type CompleteSuggestionInput = z.infer<typeof completeSuggestionSchema>
export type RateSuggestionsInput = z.infer<typeof rateSuggestionsSchema>

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validate data against a schema and return typed result
 * Throws error with clear message if validation fails
 *
 * Usage:
 *   const validated = validate(loginSchema, formData)
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
    throw new Error(`Validation failed: ${errors.join(', ')}`)
  }

  return result.data
}

/**
 * Validate data and return errors in a user-friendly format
 * Returns null if valid, or an object with field errors
 *
 * Usage:
 *   const { data, errors } = validateWithErrors(loginSchema, formData)
 *   if (errors) {
 *     setFormErrors(errors)
 *     return
 *   }
 *   // Continue with valid data
 */
export function validateWithErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data: T; errors: null } | { data: null; errors: Record<string, string> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { data: result.data, errors: null }
  }

  const errors: Record<string, string> = {}
  result.error.issues.forEach(err => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return { data: null, errors }
}

/**
 * Parse and validate unknown data safely
 * Returns undefined if validation fails (useful for optional parsing)
 *
 * Usage:
 *   const suggestion = safeParse(suggestionSchema, unknownData)
 *   if (!suggestion) {
 *     console.error('Invalid suggestion format')
 *     return
 *   }
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | undefined {
  const result = schema.safeParse(data)
  return result.success ? result.data : undefined
}

/**
 * USAGE EXAMPLES:
 *
 * // In an API route:
 * export async function POST(req: Request) {
 *   try {
 *     const body = await req.json()
 *     const validated = validate(registerSchema, body) // throws if invalid
 *
 *     // Use validated data (fully typed!)
 *     const { email, password } = validated
 *   } catch (error) {
 *     return NextResponse.json({ error: error.message }, { status: 400 })
 *   }
 * }
 *
 * // In a form handler:
 * const handleSubmit = (formData) => {
 *   const { data, errors } = validateWithErrors(loginSchema, formData)
 *   if (errors) {
 *     setFormErrors(errors)
 *     return
 *   }
 *   // Continue with valid data
 * }
 *
 * // Quick inline validation:
 * const email = emailSchema.parse(input) // throws if invalid
 *
 * // Safe optional parsing:
 * const suggestion = safeParse(suggestionSchema, unknownData)
 * if (suggestion) {
 *   // Use suggestion safely
 * }
 */
