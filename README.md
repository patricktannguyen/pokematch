# PokéMatch

A tiny web app for matchmakers who create matches between Pokémon. Enter a
Pokémon ID to see that Pokémon, plus every other Pokémon that shares the same
`base_experience`. Click any match to make it the new selection and
recompute matches.

**Live URL:** TODO

## Main use cases

1. **Look up a Pokémon by ID** — type an ID (e.g. `25`) into the search box
   to see its name, sprite, types, base experience, height, and weight,
   fetched live from PokeAPI.
2. **Browse Pokémon that share a base experience** — the matches grid below
   the selected Pokémon lists every other Pokémon with the same
   `base_experience`. Clicking a match card selects it, refetches its detail,
   and recomputes the match list against the new selection — so you can chain
   through matches indefinitely.
3. **Handle the edges gracefully** — an unknown ID (e.g. `99999`) shows a
   "not found" message instead of crashing, and a Pokémon with no matches
   shows an explicit "no matches" state.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

Other scripts:

- `npm run build` — type-checks and builds a production bundle to `dist/`.
- `npm run test` — runs the unit tests (Vitest) for the match-finding logic.
- `npm run build:dataset` — regenerates `src/data/pokemon-base-experience.json`
  (see below). Not required to run the app — the generated file is already
  committed.

## Data source and a deliberate tradeoff

Everything comes from [PokeAPI v2](https://pokeapi.co/docs/v2#pokemon). The
**selected** Pokémon's detail (name, sprite, types, height, weight, base
experience) is fetched live on every selection from
`GET https://pokeapi.co/api/v2/pokemon/{id}`.

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

## Stack

Vite, React, TypeScript, Tailwind CSS, Vitest.
