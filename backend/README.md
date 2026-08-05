# OnSite Flask API

The backend is a local Flask JSON API backed by SQLite. The database is created at
`backend/instance/onsite.db` and is intentionally excluded from Git.

## Setup

From the repository root on macOS, Linux, or Windows:

```sh
npm run backend:setup
```

Run the backend:

```sh
npm run backend:dev
```

The API is available at `http://127.0.0.1:5001/api`, with a health check at
`GET /api/health`. Run the Next.js frontend separately with `npm.cmd run dev`.

Demo credentials after seeding:

- Email: `demo@onsite.local`
- Password: `DemoPass123!`

## API Surface

- `POST /api/auth/register`, `/login`, `/logout`
- `GET /api/auth/me`
- `GET`, `PUT /api/profile`
- `GET /api/spaces` and `GET /api/spaces/<id>`
- `POST /api/recommendations` and `GET /api/recommendations/history`
- `POST /api/visits`
- `POST /api/reflections`
- `GET /api/progress`
- `GET /api/achievements`
- Admin-only `POST`, `PATCH`, and `DELETE` operations under `/api/spaces`

The space catalog includes stable slugs, image metadata, opening hours, ratings,
amenities, atmosphere tags, and social intensity. Filter the list with
`?category=cafe` or `?social_intensity=1`; inactive spaces are never returned by
public catalog endpoints.

Authentication uses a signed HTTP-only Flask session cookie. Browser location is
used for an individual recommendation request only when the profile contains
explicit location consent; precise location history is not stored.

## Database migrations

Apply pending migrations with `npm run backend:migrate`, then seed demo records
with `npm run backend:seed`. The setup command performs both operations.

If an older local `backend/instance/onsite.db` was created before migrations were
introduced, back it up and mark the initial schema as current once:

```sh
backend/.venv/bin/python -m flask --app backend/run.py db stamp head
```

On Windows, use `backend/.venv/Scripts/python.exe` for the same command. Do not
stamp a database whose schema was modified independently.

## Tests

```sh
npm run backend:test
```
