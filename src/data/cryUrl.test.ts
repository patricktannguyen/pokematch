import { describe, expect, it } from "vitest";
import { resolveCryUrl } from "./cryUrl";

describe("resolveCryUrl", () => {
  it("prefers the latest cry URL when present", () => {
    expect(
      resolveCryUrl({ latest: "https://example.com/latest.ogg", legacy: "https://example.com/legacy.ogg" }),
    ).toBe("https://example.com/latest.ogg");
  });

  it("falls back to the legacy cry URL when latest is null", () => {
    expect(resolveCryUrl({ latest: null, legacy: "https://example.com/legacy.ogg" })).toBe(
      "https://example.com/legacy.ogg",
    );
  });

  it("returns null when both latest and legacy are null", () => {
    expect(resolveCryUrl({ latest: null, legacy: null })).toBeNull();
  });

  it("returns null when cries is undefined", () => {
    expect(resolveCryUrl(undefined)).toBeNull();
  });
});
