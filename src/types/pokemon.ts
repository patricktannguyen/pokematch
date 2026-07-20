export interface PokemonSummary {
  id: number;
  name: string;
  base_experience: number;
  sprite: string | null;
}

export interface PokemonDetail extends Omit<PokemonSummary, "base_experience"> {
  base_experience: number | null;
  height: number;
  weight: number;
  types: string[];
}
