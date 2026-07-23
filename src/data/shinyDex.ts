import { ALL_POKEMON } from "./dexUniverse";

const SHINY_CHANCE = 1 / 12;

const SHINY_ID_SET: Set<number> = new Set(
  ALL_POKEMON.filter(() => Math.random() < SHINY_CHANCE).map((p) => p.id),
);

export const TOTAL_SHINY_COUNT = SHINY_ID_SET.size;

export function isShinyThisSession(id: number): boolean {
  return SHINY_ID_SET.has(id);
}
