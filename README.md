# Manav’s World

A Mac-inspired personal portfolio for Manav Mehta, built with React, Vite, and Lucide icons. Explore a starry desktop with draggable and resizable app windows, projects, poetry, certifications, and a personal music collection.

## Run locally

Requires Node.js 18 or newer and npm.

```sh
cd world
npm ci
npm run dev -- --port 5173
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). Use this address if another app appears when opening `localhost:5173`.

## Build and check

```sh
cd world
npm run build
node --test src/lib/windowGeometry.test.mjs
```

The production output is generated in `world/dist/`.

## Portfolio apps

- About: engineering, FoodFreaky, and a quieter creative side.
- Projects: FoodFreaky and CIDA case studies.
- Literature & Poetry: original poems with a focused reading view.
- Music: seven S3-hosted favourites, optional local files, and a persistent mini player.
- Résumé: experience, education, résumé PDF, and certification links.
- Contact: email, LinkedIn, GitHub, and a form that opens an email draft.
- Notes and Terminal: small personal corners to explore.

Music starts when a visitor presses play and continues when its window is closed or minimized. Contact messages are sent through the visitor’s email app; no message-storage backend is configured.

## Configuration and documentation

Optional analytics settings are in `world/.env.example`. Copy it to `world/.env.local` and configure one provider to enable analytics; tracking is disabled by default. Local environment files, dependencies, generated builds, editor settings, hosting state, and review screenshots are excluded from Git.

- [Project specification](world/SPECIFICATION.md)
- [Music configuration](world/MUSIC_SETUP.md)
- [Playlist data](world/src/data/playlist.js)
- [Design notes](design-review/portfolio-design-review.md)

Repository: [manava10/PortfolioManav](https://github.com/manava10/PortfolioManav).
