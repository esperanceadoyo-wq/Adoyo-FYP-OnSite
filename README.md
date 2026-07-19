# OnSite

OnSite is a third-space recommendation system for international students. The
application uses a Next.js frontend and a local Flask + SQLite backend.

## Getting Started

Install frontend dependencies:

```powershell
npm.cmd install
```

Set up and seed the backend:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
$env:FLASK_APP = "backend/run.py"
backend/.venv/Scripts/python.exe -m flask seed
```

Start the backend and frontend in separate terminals:

```powershell
npm.cmd run backend:dev
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000). The Flask API runs at
[http://127.0.0.1:5000/api](http://127.0.0.1:5000/api).

Backend details and endpoint documentation live in
[`backend/README.md`](backend/README.md).

## Verification

```powershell
npm.cmd run backend:test
npm.cmd run lint
npm.cmd run build
```
