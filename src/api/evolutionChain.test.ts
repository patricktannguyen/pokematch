import { describe, expect, it } from "vitest";
import {
  flattenEvolutionChain,
  parseIdFromResourceUrl,
  type EvolutionChainLink,
} from "./evolutionChain";

describe("parseIdFromResourceUrl", () => {
  it("parses the id from a URL with a trailing slash", () => {
    expect(parseIdFromResourceUrl("https://pokeapi.co/api/v2/pokemon-species/25/")).toBe(25);
  });

  it("parses the id from a URL without a trailing slash", () => {
    expect(parseIdFromResourceUrl("https://pokeapi.co/api/v2/pokemon-species/25")).toBe(25);
  });

  it("throws when the URL has no numeric id segment", () => {
    expect(() => parseIdFromResourceUrl("https://pokeapi.co/api/v2/pokemon-species/")).toThrow();
  });
});

describe("flattenEvolutionChain", () => {
  it("flattens a linear (non-branching) chain in order", () => {
    const chain: EvolutionChainLink = {
      species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
      evolves_to: [
        {
          species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
          evolves_to: [
            {
              species: { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
              evolves_to: [],
            },
          ],
        },
      ],
    };

    expect(flattenEvolutionChain(chain).map((s) => s.name)).toEqual([
      "bulbasaur",
      "ivysaur",
      "venusaur",
    ]);
  });

  it("flattens a branching chain into a single row, root first then each branch in order", () => {
    const chain: EvolutionChainLink = {
      species: { name: "eevee", url: "https://pokeapi.co/api/v2/pokemon-species/133/" },
      evolves_to: [
        {
          species: { name: "vaporeon", url: "https://pokeapi.co/api/v2/pokemon-species/134/" },
          evolves_to: [],
        },
        {
          species: { name: "jolteon", url: "https://pokeapi.co/api/v2/pokemon-species/135/" },
          evolves_to: [],
        },
        {
          species: { name: "flareon", url: "https://pokeapi.co/api/v2/pokemon-species/136/" },
          evolves_to: [],
        },
      ],
    };

    expect(flattenEvolutionChain(chain).map((s) => s.name)).toEqual([
      "eevee",
      "vaporeon",
      "jolteon",
      "flareon",
    ]);
  });
});
