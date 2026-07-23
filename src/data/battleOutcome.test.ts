import { describe, expect, it } from "vitest";
import { determineWinner, oneRoundWinner } from "./battleOutcome";
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
  it("picks the type-advantaged pokemon even when its stats are much weaker", () => {
    const a = makePokemon({
      name: "a",
      types: ["water"],
      stats: [
        { name: "hp", base: 50 },
        { name: "attack", base: 30 },
        { name: "defense", base: 30 },
      ],
    });
    const b = makePokemon({
      name: "b",
      types: ["fire"],
      stats: [
        { name: "hp", base: 200 },
        { name: "attack", base: 100 },
        { name: "defense", base: 100 },
      ],
    });
    expect(determineWinner(a, b)?.name).toBe("a");
  });

  it("combines effectiveness across dual defending types to widen the advantage", () => {
    const a = makePokemon({ name: "a", types: ["water"], stats: [{ name: "hp", base: 1 }] });
    const b = makePokemon({
      name: "b",
      types: ["fire", "rock"],
      stats: [{ name: "hp", base: 1000 }],
    });
    // water is 2x vs fire and 2x vs rock (4x combined); fire/rock's best vs water is only 1x
    expect(determineWinner(a, b)?.name).toBe("a");
  });

  it("falls back to a one-round combat calculation when neither side has a type advantage", () => {
    const a = makePokemon({
      name: "a",
      types: ["normal"],
      stats: [
        { name: "hp", base: 100 },
        { name: "attack", base: 60 },
        { name: "defense", base: 20 },
      ],
    });
    const b = makePokemon({
      name: "b",
      types: ["normal"],
      stats: [
        { name: "hp", base: 100 },
        { name: "attack", base: 40 },
        { name: "defense", base: 10 },
      ],
    });
    // a deals 60-10=50 to b (b left at 50); b deals 40-20=20 to a (a left at 80) -> a wins
    expect(determineWinner(a, b)?.name).toBe("a");
  });

  it("returns null when neither type nor the combat calculation favors either side", () => {
    const a = makePokemon({
      name: "a",
      types: ["normal"],
      stats: [
        { name: "hp", base: 100 },
        { name: "attack", base: 50 },
        { name: "defense", base: 30 },
      ],
    });
    const b = makePokemon({
      name: "b",
      types: ["normal"],
      stats: [
        { name: "hp", base: 100 },
        { name: "attack", base: 50 },
        { name: "defense", base: 30 },
      ],
    });
    expect(determineWinner(a, b)).toBeNull();
  });
});

describe("oneRoundWinner", () => {
  it("lets defense fully absorb an attack, flooring damage at 0", () => {
    const a = makePokemon({
      name: "a",
      stats: [
        { name: "hp", base: 100 },
        { name: "attack", base: 10 },
        { name: "defense", base: 50 },
      ],
    });
    const b = makePokemon({
      name: "b",
      stats: [
        { name: "hp", base: 40 },
        { name: "attack", base: 30 },
        { name: "defense", base: 5 },
      ],
    });
    // a deals max(0, 10-5)=5 to b (b left at 35); b deals max(0, 30-50)=0 to a (a left at 100)
    expect(oneRoundWinner(a, b)?.name).toBe("a");
  });
});
