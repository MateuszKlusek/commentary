import { describe, it, expect } from "vitest";
import { defaultCopy } from "./defaults";

describe("init", () => {
  it("should return the correct copy", () => {
    const copy = defaultCopy;
    expect(copy).toBeDefined();
  });
});
