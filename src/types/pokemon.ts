export interface PokemonSummary {
  id: number;
  name: string;
  base_experience: number;
  sprite: string | null;
}

export interface PokemonStat {
  name: string;
  base: number;
}

export interface PokemonDetail extends Omit<PokemonSummary, "base_experience"> {
  base_experience: number | null;
  height: number;
  weight: number;
  types: string[];
  stats: PokemonStat[];
  cryUrl: string | null;
  shinySprite: string | null;
  speciesUrl: string;
}

export type BattleReason = "type" | "stats" | "tie";

export interface MatchEvent {
  id: number;
  fromName: string;
  toName: string;
  value: number;
  winnerName: string | null;
  reason: BattleReason;
}
