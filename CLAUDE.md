# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note**: Update this file when you discover new user preferences during conversations.

## Development Commands

### Database Access

```bash
# Connect to Supabase PostgreSQL database (Development)
source .env.local && psql "postgresql://postgres.dkrxtcbaqzrodvsagwwn:$SUPABASE_DB_PASSWORD_DEV@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Connect to Supabase PostgreSQL database (Production)
# READ-ONLY access
source .env.local && psql "postgresql://postgres.awegqusxzsmlgxaxyyrq:$SUPABASE_DB_PASSWORD_PRD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

**CRITICAL**: Always test queries on production database before making changes

When investigating performance issues or timeouts:

1. **Test the actual query on production database first** using psql with `\timing` enabled
2. **Measure the actual execution time** - don't guess or assume what the problem is
3. **Only after confirming the root cause** should you make code changes
4. **Never make blind fixes** based on assumptions - always verify the problem first

Example workflow for investigating slow queries:

```bash
# Connect to production database
source .env.local && psql "postgresql://postgres.awegqusxzsmlgxaxyyrq:$SUPABASE_DB_PASSWORD_PRD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Enable timing
\timing

# Test the actual query
SELECT * FROM usage WHERE owner_name = 'Foxquilt' AND repo_name = 'foxden-policy-document-backend';

