import dataset from "./pokemon-base-experience.json";
import type { PokemonSummary } from "../types/pokemon";

export const ALL_POKEMON = dataset as PokemonSummary[];

export const TOTAL_DEX_SIZE = ALL_POKEMON.length;

const DEX_ID_SET = new Set(ALL_POKEMON.map((p) => p.id));

export function isInDex(id: number): boolean {
  return DEX_ID_SET.has(id);
}
