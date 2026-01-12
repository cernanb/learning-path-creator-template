# Authentication Implementation Guide

This guide will help you implement user authentication using Supabase Auth.

## 🎯 Overview

Authentication in this app uses Supabase Auth, which handles:

- Password hashing (bcrypt)
- Session management
- JWT tokens
- Email verification
- Password reset

You don't need to manually hash passwords or manage sessions - Supabase does it all!

---

## 📋 What You Need to Implement

### 1. Registration (Sign Up)

**File:** `src/app/api/auth/register/route.ts`

**Requirements:**

- Validate email and password with Zod
- Create user with Supabase Auth
- Return user data on success
- Handle errors appropriately

**Steps:**

```typescript
export async function POST(req: Request) {
  try {
    // 1. Parse request body
    const body = await req.json()

    // 2. Validate with registerSchema
    const validated = validate(registerSchema, body)
    // This gives you: { email, password, confirmPassword }
    // Passwords are already checked to match by Zod

    // 3. Get Supabase client
    const supabase = createServiceClient()

    // 4. Create user (Supabase hashes password automatically)
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
    })

    // 5. Handle errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 6. Return success
    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
```

**Common Mistakes:**

- ❌ Trying to hash the password yourself (Supabase does this)
- ❌ Not validating input before sending to Supabase
- ❌ Returning 200 when registration fails
- ❌ Not checking for existing users (Supabase returns error)

---

### 2. Login (Sign In)

**File:** `src/app/api/auth/login/route.ts`

**Requirements:**

- Validate email and password
- Authenticate with Supabase
- Return user data on success
- Use proper status codes (401 for invalid credentials)

**Steps:**

```typescript
export async function POST(req: Request) {
  try {
    // 1. Parse and validate
    const body = await req.json()
    const validated = validate(loginSchema, body)

    // 2. Get Supabase client
    const supabase = createServiceClient()

    // 3. Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    // 4. Handle authentication failure
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 } // Unauthorized
      )
    }

    // 5. Return success
    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (wrong credentials)
- `500` - Internal Server Error

---

### 3. Auth Hook (useAuth)

**File:** `src/hooks/useAuth.ts`

**Requirements:**

- Track current user state
- Provide sign in/up/out methods
- Listen for auth changes
- Handle loading and error states

**Key Implementation Points:**

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // 1. Get initial session on mount
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    initAuth()
  }, [supabase])

  // 2. Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // IMPORTANT: Clean up subscription!
    return () => subscription.unsubscribe()
  }, [supabase])

  // 3. Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setError(message)
      throw err
    }
  }

  // 4. Sign up method
  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      setError(message)
      throw err
    }
  }

  // 5. Sign out method
  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      setError(message)
      throw err
    }
  }

  return { user, loading, error, signIn, signUp, signOut }
}
```

**Why the Listener is Important:**

The auth state listener (`onAuthStateChange`) keeps your UI in sync when:

- User logs in/out in another tab
- Session expires
- User verifies their email
- Any other auth state change

**Common Mistakes:**

- ❌ Forgetting to unsubscribe (memory leak!)
- ❌ Not handling loading state (UI flashes)
- ❌ Setting loading=false before auth check completes

---

### 4. Login Form

**File:** `src/components/features/LoginForm.tsx`

**Requirements:**

- Email and password inputs
- Form validation
- Loading state during submission
- Error display
- Redirect on success

**Key Implementation:**

```typescript
export function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    // Submit
    setIsLoading(true)
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-600">{error}</div>}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

---

### 5. Register Form

**File:** `src/components/features/RegisterForm.tsx`

**Additional Requirements:**

- Password confirmation
- Password strength validation
- Real-time password requirements display

**Password Validation:**

```typescript
const validatePassword = (password: string): string[] => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('At least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('One number')
  }

  return errors
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrors({})

  // Validate password strength
  const passwordErrors = validatePassword(password)
  if (passwordErrors.length > 0) {
    setErrors({ password: passwordErrors.join(', ') })
    return
  }

  // Check passwords match
  if (password !== confirmPassword) {
    setErrors({ confirmPassword: 'Passwords do not match' })
    return
  }

  // Submit...
}
```

**Display Password Requirements:**

```typescript
const requirements = [
  { label: 'At least 8 characters', met: password.length >= 8 },
  { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
  { label: 'One lowercase letter', met: /[a-z]/.test(password) },
  { label: 'One number', met: /[0-9]/.test(password) },
]

return (
  <div className="text-sm text-gray-600">
    <p className="font-medium">Password must contain:</p>
    <ul className="mt-1 space-y-1">
      {requirements.map((req, i) => (
        <li
          key={i}
          className={req.met ? 'text-green-600' : 'text-gray-500'}
        >
          {req.met ? '✓' : '○'} {req.label}
        </li>
      ))}
    </ul>
  </div>
)
```

---

## 🔐 How Supabase Auth Works

### Session Management

After successful login, Supabase automatically:

1. Creates a session
2. Sets HTTP-only cookies
3. Returns access and refresh tokens
4. Handles token refresh automatically

You don't need to manually store tokens!

### Checking Auth in API Routes

```typescript
export async function POST(req: Request) {
  const supabase = createServiceClient()

  // Get current user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // User is authenticated, continue...
  console.log('User ID:', user.id)
  console.log('User email:', user.email)
}
```

### Protecting Pages

```typescript
// In a page component or middleware
import { getCurrentUser } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Welcome {user.email}</div>
}
```

---

## 🧪 Testing Your Implementation

### Manual Testing Checklist

**Registration:**

- [ ] Can create new account with valid email/password
- [ ] Cannot register with invalid email format
- [ ] Cannot register with weak password
- [ ] Cannot register with mismatched passwords
- [ ] Error message shown for duplicate email

**Login:**

- [ ] Can log in with valid credentials
- [ ] Cannot log in with wrong password
- [ ] Cannot log in with non-existent email
- [ ] Error message is user-friendly
- [ ] Redirects to dashboard on success

**Session Management:**

- [ ] User stays logged in after page refresh
- [ ] User can log out successfully
- [ ] Logging out in one tab logs out in all tabs
- [ ] Protected routes redirect to login when not authenticated

### API Testing (Thunder Client / Postman)

```bash
# Register
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}

# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

---

## 🐛 Troubleshooting

### "User already registered"

- User with that email already exists in Supabase
- Try a different email or check Supabase dashboard

### "Invalid login credentials"

- Wrong email or password
- Check Supabase dashboard to verify user exists
- Make sure you're not hashing the password (Supabase does this)

### Session not persisting

- Check that Supabase URL and anon key are correct
- Make sure cookies are enabled
- Check browser console for errors

### Auth listener not firing

- Make sure you're returning the cleanup function
- Check that subscription is actually created
- Verify Supabase client is initialized correctly

---

## ✅ Success Criteria

Your authentication is complete when:

- ✅ Users can register with email/password
- ✅ Users can log in with credentials
- ✅ Users can log out
- ✅ Sessions persist across page refreshes
- ✅ Protected routes redirect unauthenticated users
- ✅ Error messages are clear and helpful
- ✅ Loading states prevent duplicate submissions
- ✅ Password requirements are enforced
- ✅ All edge cases are handled

---

**Next Steps:** Once auth is working, move on to implementing the AI profile suggestions feature!