# Check row count
SELECT COUNT(*) FROM usage WHERE owner_name = 'Foxquilt' AND repo_name = 'foxden-policy-document-backend';
```

### Stripe CLI Commands (for local development)

- `stripe login` - Login to Stripe account
- `stripe listen --forward-to localhost:4000/api/stripe/webhook` - Forward webhook events to local server (dev port 4000)
- For E2E tests: `stripe listen --forward-to localhost:4000/api/stripe/webhook` - Forward to test server (port 4000)
- `stripe trigger payment_intent.succeeded` - Test webhook events locally

### Vercel Cron Jobs

Credit expiration is handled automatically via Vercel cron jobs:

- **Configuration**: `vercel.json` with daily schedule (00:00 UTC)
- **Endpoint**: `/api/cron/expire-credits`
- **Authentication**: Vercel's built-in headers (`x-vercel-cron: 1`)
- **Monitoring**: View execution logs in Vercel dashboard

### Accessing Vercel Production Logs

**IMPORTANT**: Vercel CLI logs are NOT useful for debugging runtime errors:

- `vercel logs` only shows real-time logs (waits for new logs, doesn't show historical)
- Runtime logs are only stored for ~1 hour maximum
- Build logs are available but don't contain runtime errors like 500s

**For debugging production runtime errors:**

1. **Use Vercel Dashboard Logs**: <https://vercel.com/gitauto/gitauto-website/logs> (manually search for errors)
2. **Use Sentry CLI** (see below for commands)
3. **Reproduce the error** to capture fresh logs
4. **Set up log drains** for persistent logging (external services)
5. **Add better error logging** to server actions/API routes

### Sentry Issue Investigation

Use the script at `scripts/sentry/get-issue.ts` to investigate Sentry issues:

```bash
# Get details for a specific issue (replace WEBSITE-2K with actual issue ID)
npx tsx scripts/sentry/get-issue.ts WEBSITE-2K
```

The script will:

- Display error message and exception details
- Show stack trace with file locations
- Save full JSON to `/tmp/sentry_<issue_id>.json` for detailed investigation

#### Required Environment Variables

Set these in `.env.local`:

- `SENTRY_PERSONAL_TOKEN`: Personal auth token (get from <https://gitauto-ai.sentry.io/settings/auth-tokens/>)
- `SENTRY_ORG_SLUG`: Organization slug (gitauto-ai)

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

This is a Next.js 16 application using App Router for GitAuto - a SaaS platform for automated unit test generation with GitHub/Jira integration.

### Tech Stack

- **Framework**: Next.js 16 with TypeScript
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
- **New system**: New customers use credit-based system ($7 per PR, auto-reload, etc.)
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

**CRITICAL**: Fix ALL errors and warnings before proceeding to the next step. Do not continue running commands if there are errors or warnings - fix them first. Moving on without fixing is a waste of time.

**EXCEPTION**: For blog-only changes (adding/editing blog posts in `app/blog/posts/`), tests can be skipped since blog content doesn't affect application functionality.

When the user says "LGTM", execute these commands in order:

1. `npm run types:generate` - Generate TypeScript types
2. `npm run lint` - Run linting. **Fix any errors/warnings before proceeding.**
3. `npx markdownlint-cli2 "**/*.md" "#node_modules" "#.next"` - Lint markdown files. **Fix any errors before proceeding.**
4. `npx tsc --noEmit` - Type-check ALL files including tests. **Fix any errors before proceeding.**
5. `npm test` - Run unit tests (must pass 100%, skip for blog-only changes). **Fix any failures before proceeding.**
6. `npm run build` - Build the project
7. **STOP if any step fails** - Fix all failures before proceeding (unless blog-only)
8. `git fetch origin main && git merge origin/main` - Pull and merge latest main branch changes
9. `git add <specific-file-paths>` - Stage specific changed files including updated/created test files (NEVER use `git add .`, always specify exact file paths)
10. Create a descriptive commit message based on changes (do NOT include Claude Code attribution, do NOT include `[skip ci]` as it skips CI)
11. `git push` - Push to remote
12. Create pull request: `gh pr create --title "PR title" --body "PR description" --assignee @me`
    - PR title should be technical and descriptive
    - **Do NOT include a `## Test plan` section** - it's unnecessary noise
    - **Social Media Post sections must always be the last sections in the PR body**
    - **Social Media Post sections**: Only include when there are explicit customer benefits or useful dev insights. Skip for internal-only changes (refactoring, logging fixes, test improvements, infrastructure updates) that don't affect customers or teach anything.
    - Always write TWO posts:
      - **GitAuto post** (`## Social Media Post (GitAuto)`): Product voice. Can mention GitAuto. Explains what changed and why it matters for users.
      - **Wes post** (`## Social Media Post (Wes)`): Personal voice. Written as Wes (the founder) sharing what he debugged/built. Don't emphasize "GitAuto" — no "GitAuto now does X" pattern. More like telling a friend what you worked on today.
    - Shared guidelines for both posts:
      - **NEVER use em dashes (—)** in social media posts. Use regular dashes (-) or rewrite the sentence instead.
      - Be concise and fit in a tweet (under 280 characters is ideal)
      - **Write for developers, not marketers** - our customers are devs who hate corporate speak
      - **NEVER use typical marketing keywords**: "all-in", "doubling down", "sunsetting", "deeper features", "polished product", "game-changer", "seamless"
      - **NEVER frame things negatively**: "unused", "nobody used", "removing unused" - this is embarrassing
      - **Be straightforward and honest** like a dev talking to other devs
      - **Users don't know GitAuto internals** - They don't know we clone repos, install dependencies, set up working environments, etc. When relevant, educate them on what GitAuto does
      - **Tell the story when there's a real failure** - When you find a real flaw or failure, be transparent. Tell the story: what happened, what went wrong (e.g. Claude misunderstood X, our pipeline missed Y), what the impact was, and how we improved. Developers respect honesty and the story resonates more than hiding it. Frame it as "we found a flaw → it caused X → we improved" not "we fixed a bug".
      - **Sound like a human wrote it** - AI-generated posts are obvious and get ignored. Write like a real dev sharing something they built. Be casual, imperfect, opinionated. No polished marketing tone.
      - **Vary the opening every time** - NEVER use patterns like "GitAuto now...", "We just...", or any formula that gets stale. Start with the substance — what changed, why it matters, or a hook.
      - **Wes post: don't repeat openers** - Before writing, run `scripts/git/recent_social_posts.sh wes` and make sure your opening sentence doesn't use the same structure as any recent post.
    - If the PR includes a Social Media Post section, check recent posts to avoid repeating patterns:

      ```bash
      scripts/git/recent_social_posts.sh gitauto  # GitAuto posts only
      scripts/git/recent_social_posts.sh wes      # Wes posts only
      ```

      Read the output and ensure your new post uses a different sentence structure and opener.

**Note**: E2E tests (`npx playwright test`) are skipped during LGTM to save time. Run them manually when needed.

## TypeScript Error Checking Rule

