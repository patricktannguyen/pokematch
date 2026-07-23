import { bestOffensiveMultiplier } from "./typeEffectiveness";
import type { BattleReason, PokemonDetail } from "../types/pokemon";

export interface BattleOutcome {
  winner: PokemonDetail | null;
  reason: BattleReason;
}

const REASON_LABEL: Record<Exclude<BattleReason, "tie">, string> = {
  type: "type advantage",
  stats: "higher stats",
};

export function describeReason(reason: BattleReason): string | null {
  if (reason === "tie") return null;
  return REASON_LABEL[reason];
}

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

export function determineWinner(a: PokemonDetail, b: PokemonDetail): BattleOutcome {
  const aAdvantage = bestOffensiveMultiplier(a.types, b.types);
  const bAdvantage = bestOffensiveMultiplier(b.types, a.types);

  if (aAdvantage > bAdvantage) return { winner: a, reason: "type" };
  if (bAdvantage > aAdvantage) return { winner: b, reason: "type" };

  const winner = oneRoundWinner(a, b);
  return { winner, reason: winner ? "stats" : "tie" };
}
