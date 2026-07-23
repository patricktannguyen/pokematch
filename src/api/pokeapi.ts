import { resolveCryUrl } from "../data/cryUrl";
import type { PokemonDetail } from "../types/pokemon";

const API_BASE = "https://pokeapi.co/api/v2";

export class PokemonNotFoundError extends Error {
  readonly id: number;

  constructor(id: number) {
    super(`Pokémon #${id} not found`);
    this.name = "PokemonNotFoundError";
    this.id = id;
  }
}

interface PokeApiPokemonResponse {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  sprites: { front_default: string | null; front_shiny: string | null };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries?: { latest: string | null; legacy: string | null };
  species: { url: string };
}

export async function fetchPokemonById(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${API_BASE}/pokemon/${id}`);

  if (res.status === 404) {
    throw new PokemonNotFoundError(id);
  }
  if (!res.ok) {
    throw new Error(`PokeAPI error: ${res.status} ${res.statusText}`);
  }

  const data: PokeApiPokemonResponse = await res.json();

  return {
    id: data.id,
    name: data.name,
    base_experience: data.base_experience,
    sprite: data.sprites.front_default,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, base: s.base_stat })),
    cryUrl: resolveCryUrl(data.cries),
    shinySprite: data.sprites.front_shiny,
    speciesUrl: data.species.url,
  };
}