**CRITICAL**: Always use BOTH commands to check for TypeScript errors:

1. `npx tsc --noEmit` - Checks ALL files including test files
2. `npm run build` - Checks only production code

Never rely on `npm run build` alone as it ignores test files. All TypeScript errors must be fixed before considering any task complete.

## Blog Content Guidelines

### BLOG Command

When the user says "BLOG", use these sub-agents in sequence:

1. `source-finder` - Find unique sources
2. `title-generator` - Generate SEO-optimized titles
3. `blog-writer` - Write complete blog posts
4. `blog-refiner` - Review and refine content quality

Show results from each sub-agent before proceeding to the next step.

## Code Style Preferences

### General Principles

- **Answer "why" questions before changing approach** - MOST CRITICAL: When the user asks "why did you do X?", they want to understand your reasoning, NOT for you to immediately change your approach. First, explain your reasoning clearly. Only change your approach after you've explained it AND determined that the user's concern is valid. Don't flip your opinion just because the user questioned it.
- **NEVER immediately agree with the user** - When the user challenges your work or suggests changes, STOP and think critically first. Don't just say "You're right" and follow blindly. Question assumptions (yours and the user's). Think independently about whether the suggestion makes sense before implementing it.
- **Functions over classes** - Always prefer functional programming over OOP classes
- **Arrow functions** - Prefer arrow functions over regular function declarations
- **Minimal syntax** - Remove {} brackets for single-line if statements and single-expression arrow functions
- **Single responsibility** - One file, one exported function. Don't create 2+ functions in a file. If a helper is used multiple times within the file, keep it as a private function in that file. If it's used only once, inline it. If it's needed by other files, move it to its own file.
- **Type safety** - Use Supabase generated types whenever possible
- **Avoid any** - Never use `any` type, always use proper TypeScript types. When an API returns `any` (e.g., `response.json()`), always assign it to a fully typed variable (e.g., `const data: { id: number; name: string } = await response.json()`) so downstream code is properly typed instead of propagating `any`. Similarly, chaining 2+ property accesses on untyped objects propagates `any` - break the chain into separate typed variables.
- **No silent defaults** - Don't hide missing data with fallback defaults (e.g., `?? {}`, `|| ""`). Handle `null`/`undefined` explicitly. Defaults mask bugs.
- **NEVER use `as any`** - Never use `as any` type assertions, always use proper type guards or interfaces
- **Avoid non-null assertions** - Never use `!` operator; instead use proper type guards or extract to variables after validation
- **No explicit return types** - Do not add return type annotations (e.g., `: Promise<string>`, `: void`, `: string`). They overwrite the inferred return type without validating the implementation actually returns that type. Return type annotations are PROHIBITED. Let TypeScript infer return types.
- **Log on early return/throw** - Always `console.log` or `console.error` before returning early or throwing, so we can see why in production logs
- **Solve problems fundamentally** - Never work around issues with hacks or type assertions; always find and fix the root cause. If TypeScript complains, understand why and fix the underlying issue properly
- **Best practices first** - Prioritize modern best practices over existing codebase patterns when they conflict
- **Explain reasoning** - Always explain WHY you chose a specific approach/solution over alternatives (e.g., "I used useMemo here instead of useCallback because we're memoizing a computed value, not a function" or "I chose Map over Object because we need insertion order preservation") outside of the code change suggestions. Do not include this in the code change suggestions.
- **Critical thinking over blind imitation** - SUPER IMPORTANT: Don't just copy existing patterns. Think deeply about what the correct approach should be based on best practices, then consider how the codebase currently does it. Make reasoned decisions rather than blindly following existing code, especially when you spot inconsistencies or anti-patterns.

### File Naming Conventions

- **Files/folders**: `kebab-case` (e.g., `add-credits.ts`, `/api/user-profile/`)
- **Functions/variables**: `camelCase` (e.g., `addCredits`, `userName`)
- **Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`)

### Color System

- **Primary color**: `pink-600` for buttons, links, and primary actions
- **Hover states**: `pink-700` for button hovers, `hover:underline` for links
- **Secondary colors**: `gray-600` for text, `red-600` for errors, `green-600` for success
- **Never use**: `blue-600` or other blue colors - always use pink for primary actions

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
