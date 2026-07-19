# OnSite Flask API

The backend is a local Flask JSON API backed by SQLite. The database is created at
`backend/instance/onsite.db` and is intentionally excluded from Git.

## Setup

From the repository root in PowerShell:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
$env:FLASK_APP = "backend/run.py"
backend/.venv/Scripts/python.exe -m flask seed
```

Run the backend:

```powershell
npm.cmd run backend:dev
```

The API is available at `http://127.0.0.1:5000/api`, with a health check at
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

Authentication uses a signed HTTP-only Flask session cookie. Browser location is
used for an individual recommendation request only when the profile contains
explicit location consent; precise location history is not stored.

## Tests

```powershell
npm.cmd run backend:test
```
