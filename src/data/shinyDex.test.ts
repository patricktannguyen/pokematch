import { describe, expect, it } from "vitest";
import { isShinyThisSession, TOTAL_SHINY_COUNT } from "./shinyDex";
import { TOTAL_DEX_SIZE } from "./dexUniverse";

describe("shinyDex", () => {
  it("produces a shiny count within the bounds of the dataset", () => {
    expect(TOTAL_SHINY_COUNT).toBeGreaterThanOrEqual(0);
    expect(TOTAL_SHINY_COUNT).toBeLessThan(TOTAL_DEX_SIZE);
  });

  it("isShinyThisSession is deterministic for the same id within a session", () => {
    const id = 1;
    const first = isShinyThisSession(id);
    const second = isShinyThisSession(id);
    expect(first).toBe(second);
  });
});
