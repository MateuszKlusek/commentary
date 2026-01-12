import { describe, expect, it } from "vitest";
import { defaultCopy } from "./defaults";
import { handlePluralization } from "./utils";

describe("handlePluralization tests", () => {
  it("returns first value for 3-tier pluralization", () => {
    const result = handlePluralization({
      quantity: 0,
      rules: defaultCopy.comment,
    });
    expect(result).toBe("0 Comments");
  });

  it("returns second value for 3-tier pluralization", () => {
    const result = handlePluralization({
      quantity: 1,
      rules: defaultCopy.comment,
    });
    expect(result).toBe("1 Comment");
  });

  it("returns third value for 3-tier pluralization", () => {
    const result = handlePluralization({
      quantity: 2,
      rules: defaultCopy.comment,
    });
    expect(result).toBe("2 Comments");
  });

  it("returns flat rule value for a flat rule", () => {
    const result = handlePluralization({
      quantity: 8,
      rules: [{ from: 0, label: "komentarzy" }],
    });

    expect(result).toBe("8 komentarzy");
  });

  it("returns last value for a quantity that is less than the first rule", () => {
    const result = handlePluralization({
      quantity: 0,
      rules: [{ from: 1, label: "komentarzy" }],
    });

    expect(result).toBe("0 komentarzy");
  });

  it("returns last value for an empty rule", () => {
    const result = handlePluralization({
      quantity: 0,
      rules: [],
    });

    expect(result).toBe("0");
  });
});
