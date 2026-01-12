# AI Integration Guide

This guide will help you implement the AI-powered profile suggestions feature using OpenAI's GPT-4.

## 🎯 Overview

The profile suggestions feature uses AI to provide personalized learning recommendations based on a user's background, goals, and experience level.

**User Flow:**

1. User fills out form (background, goals, experience level)
2. Submit to `/api/profile/suggestions`
3. AI generates 3-5 personalized suggestions
4. Display suggestions to user
5. Store in database for future reference

---

## 📋 What You Need to Implement

### 1. API Endpoint

**File:** `src/app/api/profile/suggestions/route.ts`

**Requirements:**

- Authenticate user
- Validate input
- Build AI prompt
- Call OpenAI API
- Parse AI response
- Store in database
- Return suggestions

---

## 🔨 Step-by-Step Implementation

### Step 1: Authenticate & Validate

```typescript
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json()

    // Validate input
    const validated = validate(aiPromptSchema, body)
    // validated has: { userBackground, currentGoals?, experienceLevel }

    // Authenticate user
    const supabase = createServiceClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Continue with AI call...
  } catch (error) {
    // Handle errors...
  }
}
```

---

### Step 2: Build the AI Prompt

**This is the most important part!** The prompt determines the quality of suggestions.

```typescript
function buildProfileSuggestionPrompt(data: {
  userBackground: string
  currentGoals?: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
}): string {
  return `
I'm a ${data.experienceLevel} software engineer who wants to improve my skills.

Background: ${data.userBackground}
${data.currentGoals ? `Current Goals: ${data.currentGoals}` : ''}

Based on this information, suggest 3-5 specific things I should focus on to grow as a developer.

For each suggestion, provide:
1. Title: Name of the skill or area
2. Reason: Why it's relevant to my specific background
3. Action: One concrete step I can take THIS WEEK

IMPORTANT: Return ONLY valid JSON in this exact format, with no markdown or extra text:

{
  "suggestions": [
    {
      "title": "Skill name",
      "reason": "Why this matters for your background",
      "action": "Specific action you can take this week"
    }
  ]
}
`.trim()
}
```

**Prompt Engineering Tips:**

✅ **Be specific about format**

- "Return ONLY valid JSON"
- "No markdown or explanations"

✅ **Use user's context**

- Include their experience level
- Reference their background
- Consider their goals

✅ **Request actionable advice**

- "One concrete step"
- "THIS WEEK"
- Be specific, not vague

✅ **Provide structure**

- Show exact JSON format
- Give example if needed

---

### Step 3: Call OpenAI API

```typescript
// Build the prompt
const prompt = buildProfileSuggestionPrompt(validated)

// Call OpenAI
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful learning advisor for software engineers. You provide practical, actionable advice based on their experience level and goals.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ],
  temperature: 0.7, // Balance creativity with consistency
  max_tokens: 800, // Enough for 5 suggestions
})

// Extract response
const aiResponse = completion.choices[0].message.content
```

**Model Selection:**

- **GPT-4**: Higher quality, better instruction following (~$0.03/request)
- **GPT-3.5-turbo**: Faster, cheaper, still good (~$0.002/request)

**Temperature:**

- `0.0-0.3`: Very consistent, less creative
- `0.4-0.7`: Balanced (recommended)
- `0.8-1.0`: More creative, less consistent

---

### Step 4: Parse AI Response

AI responses can be messy! Handle different cases:

````typescript
function parseSuggestions(rawResponse: string): Suggestion[] {
  try {
    // Remove markdown code blocks if present
    let cleaned = rawResponse.trim()

    // Remove ```json and ``` if they exist
    cleaned = cleaned.replace(/```json\n?/g, '')
    cleaned = cleaned.replace(/```\n?/g, '')

    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    // Parse JSON
    const parsed = JSON.parse(jsonMatch[0])

    // Validate structure with Zod
    const validated = aiResponseSchema.parse(parsed)

    return validated.suggestions
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Raw response:', rawResponse)

    // Return fallback suggestions
    return [
      {
        title: 'Start with Fundamentals',
        reason: 'Building a strong foundation is crucial for long-term growth as a developer.',
        action: 'Complete one online tutorial on core programming concepts this week.',
      },
    ]
  }
}
````

**Why Fallback Suggestions?**

- AI might return invalid JSON
- API might fail
- Better UX than showing an error

---

### Step 5: Store in Database

```typescript
// Parse suggestions
const suggestions = parseSuggestions(aiResponse || '')

// Store in database
const { error: dbError } = await supabase.from('profile_suggestions').insert({
  user_id: user.id,
  suggestions: suggestions, // JSONB column
  input_data: validated, // Store what generated these
})

if (dbError) {
  console.error('Database error:', dbError)
  // Continue anyway - don't fail just because storage failed
}
```

---

### Step 6: Return Response

```typescript
// Return success response
return NextResponse.json({
  success: true,
  suggestions,
  metadata: {
    experienceLevel: validated.experienceLevel,
    timestamp: new Date().toISOString(),
  },
})
```

---

## 🎨 Frontend Component

