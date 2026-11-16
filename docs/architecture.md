# Architecture

```mermaid
flowchart LR
  user((Customer / Admin))

  subgraph Vercel
    spa["React SPA<br/>Vite + TypeScript + Tailwind"]
  end

  subgraph Render
    api["Express API<br/>Node.js + TypeScript"]
  end

  subgraph Neon
    db[("PostgreSQL")]
  end

  firebase["Firebase Authentication"]
  cloudinary["Cloudinary<br/>product photos"]
  osm["OpenStreetMap tiles"]
  github["GitHub Actions CI"]

  user --> spa
  spa -- "sign in / sign up" --> firebase
  spa -- "REST + Firebase ID token" --> api
  api -- "verify token (Firebase Admin)" --> firebase
  api -- "Prisma ORM" --> db
  api -- "signed upload signature" --> spa
  spa -- "upload photo" --> cloudinary
  spa -- "map tiles" --> osm
  github -. "format, lint, tests, build" .-> spa
  github -. "format, lint, tests, DB tests, build" .-> api
```

## How a request works

1. The user signs in with Firebase in the browser. Firebase returns an **ID token**.
2. Each request to the API sends the token in the `Authorization: Bearer` header.
3. The backend checks the token with Firebase Admin, finds the user in the database and checks the role (`customer` or `admin`).
4. The route validates the input, the service uses Prisma to read or write PostgreSQL, and the answer goes back as JSON.

## Layers of the backend

```mermaid
flowchart TD
  request[HTTP request] --> cors[CORS and JSON body]
  cors --> limit[Rate limit: auth and orders]
  limit --> auth[Middleware: verify token, load user, admin only]
  auth --> route[Route: read params]
  route --> validation[Validation: parse and check the input]
  validation --> service[Service: business rules with Prisma]
  service --> db[(PostgreSQL)]
  route --> errors[Error handler: always returns error JSON]
```

## Frontend organisation

- `pages/` only put together the pieces of each feature.
- `features/<area>/` contain `components`, `hooks`, `services` (API calls), `types`, `utils` and `data`.
- Shared state uses React Context: authentication (`AuthContext`), cart (`CartContext`) and the admin dashboard (`DashboardContext`).
- Every page except the home page is loaded with `React.lazy`, so the shop never downloads the admin code.

## Deployment

- `develop` is the working branch; every change arrives through a pull request with CI.
- Publishing is a pull request from `develop` to `main`. Vercel and Render deploy `main` automatically.
