# Vouch

Vouch is a React + Vite movie/product review app backed by Supabase and a Cloudflare Worker.

## Local development

1. Install dependencies:

   `npm install`

2. Create `.env` with the server-side TMDB token:

   `TMDB_TOKEN=your_tmdb_bearer_token`

3. Create `.env.local` with the frontend Supabase variables:

   `VITE_SUPABASE_URL=your_supabase_url`
   `VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key`

4. Start Vite:

   `npm run dev`

The deployed/local Cloudflare Worker API uses `/api/*`.

## Cloudflare deployment

1. Install dependencies: `npm install`
2. Log in: `npx wrangler login`
3. Build: `npm run build`
4. Add the TMDB token as a Cloudflare secret:

   `npx wrangler secret put TMDB_TOKEN`

5. Deploy:

   `npm run deploy`

The site and Worker API are deployed together. React Router SPA routes are supported by the `single-page-application` asset fallback.

## Environment variables

Never commit `.env` or `.env.local`. Frontend `VITE_*` values are public at runtime; server secrets such as `TMDB_TOKEN` must stay in Cloudflare secrets.
