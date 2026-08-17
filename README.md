# Nusrat Ki Mehfil

An immersive, full-screen Nusrat Fateh Ali Khan listening experience built with Next.js. It pairs a cinematic responsive background with a compact glass audio player, playlist links, and a rotating record treatment.

## Local development

Requirements:

- Node.js 22 or newer
- npm

Install and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Playlist links

The Spotify and YouTube Music playlist URLs are defined near the top of `app/NusratPlayer.tsx`. The on-page player uses individual YouTube video IDs from the `TRACKS` list in the same file.

## Deploying with Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework as **Next.js** and use the default build settings.
4. Deploy.

No database, Cloudflare Worker, Wrangler configuration, or environment variables are required for the current site.
