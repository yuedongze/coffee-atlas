# Coffee Roasting Atlas

Roasting by Coordinates — by Coffee with Dongze. An interactive map of 98 concepts with a curated 42-topic beginner path.

## Development

Use Node.js 22.13 or newer. Run `npm ci`, then `npm run dev`.

Card content: [`content/`](content/README.md), with one Markdown file per card. Edit titles, introductions, articles, and reading links there.

Map layout and beginner routes: `src/topics.ts`. Stable IDs and content paths: `src/topic-map.json`. Interface: `src/page.tsx`. Styles: `src/globals.css`.

Run `npm run content:check` to validate your edits. The development preview reloads when you save Markdown files; pushing to `main` publishes them through GitHub Pages.

## Deployment

Run `npm run build` and `npm run preview` to verify the static production build in `dist/`.

No backend is required. Progress is saved in each visitor’s browser; it is not synced across devices. Fonts load from Google Fonts. Topic links use URL fragments and need no server routing.

GitHub Actions builds and deploys pushes to `main`. In **Settings → Pages**, select **GitHub Actions** as the source. The configured base path is `/coffee-atlas/`.

Site: https://yuedongze.github.io/coffee-atlas/

Field notes are introductory educational content with research links for further reading.
