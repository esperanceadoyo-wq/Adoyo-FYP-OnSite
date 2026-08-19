# OnSite Architecture

OnSite uses a three-layer architecture. The Next.js frontend presents the user
experience, the Flask API owns application behavior, and SQLite stores persisted
data.

```text
Browser
  -> Next.js pages and API proxies (src/app)
  -> Feature modules (src/features)
  -> Flask JSON API (backend/app/api)
  -> Services and SQLAlchemy models (backend/app/services, backend/app/models.py)
  -> SQLite (backend/instance/onsite.db)
```

## Repository Map

| Path | Responsibility |
| --- | --- |
| `src/app` | Public pages and thin Next.js API proxy routes. Folder names define URLs. |
| `src/features` | Frontend code grouped by business capability. |
| `src/shared` | Reusable UI and infrastructure with no single feature owner. |
| `public` | Static browser assets, including the OnSite logo. |
| `backend/app/api` | Flask request validation, authentication, and HTTP responses. |
| `backend/app/services` | Recommendation, progress, location, and leaderboard rules. |
| `backend/app/models.py` | SQLAlchemy persistence models. |
| `backend/migrations` | Versioned database schema changes. |
| `backend/tests` | Backend API and recommendation integration tests. |
| `scripts` | Cross-platform development commands. |

## Frontend Feature Modules

| Module | Contents |
| --- | --- |
| `features/auth` | Login, signup, password recovery, session guards, and auth types. |
| `features/chat` | OnSite Guide widget and conversational product assistance. |
| `features/dashboard` | Dashboard data composition and nearby recommendations. |
| `features/spaces` | Space catalog types, details, check-in, visits, and reflections. |
| `features/recommendations` | Recommendation response types. |
| `features/saved` | Saved-space data access and types. |
| `features/profile` | Profile data and avatar presentation. |
| `features/leaderboard` | Leaderboard data access and ranking types. |
| `features/admin` | Admin overview data access and management types. |
| `features/navigation` | Authenticated application sidebar and header shell. |

## Dependency Rules

1. `src/app` composes feature modules and should contain minimal domain logic.
2. Feature modules may use `src/shared`, but shared code must not depend on a
   specific feature.
3. Next.js route handlers only proxy requests; Flask owns validation, business
   rules, authorization, and persistence.
4. Flask API routes call services and models rather than duplicating scoring or
   progress rules.
5. Database changes are made through migrations, never by manually editing the
   SQLite file.

## Request Examples

Authentication:

```text
LoginForm -> /api/auth/login (Next.js proxy) -> Flask auth route -> users table
```

Personalized recommendations:

```text
Dashboard -> /api/recommendations -> Flask recommendation route
  -> recommendation service -> spaces, profile, visits, and reflections
```

Verified visit and reflection:

```text
Space details -> location consent -> visit verification -> reflection
  -> Flask visit/reflection routes -> progress and journey history
```

## Presentation Order

For a concise technical walkthrough:

1. Start with `src/app` to show the available product routes.
2. Open the corresponding folder in `src/features` to explain frontend behavior.
3. Follow a request through `backend/app/api` into `backend/app/services`.
4. Show `backend/app/models.py` and the migrations as the persistence layer.
5. Finish with `backend/tests` and the verification commands in the root README.
