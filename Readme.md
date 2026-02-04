# Aspirant-Saathi

This repository contains Aspirant-Saathi — a small web app that helps aspirants write and evaluate answers using examiner-style rubrics.

## Project structure

- `client/` — React frontend (Create React App)
- `server/` — Node/Express backend

## Prerequisites

- Node.js (v16+ recommended) and npm
- (Optional) MongoDB if you plan to enable persistence for the server models

## Quick start (development)

1. Install dependencies for both client and server:

```bash
# from project root
cd client
npm install

cd ../server
npm install
```

2. Run the frontend and backend in development:

```bash
# In one terminal: run the React dev server
cd client
npm start

# In another terminal: run the backend (nodemon)
cd server
npm run dev
```

The React app runs on http://localhost:3000 by default and the server listens on port 5000.

## Build (production)

```bash
cd client
npm run build
```

This creates an optimized production build in `client/build`.

## Tests

Frontend tests (Create React App):

```bash
cd client
npm test
```

## Notes

- The current repo includes a basic landing page (home hero, navbar with Sign In / Sign Up) and a simple server scaffold. If you plan to enable database-backed features, start a MongoDB instance and update server configuration as needed.
- Repo URL: https://github.com/codexuttam/Aspirant-Saathi

---

If you'd like, I can add environment variable examples (`.env.example`) and a small script to run both client and server concurrently (using `concurrently`) — tell me if you want that.

This repository contains Aspirant-Saathi — a small web app that helps aspirants write and evaluate answers using examiner-style rubrics.



Frontend: React (client/) — contains pages, components, styles and services.
Backend: Node/Express (server/) — contains controllers, models, routes and evaluation services.

Repo link: https://github.com/codexuttam/Aspirant-Saathi

If you're reviewing this repo, the latest commit includes the basic landing page and project structure.