**File:** `src/components/features/ProfileSuggestions.tsx`

### State Management

```typescript
const [userBackground, setUserBackground] = useState('')
const [currentGoals, setCurrentGoals] = useState('')
const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
  'beginner'
)
const [suggestions, setSuggestions] = useState<Suggestion[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

### Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validate
  if (userBackground.length < 10) {
    setError('Please provide more details (at least 10 characters)')
    return
  }

  setIsLoading(true)
  setError(null)
  setSuggestions([])

  try {
    const response = await fetch('/api/profile/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userBackground,
        currentGoals: currentGoals || undefined,
        experienceLevel,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to get suggestions')
    }

    const data = await response.json()
    setSuggestions(data.suggestions)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    setIsLoading(false)
  }
}
```

### Display Suggestions

```typescript
{suggestions.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Your Personalized Suggestions</h3>

    {suggestions.map((suggestion, index) => (
      <div key={index} className="rounded-lg border-2 border-gray-200 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-semibold text-blue-700">
              {index + 1}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold">{suggestion.title}</h4>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Why:</strong> {suggestion.reason}
            </p>
            <p className="mt-2 text-sm font-medium">
              <strong>Action:</strong> {suggestion.action}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
```

---

## 💰 Cost Management

### Current Costs (as of 2024)

**GPT-4:**

- Input: ~$0.03 per 1K tokens
- Output: ~$0.06 per 1K tokens
- Average request: ~$0.03

**GPT-3.5-turbo:**

- Input: ~$0.0005 per 1K tokens
- Output: ~$0.0015 per 1K tokens
- Average request: ~$0.002

### Cost Optimization Strategies

**1. Rate Limiting**

```typescript
// Only allow 1 suggestion per user per day
const { data: recentSuggestion } = await supabase
  .from('profile_suggestions')
  .select('created_at')
  .eq('user_id', user.id)
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  .limit(1)
  .single()

if (recentSuggestion) {
  return NextResponse.json({ error: 'You can only get suggestions once per day' }, { status: 429 })
}
```

**2. Caching Similar Requests**

```typescript
// Check if similar suggestions exist
const { data: cachedSuggestions } = await supabase
  .from('profile_suggestions')
  .select('suggestions')
  .eq('input_data->experienceLevel', validated.experienceLevel)
  .ilike('input_data->userBackground', `%${firstFewWords}%`)
  .limit(1)
  .single()

if (cachedSuggestions) {
  return NextResponse.json({
    success: true,
    suggestions: cachedSuggestions.suggestions,
    cached: true,
  })
}
```

**3. Use GPT-3.5 for Simple Cases**

```typescript
const model =
  validated.userBackground.length < 100
    ? 'gpt-3.5-turbo' // Simple case
    : 'gpt-4' // Complex case
```

---

## 🐛 Troubleshooting

### "OpenAI API key not configured"

✅ Check `.env.local` has `OPENAI_API_KEY=sk-...`
✅ Restart dev server after adding env vars

### AI returns invalid JSON

✅ Check your prompt clearly requests JSON format
✅ Review the `parseSuggestions()` function
✅ Look at console logs to see raw response
✅ Fallback suggestions should still work

### Suggestions are generic/low quality

✅ Improve your prompt with more context
✅ Lower temperature (0.5 instead of 0.7)
✅ Add examples to your system message
✅ Use GPT-4 instead of GPT-3.5

### Request times out

✅ Increase `max_tokens` if responses are cut off
✅ Decrease `max_tokens` if too slow
✅ Consider streaming responses (advanced)

---

## 🧪 Testing

### Manual Testing

```bash
# Start server
npm run dev

# Test the endpoint directly
curl -X POST http://localhost:3000/api/profile/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "userBackground": "I am a career changer from marketing with 6 months of JavaScript experience",
    "currentGoals": "Become a full-stack developer",
    "experienceLevel": "beginner"
  }'
```

### Test Cases

- [ ] Valid input returns 3-5 suggestions
- [ ] Each suggestion has title, reason, action
- [ ] Suggestions are personalized to background
- [ ] Invalid input returns 400 error
- [ ] Unauthenticated request returns 401
- [ ] Suggestions stored in database
- [ ] Fallback suggestions work when AI fails

---

## ✅ Success Criteria

Your AI integration is complete when:

- ✅ Users can submit their background and get suggestions
- ✅ Suggestions are personalized and relevant
- ✅ AI responses are parsed correctly
- ✅ Fallback suggestions work if AI fails
- ✅ Suggestions stored in database
- ✅ Loading states show during AI processing
- ✅ Errors are handled gracefully
- ✅ Cost optimization strategies in place

---

## 🚀 Next Steps

### Future Enhancements

**1. Suggestion Tracking**

- Allow users to mark suggestions as completed
- Show completion percentage
- Generate new suggestions based on progress

**2. Conversation History**

- Remember previous suggestions
- Build on past recommendations
- Track learning journey over time

**3. Advanced AI Features**

- Use embeddings for semantic search
- Fine-tune model on your data
- Multi-turn conversations with context

---

**Congratulations!** You've now built a complete AI-powered feature from scratch! 🎉
