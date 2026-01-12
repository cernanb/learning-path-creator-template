// src/components/features/ProfileSuggestions.tsx
'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'

/**
 * ProfileSuggestions Component
 *
 * TODO: Build the AI profile suggestions feature
 *
 * This component demonstrates AI integration in a real-world use case:
 * After a user signs up, we help them set up their profile by providing
 * personalized learning recommendations based on their background.
 *
 * Requirements:
 * 1. Form with: background (textarea), goals (textarea), experience level (buttons)
 * 2. Submit form to POST /api/profile/suggestions
 * 3. Show loading state while waiting for AI (3-5 seconds)
 * 4. Display suggestions in cards when received
 * 5. Handle errors gracefully with user-friendly messages
 *
 * Learning Objectives:
 * - Form state management with multiple fields
 * - API calls to AI endpoints
 * - Handling async loading states
 * - Displaying structured data from AI
 * - Error handling with good UX
 */

interface Suggestion {
  title: string
  reason: string
  action: string
}

interface ProfileSuggestionsResponse {
  success: boolean
  suggestions: Suggestion[]
  metadata: {
    experienceLevel: string
    timestamp: string
  }
}

export function ProfileSuggestions() {
  // TODO: Add state for form fields
  // You need: userBackground (string), currentGoals (string), experienceLevel (enum)
  // Hint: const [userBackground, setUserBackground] = useState('')

  // TODO: Add state for suggestions array
  // Hint: const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  // TODO: Add loading and error states
  // Hint: const [isLoading, setIsLoading] = useState(false)
  //       const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement form submission
    // Step 1: Validate input (at least 10 chars for background)
    // Step 2: Set loading to true, clear errors
    // Step 3: Call API with fetch()
    // Step 4: Handle response (set suggestions or error)
    // Step 5: Set loading to false

    console.log('TODO: Implement form submission')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Let&apos;s Personalize Your Learning Journey
        </h2>
        <p className="mt-2 text-gray-600">
          Tell us about yourself, and we&apos;ll suggest the best next steps for your growth
        </p>
      </div>

      {/* TODO: Build the form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TODO: Experience level selector */}
        {/* 3 buttons: beginner, intermediate, advanced */}
        {/* Highlight the selected one */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            What&apos;s your experience level?
          </label>
          {/* TODO: Add experience level buttons */}
        </div>

        {/* TODO: Background textarea */}
        <div>
          <label htmlFor="background" className="mb-2 block text-sm font-medium text-gray-700">
            Tell us about your background <span className="text-red-500">*</span>
          </label>
          {/* TODO: Add textarea for background */}
          {/* Placeholder: "e.g., I'm a career changer from marketing..." */}
          {/* rows={4} */}
        </div>

        {/* TODO: Goals textarea (optional) */}
        <div>
          <label htmlFor="goals" className="mb-2 block text-sm font-medium text-gray-700">
            What are your current goals? (optional)
          </label>
          {/* TODO: Add textarea for goals */}
          {/* Placeholder: "e.g., I want to become a full-stack developer..." */}
          {/* rows={3} */}
        </div>

        {/* TODO: Submit button */}
        {/* Use the Button component with isLoading prop */}
        {/* Disable if background is too short */}
      </form>

      {/* TODO: Error state */}
      {/* Show red alert box if error exists */}

      {/* TODO: Success state - Display suggestions */}
      {/* Map over suggestions array and render SuggestionCard for each */}

      {/* TODO: Empty state (before submission) */}
      {/* Show an example suggestion card with isExample prop */}
    </div>
  )
}

/**
 * SuggestionCard Component
 *
 * TODO: Build individual suggestion display card
 */
interface SuggestionCardProps {
  suggestion: Suggestion
  index: number
  isExample?: boolean
}

function SuggestionCard({ suggestion, index, isExample = false }: SuggestionCardProps) {
  return (
    <div
      className={`rounded-lg border-2 p-5 transition-shadow hover:shadow-md ${
        isExample ? 'border-gray-300 bg-white opacity-60' : 'border-gray-200 bg-white'
      }`}
    >
      {/* TODO: Card header with number badge and title */}
      <div className="mb-3 flex items-start gap-3">
        {/* TODO: Number badge (circular, blue background) */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {index + 1}
        </div>
        {/* TODO: Title */}
        <h4 className="text-lg font-semibold text-gray-900">{suggestion.title}</h4>
      </div>

      {/* TODO: Reason section */}
      <div className="ml-11 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Why this matters:</p>
          <p className="mt-1 text-sm text-gray-700">{suggestion.reason}</p>
        </div>

        {/* TODO: Action section */}
        <div>
          <p className="text-sm font-medium text-gray-500">Action to take this week:</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{suggestion.action}</p>
        </div>
      </div>

      {/* TODO: Optional "Mark as completed" button (not for examples) */}
      {!isExample && (
        <div className="mt-4 ml-11">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Mark as completed →
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * IMPLEMENTATION HINTS:
 *
 * State Management:
 * ────────────────
 * const [userBackground, setUserBackground] = useState('')
 * const [currentGoals, setCurrentGoals] = useState('')
 * const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
 * const [suggestions, setSuggestions] = useState<Suggestion[]>([])
 * const [isLoading, setIsLoading] = useState(false)
 * const [error, setError] = useState<string | null>(null)
 *
 * Form Submission:
 * ────────────────
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault()
 *
 *   if (userBackground.length < 10) {
 *     setError('Please provide more details (at least 10 characters)')
 *     return
 *   }
 *
 *   setIsLoading(true)
 *   setError(null)
 *
 *   try {
 *     const response = await fetch('/api/profile/suggestions', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ userBackground, currentGoals, experienceLevel }),
 *     })
 *
 *     if (!response.ok) throw new Error('Failed to get suggestions')
 *
 *     const data: ProfileSuggestionsResponse = await response.json()
 *     setSuggestions(data.suggestions)
 *   } catch (err) {
 *     setError(err instanceof Error ? err.message : 'Something went wrong')
 *   } finally {
 *     setIsLoading(false)
 *   }
 * }
 *
 * Experience Level Buttons:
 * ────────────────────────
 * {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
 *   <button
 *     key={level}
 *     type="button"
 *     onClick={() => setExperienceLevel(level)}
 *     className={`flex-1 rounded-lg border-2 px-4 py-3 ${
 *       experienceLevel === level
 *         ? 'border-blue-600 bg-blue-50 text-blue-700'
 *         : 'border-gray-300 bg-white text-gray-700'
 *     }`}
 *   >
 *     {level.charAt(0).toUpperCase() + level.slice(1)}
 *   </button>
 * ))}
 */

/**
 * SUCCESS CRITERIA:
 * ✅ Form collects all required data
 * ✅ Experience level buttons work and show selected state
 * ✅ Submit button disabled when background too short
 * ✅ Loading spinner shows while waiting for AI
 * ✅ Error messages displayed in red alert box
 * ✅ Suggestions displayed in clean cards
 * ✅ Example suggestion shown before submission
 */
