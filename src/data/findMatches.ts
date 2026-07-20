import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

export function findMatches(
  dataset: PokemonSummary[],
  selected: PokemonDetail,
): PokemonSummary[] {
  if (selected.base_experience === null) return [];

  return dataset
    .filter(
      (p) => p.id !== selected.id && p.base_experience === selected.base_experience,
    )
    .sort((a, b) => a.id - b.id);
}
