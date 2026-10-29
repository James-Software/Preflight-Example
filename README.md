# Margin — waitlist demo

A small Next.js app built with official shadcn components. This is a deliberately broken demo for PreFlight: the signup form clears a valid email and shows **“You have entered the waitlist!”**, but it never sends a request to the server, so no database row is created.

The page does not expose a bug toggle, fake database results, or a public list of submitted email addresses. Use synthetic emails for the demo.

## Run locally

Use Node.js 22.9+ (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No account, database or cloud deployment is required to see the broken form behavior.

## Connect a real database

Create a separate Neon Postgres database for this demo. Copy `.env.example` to `.env.local` and set `DATABASE_URL`. Do not use PreFlight’s own production database.

```sh
npm run db:setup
npm run db:check -- demo@example.com
```

The schema lives in `database/schema.sql`. Database setup must run once before the save endpoint or persistence checks can work. The check command performs a real SQL query and fails if the database is unavailable; it never pretends that an unavailable database is empty.

## Show the bug

1. Pick a fresh synthetic email and confirm `npm run db:check -- that-email@example.com` reports `persisted: false`.
2. Enter the same email in the page and click **Join the waitlist**.
3. Observe the cleared field and success toast.
4. Run the same database check again. The row is still missing. The browser Network panel also shows no `POST /api/waitlist`.

This demonstrates a false success state. A screenshot alone cannot prove persistence; use the actual database check.

## Repair target

`src/app/api/waitlist/route.ts` is a real save endpoint: it validates and normalizes the email, writes with a parameterized SQL insert, and reports an error if saving fails. The missing link is in `src/components/waitlist-form.tsx`.

A correct repair calls `POST /api/waitlist`, awaits a successful response, and only then clears the field and shows the success toast. A failed request must retain the email and show an error. No runtime switch or second demo page is needed.

## Vercel later

This folder is a standalone app. Import it into your own GitHub repository and connect that repository to Vercel. Set `DATABASE_URL` in the Vercel project and run `npm run db:setup` against that same demo database. Vercel detects Next.js automatically.

Nothing in this project has been published or connected to Sites or Vercel.

## Checks

```sh
npm run typecheck
npm test
npm run build
npm run test:browser
```

If Chromium is not installed locally, run `npx playwright install chromium` once before the browser check. The test runner starts a local server automatically when `DEMO_URL` is unset.

The API tests use controlled database boundaries and do not need external credentials. The browser check uses `DEMO_URL` when supplied, or starts http://127.0.0.1:3000 automatically; it verifies the intentional missing POST along with the visible toast, cleared email, invalid-email handling and mobile layout. It is a demo acceptance check, not a claim that persistence works. A real persistence check requires the database setup above.
