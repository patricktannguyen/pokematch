import { describe, expect, it } from "vitest";
import { determineWinner } from "./battleOutcome";
import type { PokemonDetail } from "../types/pokemon";

function makePokemon(overrides: Partial<PokemonDetail>): PokemonDetail {
  return {
    id: 1,
    name: "bulbasaur",
    base_experience: 64,
    sprite: null,
    height: 7,
    weight: 69,
    types: ["grass"],
    stats: [],
    cryUrl: null,
    shinySprite: null,
    speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/1/",
    ...overrides,
  };
}

describe("determineWinner", () => {
  it("picks the first pokemon when it has a higher total base stat", () => {
    const a = makePokemon({ name: "a", stats: [{ name: "hp", base: 100 }] });
    const b = makePokemon({ name: "b", stats: [{ name: "hp", base: 50 }] });
    expect(determineWinner(a, b)?.name).toBe("a");
  });

  it("picks the second pokemon when it has a higher total base stat", () => {
    const a = makePokemon({ name: "a", stats: [{ name: "hp", base: 50 }] });
    const b = makePokemon({
      name: "b",
      stats: [
        { name: "hp", base: 60 },
        { name: "attack", base: 60 },
      ],
    });
    expect(determineWinner(a, b)?.name).toBe("b");
  });

  it("returns null when total base stats are equal", () => {
    const a = makePokemon({
      name: "a",
      stats: [
        { name: "hp", base: 45 },
        { name: "attack", base: 49 },
      ],
    });
    const b = makePokemon({
      name: "b",
      stats: [
        { name: "hp", base: 49 },
        { name: "attack", base: 45 },
      ],
    });
    expect(determineWinner(a, b)).toBeNull();
  });
});
