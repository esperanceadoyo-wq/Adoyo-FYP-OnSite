# OnSite

OnSite is a third-space recommendation system for international students. The
application uses a Next.js frontend and a local Flask + SQLite backend.

## Getting Started

Install frontend dependencies:

```sh
npm install
```

Set up, migrate, and seed the backend. Python 3.10 or newer is required:

```sh
npm run backend:setup
```

Start the backend and frontend in separate terminals:

```sh
npm run backend:dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Flask API runs at
[http://127.0.0.1:5001/api](http://127.0.0.1:5001/api).

Backend details and endpoint documentation live in
[`backend/README.md`](backend/README.md).

## Project Structure

The frontend is organized by feature while Next.js route entry points remain in
`src/app`. Shared presentation and infrastructure live in `src/shared`, and the
Flask backend is separated into API, service, model, migration, and test layers.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the complete repository
map, dependency rules, request flows, and a suggested presentation order.

## Verification

```sh
npm run backend:test
npm run lint
npm run build
```
