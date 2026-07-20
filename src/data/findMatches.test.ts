import { describe, expect, it } from "vitest";
import { findMatches } from "./findMatches";
import type { PokemonDetail, PokemonSummary } from "../types/pokemon";

const dataset: PokemonSummary[] = [
  { id: 1, name: "bulbasaur", base_experience: 64, sprite: null },
  { id: 43, name: "oddish", base_experience: 64, sprite: null },
  { id: 54, name: "psyduck", base_experience: 64, sprite: null },
  { id: 25, name: "pikachu", base_experience: 112, sprite: null },
];

function makeSelected(overrides: Partial<PokemonDetail>): PokemonDetail {
  return {
    id: 1,
    name: "bulbasaur",
    base_experience: 64,
    sprite: null,
    height: 7,
    weight: 69,
    types: ["grass"],
    ...overrides,
  };
}

describe("findMatches", () => {
  it("returns other pokemon sharing the same base_experience, sorted by id, excluding itself", () => {
    const selected = makeSelected({ id: 1, base_experience: 64 });
    expect(findMatches(dataset, selected).map((p) => p.name)).toEqual([
      "oddish",
      "psyduck",
    ]);
  });

  it("returns an empty array when no other pokemon share base_experience", () => {
    const selected = makeSelected({ id: 25, name: "pikachu", base_experience: 112 });
    expect(findMatches(dataset, selected)).toEqual([]);
  });

  it("returns an empty array when the selected pokemon has a null base_experience", () => {
    const selected = makeSelected({ base_experience: null });
    expect(findMatches(dataset, selected)).toEqual([]);
  });
});
