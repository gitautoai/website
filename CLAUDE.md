# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note**: Update this file when you discover new user preferences during conversations.

## Development Commands

### Essential Commands

- `npm install` - Install dependencies (requires Node.js 22.x)
- `npm run dev` - Start development server on port 4000
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run Playwright E2E tests (uses port 4001)
- `npm run types:generate` - Generate TypeScript types from Supabase schema
- `npx tsc --noEmit` - Type-check ALL files including tests (use this to catch TypeScript errors)

### Database Access

```bash
# Connect to Supabase PostgreSQL database
source .env.local && psql "postgresql://postgres.dkrxtcbaqzrodvsagwwn:$SUPABASE_DB_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### Stripe CLI Commands (for local development)

- `stripe login` - Login to Stripe account
- `stripe listen --forward-to localhost:4000/api/stripe/webhook` - Forward webhook events to local server (dev port 4000)
- For E2E tests: `stripe listen --forward-to localhost:4001/api/stripe/webhook` - Forward to test server (port 4001)
- `stripe trigger payment_intent.succeeded` - Test webhook events locally

### Vercel Cron Jobs

Credit expiration is handled automatically via Vercel cron jobs:

- **Configuration**: `vercel.json` with daily schedule (00:00 UTC)
- **Endpoint**: `/api/cron/expire-credits`
- **Authentication**: Vercel's built-in headers (`x-vercel-cron: 1`)
- **Monitoring**: View execution logs in Vercel dashboard

### Running Individual Tests

```bash
# Jest specific test file
npx jest path/to/test/file.test.ts

