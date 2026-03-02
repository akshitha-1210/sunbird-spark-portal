import { describe, it, expect } from "vitest";
import { getInitials, getGradientByTitle, hashString } from "./thumbnailUtils";

describe("getInitials", () => {
  it("returns initials of first two meaningful words", () => {
    expect(getInitials("Introduction to Mathematics")).toBe("IM");
  });

  it("skips stop words (the, for, and, of)", () => {
    expect(getInitials("The Art of War")).toBe("AW");
  });

  it("handles task examples from requirements", () => {
    expect(getInitials("The AI Engineer Course 2026")).toBe("AE");
    expect(getInitials("Data Engineering Foundations")).toBe("DE");
    expect(getInitials("Generative AI for Cybersecurity")).toBe("GA");
  });

  it('returns "?" for empty string', () => {
    expect(getInitials("")).toBe("?");
  });

  it('returns "?" for whitespace-only input', () => {
    expect(getInitials("   ")).toBe("?");
  });

  it('returns "?" when all words are stop words', () => {
    expect(getInitials("the for and of")).toBe("?");
  });

  it("returns single initial for single meaningful word", () => {
    expect(getInitials("React")).toBe("R");
  });

  it("only takes first 2 meaningful words", () => {
    expect(getInitials("Very Long Title Indeed")).toBe("VL");
  });

  it("handles extra whitespace", () => {
    expect(getInitials("  hello   world  ")).toBe("HW");
  });

  it("uppercases lowercase initials", () => {
    expect(getInitials("advanced physics")).toBe("AP");
  });
});

describe("hashString", () => {
  it("returns a non-negative number", () => {
    expect(hashString("test")).toBeGreaterThanOrEqual(0);
  });

  it("is deterministic (same input -> same output)", () => {
    expect(hashString("hello")).toBe(hashString("hello"));
  });

  it("returns 0 for empty string", () => {
    expect(hashString("")).toBe(0);
  });
});

describe("getGradientByTitle", () => {
  const KNOWN_GRADIENTS = [
    "linear-gradient(135deg, #7C3AED, #4F46E5)",
    "linear-gradient(135deg, #2563EB, #06B6D4)",
    "linear-gradient(135deg, #059669, #10B981)",
    "linear-gradient(135deg, #EA580C, #F59E0B)",
    "linear-gradient(135deg, #DB2777, #9333EA)",
  ];

  it("returns one of the known gradients", () => {
    expect(KNOWN_GRADIENTS).toContain(getGradientByTitle("Some Title"));
  });

  it("is deterministic", () => {
    const title = "Introduction to Physics";
    expect(getGradientByTitle(title)).toBe(getGradientByTitle(title));
  });

  it("can produce different gradients for different titles", () => {
    const results = new Set(
      ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta"].map(
        getGradientByTitle
      )
    );
    expect(results.size).toBeGreaterThan(1);
  });
});
