import { bestOffensiveMultiplier } from "./typeEffectiveness";
import type { PokemonDetail } from "../types/pokemon";

function getStat(pokemon: PokemonDetail, statName: string): number {
  return pokemon.stats.find((s) => s.name === statName)?.base ?? 0;
}

export function oneRoundWinner(a: PokemonDetail, b: PokemonDetail): PokemonDetail | null {
  const aHp = getStat(a, "hp");
  const bHp = getStat(b, "hp");
  const aDamageTaken = Math.max(0, getStat(b, "attack") - getStat(a, "defense"));
  const bDamageTaken = Math.max(0, getStat(a, "attack") - getStat(b, "defense"));

  const aRemainingHp = aHp - aDamageTaken;
  const bRemainingHp = bHp - bDamageTaken;

  if (aRemainingHp === bRemainingHp) return null;
  return aRemainingHp > bRemainingHp ? a : b;
}

export function determineWinner(a: PokemonDetail, b: PokemonDetail): PokemonDetail | null {
  const aAdvantage = bestOffensiveMultiplier(a.types, b.types);
  const bAdvantage = bestOffensiveMultiplier(b.types, a.types);

  if (aAdvantage > bAdvantage) return a;
  if (bAdvantage > aAdvantage) return b;

  return oneRoundWinner(a, b);
}
