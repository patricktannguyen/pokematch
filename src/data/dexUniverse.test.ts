import { describe, expect, it } from "vitest";
import { isInDex, TOTAL_DEX_SIZE, ALL_POKEMON } from "./dexUniverse";

describe("dexUniverse", () => {
  it("reports the committed dataset as non-empty and matching TOTAL_DEX_SIZE", () => {
    expect(TOTAL_DEX_SIZE).toBeGreaterThan(0);
    expect(ALL_POKEMON.length).toBe(TOTAL_DEX_SIZE);
  });

  it("isInDex is true for a known id", () => {
    expect(isInDex(1)).toBe(true);
  });

  it("isInDex is false for an id outside the dataset", () => {
    expect(isInDex(999999999)).toBe(false);
  });
});
