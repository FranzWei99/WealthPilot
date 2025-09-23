# WealthPilot

A minimal, production-style Next.js app with a purple theme, placeholder UI, a Dutch tax engine (2025), and BV/DGA scenarios.

## Quick start (UI-only)
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Full stack (with Postgres + seed)
```bash
docker run --name wp-pg -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:16
cp .env.example .env  # edit DATABASE_URL if needed
npm run db:generate
npm run db:push
npm run seed
npm run dev
```

## Deploy to Vercel
- Push this folder to GitHub
- Import it in Vercel
- Add env vars (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- Seed your cloud DB locally by pointing DATABASE_URL at the cloud DB and running `db:push` + `seed` once.
