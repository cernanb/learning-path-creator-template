import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/openai/client'
import { createServiceClient } from '@/lib/supabase/client'
import { validate, aiPromptSchema, aiResponseSchema } from '@/lib/validation/schemas'
import type { Suggestion } from '@/lib/validation/schemas'

/**
 * AI-Powered Profile Suggestions Endpoint
 *
 * TODO: Implement AI-powered personalized learning suggestions
 *
 * This endpoint demonstrates how to integrate AI into your application
 * to provide personalized recommendations based on user profile data.
 *
 * Requirements:
 * 1. Authenticate the user (only logged-in users can get suggestions)
 * 2. Validate user input (background, goals, experience level)
 * 3. Build a personalized AI prompt
 * 4. Call OpenAI API to generate suggestions
 * 5. Parse and validate AI response
 * 6. Store suggestions in database
 * 7. Return suggestions to frontend
 *
 * Learning Objectives:
 * - AI integration (OpenAI API)
 * - Prompt engineering (getting quality AI responses)
 * - JSON parsing from AI responses
 * - Database operations (storing AI results)
 * - Authentication in API routes
 * - Complex error handling
 *
 * Route: POST /api/profile/suggestions
 * Reference: docs/ai-integration.md
 */
export async function POST(req: Request) {
  try {
    // TODO: Step 1 - Parse request body
    // Hint: const body = await req.json()

    // TODO: Step 2 - Validate input with aiPromptSchema
    // Hint: const validated = validate(aiPromptSchema, body)
    // This gives you: { userBackground, currentGoals?, experienceLevel }

    // TODO: Step 3 - Authenticate user
    // Get the current user from Supabase
    // If no user, return 401 Unauthorized
    // Hint: const supabase = createServiceClient()
    //       const { data: { user }, error } = await supabase.auth.getUser()
    //       if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // TODO: Step 4 - Build AI prompt
    // Create a personalized prompt using the validated input
    // See buildProfileSuggestionPrompt() helper function below
    // Hint: const prompt = buildProfileSuggestionPrompt(validated)

    // TODO: Step 5 - Call OpenAI API
    // Use the openai client to generate suggestions
    // Request JSON format for easy parsing
    // Hint: const completion = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages: [
    //     { role: 'system', content: 'You are a helpful learning advisor...' },
    //     { role: 'user', content: prompt }
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 800,
    // })

    // TODO: Step 6 - Extract AI response
    // Get the text content from the completion
    // Hint: const aiResponse = completion.choices[0].message.content

    // TODO: Step 7 - Parse AI response
    // Extract and validate JSON from the AI response
    // Use parseSuggestions() helper function below
    // Hint: const suggestions = parseSuggestions(aiResponse || '')

    // TODO: Step 8 - Store in database
    // Save the suggestions to the profile_suggestions table
    // Include user_id, suggestions, and input_data
    // Hint: await supabase.from('profile_suggestions').insert({
    //   user_id: user.id,
    //   suggestions,
    //   input_data: validated,
    // })

    // TODO: Step 9 - Return success response
    // Return 200 with suggestions and metadata
    // Hint: return NextResponse.json({
    //   success: true,
    //   suggestions,
    //   metadata: { experienceLevel: validated.experienceLevel, timestamp: new Date().toISOString() }
    // })

    return NextResponse.json({ error: 'Not implemented yet' }, { status: 501 })
  } catch (error) {
    // TODO: Handle different types of errors

    // Validation errors (from Zod)
    // Return 400 Bad Request

    // OpenAI API errors (rate limit, API key, etc.)
    // Return 503 Service Unavailable

    // Database errors
    // Return 500 Internal Server Error

    console.error('Profile suggestions error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}

/**
 * HELPER FUNCTION: Build AI Prompt
 *
 * TODO: Implement this function to create a personalized prompt
 *
 * The prompt should:
 * 1. Include the user's experience level
 * 2. Include their background
 * 3. Include their goals (if provided)
 * 4. Ask for 3-5 specific suggestions
 * 5. Request JSON format for easy parsing
 *
 * Each suggestion should have:
 * - title: Name of the skill/area
 * - reason: Why it's relevant to their background
 * - action: Concrete step they can take this week
 */
function buildProfileSuggestionPrompt(data: {
  userBackground: string
  currentGoals?: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
}): string {
  // TODO: Build the prompt string
  // Example structure:
  // "I'm a [level] software engineer who wants to improve.
  //  Background: [background]
  //  Goals: [goals]
  //  Please suggest 3-5 specific things to focus on..."

  return `
TODO: Build personalized prompt here

Include:
- Experience level: ${data.experienceLevel}
- Background: ${data.userBackground}
- Goals: ${data.currentGoals || 'Not specified'}

Ask for JSON response with structure:
{
  "suggestions": [
    {
      "title": "Skill name",
      "reason": "Why this matters",
      "action": "Specific next step"
    }
  ]
}
`.trim()
}

/**
 * HELPER FUNCTION: Parse AI Response
 *
 * TODO: Implement this function to extract suggestions from AI response
 *
 * The AI might return:
 * - Clean JSON (best case)
 * - JSON wrapped in markdown code blocks
 * - JSON with extra text before/after
 * - Invalid JSON (worst case - need fallback)
 *
 * Handle all cases gracefully!
 */
function parseSuggestions(rawResponse: string): Suggestion[] {
  try {
    // TODO: Extract JSON from response
    // Hint: Use regex to find JSON object: const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)

    // TODO: Parse JSON
    // Hint: const parsed = JSON.parse(jsonMatch[0])

    // TODO: Validate structure with aiResponseSchema
    // Hint: const validated = aiResponseSchema.parse(parsed)

    // TODO: Return suggestions array
    // Hint: return validated.suggestions

    // Temporary fallback - replace with actual implementation
    return [
      {
        title: 'Start with Fundamentals',
        reason: 'Building a strong foundation is crucial for long-term growth',
        action: 'Complete one online tutorial on core programming concepts this week',
      },
    ]
  } catch (error) {
    // TODO: Handle parsing errors
    // Log the error and return fallback suggestions

    console.error('Failed to parse AI response:', error)

    // Return generic fallback suggestion
    return [
      {
        title: 'Start with Fundamentals',
        reason: 'Building a strong foundation is crucial for long-term growth',
        action: 'Complete one online tutorial on core programming concepts this week',
      },
    ]
  }
}

/**
 * IMPLEMENTATION STEPS:
 *
 * Step 1: Input Validation
 * ────────────────────────
 * const body = await req.json()
 * const validated = validate(aiPromptSchema, body)
 * // Now you have type-safe: { userBackground, currentGoals?, experienceLevel }
 *
 * Step 2: Authentication
 * ────────────────────────
 * const supabase = createServiceClient()
 * const { data: { user }, error } = await supabase.auth.getUser()
 * if (error || !user) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 * }
 *
 * Step 3: Build Prompt
 * ────────────────────────
 * const prompt = buildProfileSuggestionPrompt(validated)
 *
 * Step 4: Call OpenAI
 * ────────────────────────
 * const completion = await openai.chat.completions.create({
 *   model: 'gpt-4',
 *   messages: [
 *     {
 *       role: 'system',
 *       content: 'You are a helpful learning advisor for software engineers.'
 *     },
 *     { role: 'user', content: prompt }
 *   ],
 *   temperature: 0.7,
 *   max_tokens: 800,
 * })
 *
 * Step 5: Parse Response
 * ────────────────────────
 * const aiResponse = completion.choices[0].message.content
 * const suggestions = parseSuggestions(aiResponse || '')
 *
 * Step 6: Store in Database
 * ────────────────────────
 * await supabase.from('profile_suggestions').insert({
 *   user_id: user.id,
 *   suggestions,
 *   input_data: validated,
 * })
 *
 * Step 7: Return Response
 * ────────────────────────
 * return NextResponse.json({
 *   success: true,
 *   suggestions,
 *   metadata: {
 *     experienceLevel: validated.experienceLevel,
 *     timestamp: new Date().toISOString(),
 *   },
 * })
 */

/**
 * PROMPT ENGINEERING TIPS:
 *
 * 1. Be specific about format:
 *    "Return ONLY valid JSON, no markdown or explanations"
 *
 * 2. Provide examples in the prompt:
 *    "Example: { title: 'Learn React', reason: '...', action: '...' }"
 *
 * 3. Set expectations:
 *    "Provide 3-5 suggestions, each with title, reason, and action"
 *
 * 4. Use the user's context:
 *    "Based on their [level] experience and background as [background]..."
 *
 * 5. Request actionable advice:
 *    "Each action should be specific and achievable in one week"
 */

/**
 * COMMON MISTAKES TO AVOID:
 *
 * ❌ Not validating AI response (trust but verify!)
 * ❌ Not handling JSON parsing errors
 * ❌ Forgetting to authenticate user
 * ❌ Not storing suggestions in database
 * ❌ Exposing OpenAI API key to frontend
 * ❌ Not providing fallback suggestions
 * ❌ Returning raw AI errors to users
 */

/**
 * TESTING CHECKLIST:
 *
 * 1. Valid request (authenticated user):
 *    POST /api/profile/suggestions
 *    Headers: { Authorization: Bearer <token> }
 *    Body: {
 *      "userBackground": "I'm a career changer with 6 months of JavaScript",
 *      "currentGoals": "Become a full-stack developer",
 *      "experienceLevel": "beginner"
 *    }
 *    Expected: 200, array of 3-5 suggestions
 *
 * 2. Unauthenticated request:
 *    Expected: 401 Unauthorized
 *
 * 3. Invalid input (too short background):
 *    Body: { "userBackground": "short", "experienceLevel": "beginner" }
 *    Expected: 400, validation error
 *
 * 4. Missing OpenAI API key:
 *    Expected: 503, service unavailable
 *
 * 5. Database connection failure:
 *    Expected: 500, internal server error
 */

/**
 * COST CONSIDERATIONS:
 *
 * Each request costs approximately:
 * - GPT-4: ~$0.03 per request
 * - GPT-3.5-turbo: ~$0.002 per request
 *
 * For 1000 users/month:
 * - GPT-4: ~$30/month
 * - GPT-3.5-turbo: ~$2/month
 *
 * Optimization strategies:
 * 1. Rate limit: 1 request per user per day
 * 2. Cache similar backgrounds/suggestions
 * 3. Use GPT-3.5-turbo for simple cases
 * 4. Implement request queue for high traffic
 */

/**
 * SUCCESS CRITERIA:
 * ✅ User is authenticated before processing
 * ✅ Input is validated with Zod
 * ✅ AI prompt is personalized to user
 * ✅ AI response is parsed and validated
 * ✅ Suggestions are stored in database
 * ✅ Response includes 3-5 quality suggestions
 * ✅ Errors are handled gracefully
 * ✅ Fallback suggestions provided if AI fails
 */

/**
 * USAGE IN FRONTEND:
 *
 * const getSuggestions = async (data) => {
 *   try {
 *     const response = await fetch('/api/profile/suggestions', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(data),
 *     })
 *
 *     if (!response.ok) {
 *       throw new Error('Failed to get suggestions')
 *     }
 *
 *     const result = await response.json()
 *     return result.suggestions
 *   } catch (error) {
 *     console.error('Error getting suggestions:', error)
 *     throw error
 *   }
 * }
 */
