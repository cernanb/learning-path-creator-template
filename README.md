# Learning Path Creator

A production-ready full-stack TypeScript template.

## 🎯 What's Included

This starter template provides a complete development environment with best practices baked in:

- **Frontend:** Next.js 16 with App Router, React 19, TypeScript
- **Backend:** Next.js API routes with type-safe endpoints
- **Database:** Supabase (Postgres) with migrations and TypeScript types
- **AI Integration:** OpenAI SDK with streaming support
- **Authentication:** Supabase Auth (ready to customize)
- **Styling:** Tailwind CSS with pre-configured design system
- **Testing:** Jest + React Testing Library + Playwright
- **Code Quality:** ESLint, Prettier, Husky pre-commit hooks
- **Deployment:** Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ installed
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (optional for AI features)

### Initial Setup (5 minutes)

```bash
# 1. Clone this template
git clone <your-fork-url> my-feature-name
cd my-feature-name

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Edit .env.local with your credentials:
# - Supabase URL and anon key (from dashboard.supabase.com) or local CLI
# - OpenAI API key (from platform.openai.com)

# 4. Run database migrations
npm run db:migrate

# 5. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you should see the welcome page!

## 📁 Project Structure

```
learning-path-creator/
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── ai/              # AI feature endpoints
│   │   │   └── health/          # Health check
│   │   ├── (auth)/              # Auth-related pages
│   │   ├── (app)/               # Protected app pages
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/               # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── forms/               # Form components
│   │   └── layouts/             # Layout components
│   ├── lib/                      # Core utilities
│   │   ├── supabase/            # Database client & types
│   │   ├── openai/              # AI client & utilities
│   │   ├── validation/          # Zod schemas
│   │   └── utils/               # Helper functions
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles & Tailwind config
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests (Playwright)
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Seed data for development
├── docs/                         # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   └── deployment.md
└── scripts/                      # Utility scripts
    ├── setup-db.sh
    └── generate-types.sh
```

## 🏗️ Architecture Overview

### Frontend Architecture

- **App Router:** Leverages Next.js 14 server components for better performance
- **Client Components:** Marked with 'use client' only when necessary
- **State Management:** React Context for auth, local state for UI
- **Data Fetching:** Server actions for mutations, async components for reads

### Backend Architecture

- **API Routes:** Type-safe Next.js route handlers
- **Validation:** Zod schemas validate all input
- **Error Handling:** Centralized error handling middleware
- **Database:** Supabase client with auto-generated types

### Security Best Practices (Pre-configured)

- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ Rate limiting (ready to enable)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React escapes by default)

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run dev:db          # Start Supabase locally (optional)

# Building
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Database
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database (dev only!)
npm run db:seed         # Seed database with test data
npm run db:types        # Generate TypeScript types from schema
```

## 🎨 UI Component Library

This template includes pre-built, accessible components:

```typescript
import { Button, Input, Card, Modal } from '@/components/ui'

// Example usage
<Button variant="primary" size="lg">
  Click me
</Button>

<Input
  label="Email"
  type="email"
  error={errors.email?.message}
/>
```

See `src/components/ui/README.md` for full component docs.

## 🤖 AI Integration Guide

### Basic AI Completion

```typescript
import { openai } from '@/lib/openai'

// In an API route
export async function POST(req: Request) {
  const { prompt } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })

  return Response.json({ result: completion.choices[0].message.content })
}
```

### Streaming Responses

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

See `docs/ai-integration.md` for advanced patterns.

## 🗄️ Database Patterns

### Creating a Migration

```bash
# Generate a new migration file
npm run db:migration create_posts_table

# Edit the generated file in supabase/migrations/
# Then apply it:
npm run db:migrate
```

### Type-Safe Queries

```typescript
import { supabase } from '@/lib/supabase/client'

// TypeScript will autocomplete table names and columns!
const { data, error } = await supabase
  .from('users')
  .select('id, email, created_at')
  .eq('active', true)

// data is typed as Array<{ id: string, email: string, created_at: string }>
```

### Example: Creating a New Feature with Database

1. Create migration:

```sql
-- supabase/migrations/20240109_create_bookmarks.sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  created_at timestamptz default now()
);
```

2. Generate types:

```bash
npm run db:types
```

3. Use in your code:

```typescript
const { data } = await supabase.from('bookmarks').insert({ user_id: userId, url, title }).select()
```

## ✅ Testing Patterns

### Unit Tests (Jest + React Testing Library)

```typescript
// tests/unit/components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText("Click").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests (API Routes)

```typescript
// tests/integration/api/auth.test.ts
import { POST } from '@/app/api/auth/register/route'

describe('POST /api/auth/register', () => {
  it('creates a new user', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123!',
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(201)
  })
})
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and log in', async ({ page }) => {
  await page.goto('http://localhost:3000/signup')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'SecurePass123!')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

## 🚢 Deployment Guide

### Vercel (Recommended - 2 minutes)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Add environment variables from `.env.local`
4. Deploy!

Your app will be live at `https://your-project.vercel.app`

### Environment Variables for Production

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
```

## 📚 Learning Resources

### Key Concepts to Understand

- [ ] **Next.js App Router:** Server vs Client Components
- [ ] **TypeScript:** Types, Interfaces, Generics
- [ ] **React Hooks:** useState, useEffect, useContext, custom hooks
- [ ] **Async JavaScript:** Promises, async/await, error handling
- [ ] **REST APIs:** HTTP methods, status codes, request/response
- [ ] **SQL Basics:** SELECT, INSERT, UPDATE, DELETE, JOINs
- [ ] **Authentication:** JWTs, sessions, password hashing

### Recommended Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 🆘 Getting Help

### Common Issues & Solutions

**Issue:** "Module not found" error  
**Solution:** Run `npm install` to ensure all dependencies are installed

**Issue:** Database connection failed  
**Solution:** Check your `.env.local` has correct Supabase credentials

**Issue:** Type errors with Supabase  
**Solution:** Run `npm run db:types` to regenerate types from your schema

**Issue:** Tests failing  
**Solution:** Make sure test database is seeded: `npm run db:seed`

### Ask for Help

- **Slack:** #apprentice-engineering
- **Code Review:** Create a PR and tag @senior-engineer
- **Stuck for >30 minutes?** Ask for help! That's what we're here for.

## 🎯 Next Steps

Once you're comfortable with the basics, try:

1. **Add a new feature**
   - Create database migration
   - Build API endpoint
   - Create UI component
   - Write tests

2. **Integrate an AI feature**
   - Implement a chat interface
   - Add content generation
   - Build a recommendation system

3. **Improve the codebase**
   - Add more test coverage
   - Optimize performance
   - Improve accessibility
   - Enhance error handling

4. **Deploy to production**
   - Set up monitoring (Sentry)
   - Add analytics (Plausible/Vercel Analytics)
   - Set up CI/CD pipeline

## 📄 License

MIT - feel free to use this template for your projects!

---