# Playwright specific test
npx playwright test e2e/website-accessibility.spec.ts
```

## Testing Guidelines

### Critical Testing Rule

**NEVER accept partial test passes.** All tests must pass 100%. There is no "mostly passed" or "core things passed" - either all tests pass or the implementation is incomplete and must be fixed.

**STRICTLY PROHIBITED:** It is NEVER ALLOWED to skip failed tests or proceed with LGTM when any test is failing. Every single test failure must be investigated and fixed. No exceptions.

### Test Debugging Rule

When tests fail: Don't assume or explain - debug systematically. Check error logs, examine the failing test code, and identify the root cause before making conclusions.

Check screenshots first: When a test failure includes a screenshot, ALWAYS examine it first before proposing solutions. Don't assume API endpoints exist - verify the actual implementation.

### Unit Test Location

- Place unit test files next to their source files (not in separate `__tests__` directories)
- Use `.test.ts` suffix for unit tests
- Example: `add-credits.ts` → `add-credits.test.ts` in the same directory

### Test Structure

- **Unit tests**: Mock external dependencies (Supabase, Stripe, etc.)
- **E2E tests**:
  - Use real database and API calls for the functionality being tested
  - Authentication can be mocked if the test focus is not on authentication itself
  - Example: In credit system tests, mock auth APIs but use real Stripe/Supabase for credit operations
  - **IMPORTANT**: Each test should use unique owner/customer IDs with proper cleanup
  - Use helper functions from `e2e/helpers/` for creating test data:
    - `createTestOwner()` for creating test owners with automatic cleanup
    - `createTestCustomer()` for creating test Stripe customers
    - Always call cleanup functions in `finally` blocks
  - For Stripe webhook testing, use `stripe trigger payment_intent.succeeded` with metadata
- Test success and error scenarios
- Use descriptive test names that explain the behavior being tested

## Architecture Overview

This is a Next.js 15 application using App Router for GitAuto - a SaaS platform for automated test generation with GitHub/Jira integration.

### Tech Stack

- **Framework**: Next.js 15.3.0 with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js with GitHub OAuth
- **Payments**: Stripe
- **State**: React Context + SWR for data fetching

### Key Architectural Patterns

1. **API Routes Organization** (`/app/api/`):

   - `/auth/[...nextauth]` - Authentication handling
   - `/github/*` - GitHub App integration (issues, repos, branches)
   - `/stripe/*` - Subscription management
   - `/jira/*` - Jira OAuth and project linking
   - `/supabase/*` - Database operations

2. **Context Architecture**:

   - `AccountContext` - Global user/installation state, repository selection
   - Authentication flows through NextAuth session provider
   - PostHog analytics wrapper

3. **Database Schema** (key tables):

   - `users` - GitHub users
   - `installations` - GitHub App installations
   - `repositories` - Repository configurations and rules
   - `coverages` - File-level test coverage data
   - `issues` - Created GitHub issues tracking
   - `oauth_tokens` - Third-party integrations

4. **External Service Integration**:

   - **GitHub**: Octokit with App authentication, GraphQL for issue creation
   - **Stripe**: Customer portal, checkout sessions, webhook handling
   - **AWS**: EventBridge Scheduler for cron triggers
   - **Jira**: OAuth 2.0 flow with token refresh

5. **Server Actions**: Database operations use Next.js server actions in `/app/actions/`

### Important Considerations

- All API routes require JWT authentication except public endpoints
- GitHub App installations support multiple per user
- Subscription status determines feature access
- Coverage data flows: GitHub → Database → Dashboard → Issue Creation
- Type safety enforced with generated Supabase types
- Development server runs on port 4000 (not default 3000)

### Payment System Migration

- **Dual system in operation**: Both subscription-based (legacy) and credit-based (new) payment systems are active
- **Legacy customers**: Existing paying customers still have monthly/yearly Stripe subscriptions
- **New system**: New customers use credit-based system ($2 per PR, auto-reload, etc.)
- **Do not remove subscription code**: Billing period and subscription functionality must be maintained for existing customers

### Database Design Rules

- **Always use UUID for primary keys** - Avoids sequence permission issues with service role
- **Use `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`** instead of `BIGSERIAL`

### Supabase Permissions (if needed)

```sql
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
```

## Special Commands

### LGTM Command

**CRITICAL**: Never proceed with git add/commit/push unless ALL tests pass 100%. There is no "mostly passed" - either all tests pass or the task is incomplete.

**EXCEPTION**: For blog-only changes (adding/editing blog posts in `app/blog/posts/`), tests can be skipped since blog content doesn't affect application functionality.

When the user says "LGTM", execute these commands in order:

1. `npm run types:generate` - Generate TypeScript types
2. `npm run lint` - Run linting
3. `npx tsc --noEmit` - Type-check ALL files including tests (use this to catch TypeScript errors)
4. `npm test` - Run unit tests (must pass 100%, skip for blog-only changes)
5. `npm run test:e2e` - Run E2E tests (must pass 100%, skip for blog-only changes)
6. `npm run build` - Build the project
7. **STOP if any test fails** - Fix all failures before proceeding (unless blog-only)
8. `git fetch origin main && git merge origin/main` - Pull and merge latest main branch changes
9. `git add .` - Stage all changes (only if ALL tests passed or blog-only)
10. Create a descriptive commit message based on changes (do NOT include Claude Code attribution)
11. `git push` - Push to remote

## TypeScript Error Checking Rule

**CRITICAL**: Always use BOTH commands to check for TypeScript errors:

1. `npx tsc --noEmit` - Checks ALL files including test files
2. `npm run build` - Checks only production code

Never rely on `npm run build` alone as it ignores test files. All TypeScript errors must be fixed before considering any task complete.

## Code Style Preferences

### General Principles

- **Functions over classes** - Always prefer functional programming over OOP classes
- **Arrow functions** - Prefer arrow functions over regular function declarations
- **Minimal syntax** - Remove {} brackets for single-line if statements and single-expression arrow functions
- **Single responsibility** - One file, one function, one responsibility where possible
- **Type safety** - Use Supabase generated types whenever possible
- **Avoid any** - Never use `any` type, always use proper TypeScript types
- **NEVER use `as any`** - Never use `as any` type assertions, always use proper type guards or interfaces
- **Avoid non-null assertions** - Never use `!` operator; instead use proper type guards or extract to variables after validation
- **Solve problems fundamentally** - Never work around issues with hacks or type assertions; always find and fix the root cause. If TypeScript complains, understand why and fix the underlying issue properly
- **Best practices first** - Prioritize modern best practices over existing codebase patterns when they conflict
- **Explain reasoning** - Always explain WHY you chose a specific approach/solution over alternatives (e.g., "I used useMemo here instead of useCallback because we're memoizing a computed value, not a function" or "I chose Map over Object because we need insertion order preservation") outside of the code change suggestions. Do not include this in the code change suggestions.
- **Critical thinking over blind imitation** - SUPER IMPORTANT: Don't just copy existing patterns. Think deeply about what the correct approach should be based on best practices, then consider how the codebase currently does it. Make reasoned decisions rather than blindly following existing code, especially when you spot inconsistencies or anti-patterns.

### File Naming Conventions

- **Files/folders**: `kebab-case` (e.g., `add-credits.ts`, `/api/user-profile/`)
- **Functions/variables**: `camelCase` (e.g., `addCredits`, `userName`)
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`)

### Quality Priorities (in order of importance)

1. **Performance** - Most critical consideration
2. **Security** - Always validate inputs and protect sensitive data
3. **SEO** - Consider meta tags, semantic HTML, and Core Web Vitals

### Code Examples

```typescript
// Preferred: Arrow function without {} for single expression
export const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0)

// Preferred: No brackets for single line if
if (isValid) return true

// Preferred: Single responsibility file
// File: formatCurrency.ts
export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(amount)

// React component with implicit return
export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick} className="btn">
    {children}
  </button>
)

// Using Supabase types
import { Database } from '@/types/supabase'
type User = Database['public']['Tables']['users']['Row']

export const getUserName = (user: User) => user.name || 'Anonymous'

// Avoid any - use proper types
// Bad: const processData = (data: any) => data.value
// Good: const processData = (data: { value: string }) => data.value
```
