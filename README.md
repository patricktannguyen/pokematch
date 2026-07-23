# PokéMatch

A small React + TypeScript app for matchmakers who create matches between
Pokémon. Enter a Pokémon ID to see that Pokémon, plus every other Pokémon
that shares the same `base_experience`. It's grown from a simple lookup
tool into a lightweight "matchmaking Pokédex" — session-based discovery
tracking, a mystery-reveal grid, type-effectiveness battle predictions, and
a bit of Pokédex-flavored visual polish, all layered on top of the same
core matching logic.

## Live demo

**https://patricktannguyen.github.io/pokematch/**

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

Other scripts, useful when reviewing this repo:

- `npm run build` — type-checks (`tsc -b`) and builds a production bundle to `dist/`.
- `npm run test` — runs the Vitest unit suite (pure logic: matching, battle
  outcome, type effectiveness, flavor-text parsing, etc.).
- `npm run lint` — runs oxlint.
- `npm run build:dataset` — regenerates `src/data/pokemon-base-experience.json`
  (see [Data source](#data-source-and-a-deliberate-tradeoff) below). Not
  required to run the app — the generated file is already committed.

## Main use cases

1. **Look up a Pokémon by ID** — type an ID (e.g. `25`) into the search box,
   or use the **🎲 Surprise me** button for a random one, or the Left/Right
   arrow keys to step through the National Dex. Shows name, sprite, types,
   base experience, height, weight, base stats, a flavor-text blurb, and a
   playable cry — all fetched live from PokeAPI. There's also a small
   ~1-in-12 chance the shiny sprite shows up instead, sparkle and all.
2. **Browse Pokémon that share a base experience** — the Matches grid below
   the selected Pokémon lists every other Pokémon with the same
   `base_experience`. Clicking a match selects it, refetches its detail, and
   recomputes the match list against the new selection — so you can chain
   through matches indefinitely.
3. **Discover your Pokédex, one click at a time** — Pokémon you haven't
   viewed yet this session show up as silhouettes marked `???`, both in the
   Matches grid and the Evolution Chain. Selecting one reveals it for the
   rest of the session and flashes a "Registered" stamp the first time.
   Header counters track overall progress (`x/1302 seen`) and how many of
   this session's shiny Pokémon you've found.
4. **See who'd win a matchup** — every match click is logged to a Match
   History panel showing which of the two Pokémon would win, decided by
   type effectiveness first (a full 18-type chart) and, when neither side
   has a type advantage, a simulated one-round attack exchange using
   HP/Attack/Defense.
5. **Handle the edges gracefully** — an unknown ID (e.g. `99999`) shows a
   "not found" message instead of crashing, and a Pokémon with no matches
   shows an explicit "no matches" state.

## Polish

- **Pokédex-styled chrome** — a subtle scanline texture on the detail card,
  a status LED (idle/loading/error), zero-padded Dex numbers (`#025`), and a
  type-tinted ambient background wash.
- **Type-colored accents** — the detail card's top border and type pills are
  tinted with each Pokémon's own type color.
- **Micro-animations** — the detail card rises/slides in on each selection
  (direction-aware for arrow-key navigation), match grid tiles stagger in,
  and buttons give tactile press feedback.
- **Dark mode** — a manual toggle in the header, persisted in
  `localStorage` and defaulting to your OS's `prefers-color-scheme` on first
  visit.
- **Session-only state, by design** — discovery progress, shiny odds, and
  match history all reset on refresh (no `localStorage`), so every session
  is a fresh run.

## Data source and a deliberate tradeoff

Everything comes from [PokeAPI v2](https://pokeapi.co/docs/v2#pokemon). The
**selected** Pokémon's detail (name, sprite, shiny sprite, types, height,
weight, base experience, base stats, and cry audio) is fetched live on every
selection from `GET https://pokeapi.co/api/v2/pokemon/{id}`.

The evolution chain and flavor text need two *additional* live requests per
selection — `GET /pokemon-species/{id}` to find the chain URL and flavor
text, then `GET /evolution-chain/{id}` for the chain itself — handled by a
small, independent hook (`useSpeciesInfo`) decoupled from the main detail
fetch/cache, so a failure there (or a slow response) never blocks the rest
of the page.

Matching, however, needs `base_experience` for *every* Pokémon to know who
shares a value — and PokeAPI's REST list endpoint only returns `name`/`url`,
with no server-side filter by `base_experience`. Fetching all ~1,300 detail
records on every match lookup would be slow and unfriendly to PokeAPI's
public rate limits. Instead, `scripts/build-dataset.mjs` fetches this once
against the real API and writes a slim `{id, name, base_experience, sprite}`
dataset to `src/data/pokemon-base-experience.json` (committed to the repo),
so match filtering is instant and client-side. Pokémon with a `null`
`base_experience` (a handful of special/unbattlable forms) are excluded from
the dataset and never produce matches.

## Deploying to GitHub Pages

The repo includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds the app and publishes `dist/`
to GitHub Pages on every push to `main`. One-time setup:

1. Create a GitHub repo and push this project to it:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push (or re-run) — the **Deploy to GitHub Pages** workflow will build
   and deploy automatically. Watch progress under the **Actions** tab.
4. Once it finishes, the site is live at
   `https://<your-username>.github.io/<repo-name>/` (also shown in
   **Settings → Pages** and in the workflow run's `deploy` job output).

No further configuration is needed — `vite.config.ts` uses relative
asset paths (`base: './'`), so the build works under a Pages project
subpath without hardcoding the repo name.

## Stack

Vite, React, TypeScript, Tailwind CSS, Vitest. No runtime dependencies were
added beyond React itself — dark mode, animations, cry playback, and the
type chart all use native browser APIs (`localStorage`, `matchMedia`,
`Audio`) plus Tailwind v4's CSS-first `@theme`/`@custom-variant` config.
