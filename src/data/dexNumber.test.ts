import { describe, expect, it } from "vitest";
import { formatDexNumber } from "./dexNumber";

describe("formatDexNumber", () => {
  it("pads single-digit ids to 3 digits", () => {
    expect(formatDexNumber(1)).toBe("#001");
  });

  it("pads two-digit ids to 3 digits", () => {
    expect(formatDexNumber(25)).toBe("#025");
  });

  it("leaves three-digit ids unpadded", () => {
    expect(formatDexNumber(133)).toBe("#133");
  });

  it("does not truncate ids longer than 3 digits", () => {
    expect(formatDexNumber(10205)).toBe("#10205");
  });
});
