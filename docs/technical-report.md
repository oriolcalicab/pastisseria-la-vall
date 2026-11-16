# Technical report

## 1. Main decisions

**Money in cents.** All prices and totals are integers in cents. The frontend formats them with `Intl.NumberFormat`. Floats would produce errors like `0.1 + 0.2 = 0.30000000000000004`.

**Idempotent orders.** The checkout creates a random `idempotencyKey` when it opens and sends it with the order. The database has a unique key on `(userId, idempotencyKey)`, so a double click or a retry after a network error returns the same order instead of creating two.

**Transactions and a lock per day.** Creating an order runs in one Prisma transaction: it locks the delivery day (`pg_advisory_xact_lock`), counts the orders of that day, checks and reserves the stock, and saves the order, its items and the first status. Two customers ordering the last place of a day at the same time cannot both succeed. A test against a real PostgreSQL database (`pnpm test:db`) checks it.

**Order status as a state machine.** The allowed changes are defined in one place (`orderTransitions`). The backend rejects any other change with 409, and the admin only sees the buttons of the allowed next statuses. Each change is saved in `OrderStatusHistory`, and cancelling returns the stock.

**Validation on both sides.** The frontend validates to give quick feedback; the backend validates again, because it is the only part that can be trusted. Dates, postal codes, filters and bodies are parsed by small pure functions in `validation/` with their own tests.

**Signed image uploads.** Photos go directly from the browser to Cloudinary, but only with a signature created by the backend for admins. The Cloudinary secret never leaves the server, and the backend only accepts `https://res.cloudinary.com/` addresses.

**Security of the API.** CORS only allows the configured origins, the authentication and the order endpoints have a rate limit, and a global error handler always answers `{ error }` without internal details.

**Performance.** Pages are loaded with `React.lazy` and `Suspense`: the main JavaScript of the shop went from about 378 kB to a fraction of it, and the charts and the calendar are only downloaded by admins.

**State shared with Context.** The dashboard uses a `DashboardContext`: the date filter, the figures, the charts and the lists read the same data without passing props through every component.

**Accessibility.** Semantic HTML, labels on every field, errors linked with `aria-describedby`, keyboard focus, a table alternative for the sales chart, a pause button for the moving home photo and no animation when the user prefers reduced motion.

## 2. Testing

- Unit tests for pure functions (validation, dates, totals, statuses), and tests of hooks, components and pages with Testing Library.
- Route tests start the Express app on a random port and mock the services.
- Database tests run against a separate PostgreSQL (Neon test branch locally, a temporary PostgreSQL in CI).
- Coverage: backend about 94 % of lines, frontend about 92 %. The CI fails below 20 %.
- Behaviour scenarios in Gherkin describe each feature in plain English.

## 3. Lessons learned

- Splitting the code into small files (data, utils, hooks, components) made it much easier to test and to change.
- Business rules belong to the backend: the frontend can be skipped, the database cannot.
- Concurrency problems do not appear in manual tests; they need a lock and a test that sends orders at the same time.
- `pnpm build` also checks the types of the tests, so it must run before every push.
- Free plans have limits (Render sleeps, Netlify credits ran out): the project moved to Vercel and the limits are written in the README.

## 4. Pending improvements

- **`useProductForm`** is large: it could be split into smaller hooks for the fields, the sizes and the submission.
- **Focus on route change:** move the focus to the main heading after navigating, so screen reader users know the page changed.
- **Memoisation:** measure with the React Profiler and add `useMemo` or `useCallback` only where it really helps (for example, the calendar events).
- Online payment, emails to the customer when the status changes, and end-to-end tests with Playwright.
