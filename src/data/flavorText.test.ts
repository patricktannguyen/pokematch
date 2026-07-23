import { describe, expect, it } from "vitest";
import { pickEnglishFlavorText } from "./flavorText";

describe("pickEnglishFlavorText", () => {
  it("picks the first english entry among mixed languages (PokeAPI uses ISO codes like 'en'/'fr')", () => {
    const entries = [
      { flavor_text: "Une texte francaise.", language: { name: "fr" } },
      { flavor_text: "A strange seed was\nplanted on its back.", language: { name: "en" } },
      { flavor_text: "Another english entry.", language: { name: "en" } },
    ];
    expect(pickEnglishFlavorText(entries)).toBe("A strange seed was planted on its back.");
  });

  it("strips embedded control characters and collapses whitespace", () => {
    const entries = [
      { flavor_text: "Line one.\fLine  two.\r\nLine three.", language: { name: "en" } },
    ];
    expect(pickEnglishFlavorText(entries)).toBe("Line one. Line two. Line three.");
  });

  it("returns null when there is no english entry", () => {
    const entries = [{ flavor_text: "Bonjour.", language: { name: "fr" } }];
    expect(pickEnglishFlavorText(entries)).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(pickEnglishFlavorText([])).toBeNull();
  });
});
