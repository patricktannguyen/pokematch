import { describe, expect, it } from "vitest";
import { DEFAULT_TYPE_COLOR, getTypeColor } from "./typeColors";

describe("getTypeColor", () => {
  it("returns the accent color for a known type", () => {
    expect(getTypeColor("fire").accent).toBe("#F08030");
  });

  it("falls back to the default color for an unknown type", () => {
    expect(getTypeColor("???")).toEqual(DEFAULT_TYPE_COLOR);
  });
});
