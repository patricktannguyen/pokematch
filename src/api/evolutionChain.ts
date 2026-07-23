import { pickEnglishFlavorText } from "../data/flavorText";

export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionStage {
  id: number;
  name: string;
}

const RESOURCE_URL_ID_PATTERN = /\/(\d+)\/?$/;

export function parseIdFromResourceUrl(url: string): number {
  const match = url.match(RESOURCE_URL_ID_PATTERN);
  if (!match) {
    throw new Error(`Could not parse id from PokeAPI resource URL: ${url}`);
  }
  return Number(match[1]);
}

export function flattenEvolutionChain(chain: EvolutionChainLink): EvolutionStage[] {
  const stages: EvolutionStage[] = [];

  function walk(link: EvolutionChainLink) {
    stages.push({
      id: parseIdFromResourceUrl(link.species.url),
      name: link.species.name,
    });
    link.evolves_to.forEach(walk);
  }

  walk(chain);
  return stages;
}

export function spriteUrlForId(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export interface SpeciesInfo {
  stages: EvolutionStage[];
  flavorText: string | null;
}

interface PokeApiSpeciesResponse {
  evolution_chain: { url: string };
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export async function fetchSpeciesInfo(speciesUrl: string): Promise<SpeciesInfo> {
  const speciesRes = await fetch(speciesUrl);
  if (!speciesRes.ok) {
    throw new Error(`PokeAPI error: ${speciesRes.status} ${speciesRes.statusText}`);
  }
  const species: PokeApiSpeciesResponse = await speciesRes.json();
  const flavorText = pickEnglishFlavorText(species.flavor_text_entries);

  const chainRes = await fetch(species.evolution_chain.url);
  if (!chainRes.ok) {
    throw new Error(`PokeAPI error: ${chainRes.status} ${chainRes.statusText}`);
  }
  const chainData: { chain: EvolutionChainLink } = await chainRes.json();

  return { stages: flattenEvolutionChain(chainData.chain), flavorText };
}
