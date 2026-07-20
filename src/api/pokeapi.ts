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
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
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
  };
}
