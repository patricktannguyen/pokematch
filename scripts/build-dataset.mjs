// One-time build script: fetches every Pokémon from PokeAPI v2 and writes a
// slim {id, name, base_experience, sprite} dataset to src/data so the app
// can compute base_experience matches instantly, client-side, without
// hitting PokeAPI's REST list endpoint (which doesn't expose base_experience
// or support filtering by it) for every match lookup.
//
// Run with: npm run build:dataset

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API_BASE = "https://pokeapi.co/api/v2";
const CONCURRENCY = 20;
const OUT_PATH = fileURLToPath(
  new URL("../src/data/pokemon-base-experience.json", import.meta.url),
);

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchAllNamesAndUrls() {
  const first = await fetchJson(`${API_BASE}/pokemon?limit=1`);
  const total = first.count;
  const { results } = await fetchJson(`${API_BASE}/pokemon?limit=${total}`);
  return results;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  console.log("Fetching Pokémon list...");
  const entries = await fetchAllNamesAndUrls();
  console.log(`Found ${entries.length} Pokémon. Fetching details...`);

  let done = 0;
  const details = await mapWithConcurrency(entries, CONCURRENCY, async (entry) => {
    const detail = await fetchJson(entry.url);
    done += 1;
    if (done % 200 === 0) console.log(`  ${done}/${entries.length}`);
    return {
      id: detail.id,
      name: detail.name,
      base_experience: detail.base_experience,
      sprite: detail.sprites?.front_default ?? null,
    };
  });

  const dataset = details
    .filter((p) => p.base_experience !== null)
    .sort((a, b) => a.id - b.id);

  const skipped = details.length - dataset.length;
  console.log(
    `Writing ${dataset.length} Pokémon with base_experience (skipped ${skipped} with null base_experience) to ${path.relative(process.cwd(), OUT_PATH)}`,
  );

  await writeFile(OUT_PATH, JSON.stringify(dataset), "utf-8");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
