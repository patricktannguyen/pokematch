import { describe, expect, it } from "vitest";
import { formatStatLabel } from "./statLabels";

describe("formatStatLabel", () => {
  it.each([
    ["hp", "HP"],
    ["attack", "Attack"],
    ["defense", "Defense"],
    ["special-attack", "Sp. Atk"],
    ["special-defense", "Sp. Def"],
    ["speed", "Speed"],
  ])("formats %s as %s", (name, expected) => {
    expect(formatStatLabel(name)).toBe(expected);
  });

  it("falls back to the raw name for an unrecognized stat", () => {
    expect(formatStatLabel("accuracy")).toBe("accuracy");
  });
});
