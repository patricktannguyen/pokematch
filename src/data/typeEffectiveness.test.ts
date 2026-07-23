import { describe, expect, it } from "vitest";
import {
  bestOffensiveMultiplier,
  combinedEffectiveness,
  getEffectiveness,
} from "./typeEffectiveness";

describe("getEffectiveness", () => {
  it("returns 2 for a super-effective matchup", () => {
    expect(getEffectiveness("water", "fire")).toBe(2);
  });

  it("returns 0.5 for a not-very-effective matchup", () => {
    expect(getEffectiveness("fire", "water")).toBe(0.5);
  });

  it("returns 0 for a no-effect matchup", () => {
    expect(getEffectiveness("electric", "ground")).toBe(0);
  });

  it("defaults to 1 (neutral) for an unlisted matchup", () => {
    expect(getEffectiveness("normal", "psychic")).toBe(1);
  });
});

describe("combinedEffectiveness", () => {
  it("multiplies effectiveness across dual defending types", () => {
    expect(combinedEffectiveness("water", ["fire", "rock"])).toBe(4);
  });

  it("multiplies a resistance and a neutral matchup", () => {
    expect(combinedEffectiveness("fire", ["water", "psychic"])).toBe(0.5);
  });
});

describe("bestOffensiveMultiplier", () => {
  it("picks the higher multiplier among dual attacker types", () => {
    expect(bestOffensiveMultiplier(["normal", "water"], ["fire"])).toBe(2);
  });

  it("returns a single type's multiplier when there's only one attacking type", () => {
    expect(bestOffensiveMultiplier(["grass"], ["water", "ground"])).toBe(4);
  });
});
