import { CompletedSuggestion, ProfileSuggestion, Suggestion, SuggestionInput } from '@/types'
import { createBrowserClient } from '@supabase/ssr'
import { createClient as sbCreateClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client for use in React components (Client Components)
 * Automatically handles auth state and session management
 *
 * Usage in Client Components:
 *   'use client'
 *   const supabase = createClient()
 *   const { data } = await supabase.from('profiles').select('*')
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

/**
 * Server-side Supabase client with service role key
 * Use ONLY in API routes and Server Components
 * Has full database access - bypasses Row Level Security
 *
 * ⚠️ WARNING: Never use in Client Components - exposes service role key
 *
 * Usage in API routes:
 *   const supabase = createServiceClient()
 *   const { data } = await supabase.from('profiles').select('*')
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Check your .env.local file.')
  }

  return sbCreateClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Helper to get the current authenticated user
 * Works in both client and server contexts
 * Returns null if user is not authenticated
 *
 * Usage:
 *   const user = await getCurrentUser()
 *   if (!user) {
 *     redirect('/login')
 *   }
 */
export async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Type-safe query helpers
 * These provide autocomplete and type checking for common queries
 *
 * Usage:
 *   const profile = await queries.profiles.getById('user-id')
 *   const profiles = await queries.profiles.list()
 */
export const queries = {
  profiles: {
    /**
     * Get a single profile by user ID
     */
    getById: async (id: string) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()

      if (error) throw error
      return data
    },

    /**
     * Get current user's profile
     */
    getCurrent: async () => {
      const user = await getCurrentUser()
      if (!user) return null

      const supabase = createClient()
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (error) throw error
      return data
    },

    /**
     * Update current user's profile
     */
    update: async (updates: { full_name?: string; bio?: string }) => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    /**
     * List all profiles (paginated)
     */
    list: async (limit = 10, offset = 0) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data
    },
  },

  profileSuggestions: {
    /**
     * Get latest suggestions for current user
     */
    getLatest: async (): Promise<ProfileSuggestion | null> => {
      const user = await getCurrentUser()
      if (!user) return null

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (not an error)
        throw error
      }
      return data as ProfileSuggestion | null
    },

    /**
     * Get a specific suggestion by ID
     */
    getById: async (id: string): Promise<ProfileSuggestion | null> => {
      const user = await getCurrentUser()
      if (!user) return null

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }
      return data as ProfileSuggestion | null
    },

    /**
     * Get all suggestions for current user
     */
    getAll: async (): Promise<ProfileSuggestion[]> => {
      const user = await getCurrentUser()
      if (!user) return []

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data as ProfileSuggestion[]) || []
    },

    /**
     * Create new suggestions
     */
    create: async (
      suggestions: Suggestion[],
      inputData: SuggestionInput
    ): Promise<ProfileSuggestion> => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .insert({
          user_id: user.id,
          suggestions,
          input_data: inputData,
        })
        .select()
        .single()

      if (error) throw error
      return data as ProfileSuggestion
    },

    /**
     * Update suggestions
     */
    update: async (
      id: string,
      updates: {
        suggestions?: Suggestion[]
        rating?: number
        completed_suggestions?: CompletedSuggestion[]
      }
    ): Promise<ProfileSuggestion> => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as ProfileSuggestion
    },

    /**
     * Delete suggestions
     */
    delete: async (id: string): Promise<void> => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { error } = await supabase
        .from('profile_suggestions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },

    /**
     * Rate suggestions
     */
    rate: async (id: string, rating: number): Promise<ProfileSuggestion> => {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .update({ rating })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as ProfileSuggestion
    },

    /**
     * Mark a suggestion as complete
     */
    markComplete: async (
      id: string,
      suggestionId: string,
      notes?: string
    ): Promise<ProfileSuggestion> => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      // First get current completed suggestions
      const current = await queries.profileSuggestions.getById(id)
      if (!current) throw new Error('Suggestion not found')

      const completedSuggestions: CompletedSuggestion[] = current.completed_suggestions || []

      // Check if already completed
      if (completedSuggestions.some(c => c.suggestionId === suggestionId)) {
        return current
      }

      // Add new completion
      completedSuggestions.push({
        suggestionId,
        completedAt: new Date().toISOString(),
        notes,
      })

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .update({ completed_suggestions: completedSuggestions })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as ProfileSuggestion
    },

    /**
     * Mark suggestions as viewed
     */
    markViewed: async (id: string): Promise<ProfileSuggestion> => {
      const user = await getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error } = await supabase
        .from('profile_suggestions')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as ProfileSuggestion
    },
  },
}

/**
 * Example usage:
 *
 * // In a Client Component:
 * 'use client'
 * import { createClient, queries } from '@/lib/supabase/client'
 *
 * const profile = await queries.profiles.getCurrent()
 *
 * // In an API route:
 * import { createServiceClient } from '@/lib/supabase/client'
 *
 * const supabase = createServiceClient()
 * const { data } = await supabase.from('profiles').select('*')
 *
 * // Get current user:
 * import { getCurrentUser } from '@/lib/supabase/client'
 *
 * const user = await getCurrentUser()
 * if (!user) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 * }
 */
