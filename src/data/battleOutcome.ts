import type { PokemonDetail } from "../types/pokemon";

function totalStats(pokemon: Pick<PokemonDetail, "stats">): number {
  return pokemon.stats.reduce((sum, s) => sum + s.base, 0);
}

export function determineWinner(a: PokemonDetail, b: PokemonDetail): PokemonDetail | null {
  const aTotal = totalStats(a);
  const bTotal = totalStats(b);
  if (aTotal === bTotal) return null;
  return aTotal > bTotal ? a : b;
}
