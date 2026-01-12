import { User } from '@supabase/supabase-js'
import { Tables, TablesInsert, TablesUpdate } from './supabase'

// Database row types
export type Profile = Tables<'profiles'>
export type ProfileSuggestionRow = Tables<'profile_suggestions'>
export type ProfileSuggestionInsert = TablesInsert<'profile_suggestions'>
export type ProfileSuggestionUpdate = TablesUpdate<'profile_suggestions'>

// Typed JSON field interfaces

/**
 * A single learning suggestion/resource
 */
export interface Suggestion {
  id: string
  title: string
  description: string
  type: 'course' | 'article' | 'video' | 'book' | 'project' | 'tutorial' | 'other'
  url?: string
  duration?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  provider?: string
}

/**
 * Input data used to generate suggestions
 */
export interface SuggestionInput {
  goals: string[]
  currentSkills?: string[]
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
  timeCommitment?: string
  preferredFormats?: ('course' | 'article' | 'video' | 'book' | 'project' | 'tutorial')[]
  additionalContext?: string
}

/**
 * Tracking for completed suggestions
 */
export interface CompletedSuggestion {
  suggestionId: string
  completedAt: string
  notes?: string
}

/**
 * Full profile suggestion with typed JSON fields
 */
export interface ProfileSuggestion extends Omit<
  ProfileSuggestionRow,
  'suggestions' | 'input_data' | 'completed_suggestions'
> {
  suggestions: Suggestion[]
  input_data: SuggestionInput
  completed_suggestions: CompletedSuggestion[] | null
}

/**
 * @deprecated Use ProfileSuggestionRow for raw database type or ProfileSuggestion for typed version
 */
export type ProfileSuggestionInput = TablesInsert<'profile_suggestions'>

export interface AuthUser {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
