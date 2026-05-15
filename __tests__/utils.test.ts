import { describe, it, expect } from "vitest";
import { cn, formatPrice, slugify, truncate } from "../src/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("ignores falsy values", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });
});

describe("formatPrice", () => {
  it("formats USD for en locale", () => {
    const result = formatPrice(125000, "USD", "en");
    expect(result).toContain("$");
    expect(result).toContain("125");
  });

  it("formats JPY without decimals", () => {
    const result = formatPrice(1500000, "JPY", "ja");
    expect(result).toContain("¥");
    expect(result).not.toContain(".");
  });

  it("formats EUR for de locale", () => {
    const result = formatPrice(9900, "EUR", "de");
    expect(result).toContain("€");
  });

  it("handles zero", () => {
    expect(formatPrice(0, "USD", "en")).toContain("0");
  });

  it("falls back gracefully for invalid locale", () => {
    const result = formatPrice(1000, "USD", "invalid-locale");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("diamond ring")).toBe("diamond-ring");
  });

  it("removes special characters", () => {
    expect(slugify("Luxury! @Watch")).toBe("luxury-watch");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles multi-hyphen sequences", () => {
    expect(slugify("a  b   c")).toBe("a-b-c");
  });
});

describe("truncate", () => {
  it("returns string if shorter than length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates at word boundary", () => {
    const result = truncate("hello world beautiful", 15);
    expect(result.length).toBeLessThanOrEqual(18);
    expect(result).toMatch(/…$/);
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});
