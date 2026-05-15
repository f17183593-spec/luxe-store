import { describe, it, expect } from "vitest";
import {
  getCurrencyFromCountry,
  getCurrencySymbol,
} from "../src/lib/currency";

describe("getCurrencyFromCountry", () => {
  it("returns USD for US", () => {
    expect(getCurrencyFromCountry("US")).toBe("USD");
  });

  it("returns EUR for DE", () => {
    expect(getCurrencyFromCountry("DE")).toBe("EUR");
  });

  it("returns JPY for JP", () => {
    expect(getCurrencyFromCountry("JP")).toBe("JPY");
  });

  it("returns AED for AE", () => {
    expect(getCurrencyFromCountry("AE")).toBe("AED");
  });

  it("returns default USD for unknown country", () => {
    expect(getCurrencyFromCountry("XX")).toBe("USD");
  });

  it("returns USD for empty string", () => {
    expect(getCurrencyFromCountry("")).toBe("USD");
  });
});

describe("getCurrencySymbol", () => {
  it("returns $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("returns € for EUR", () => {
    expect(getCurrencySymbol("EUR")).toBe("€");
  });

  it("returns £ for GBP", () => {
    expect(getCurrencySymbol("GBP")).toBe("£");
  });

  it("returns code for unknown currency", () => {
    expect(getCurrencySymbol("XYZ")).toBe("XYZ");
  });
});
