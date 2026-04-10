import { describe, it, expect } from "vitest";
import { calculateTaxes, calculateNetIncome } from "../src/utils/taxCalculator";

describe("tax calculation logic", () => {
  it("calculates monthly taxes correctly", () => {
    const taxData = calculateTaxes({ income: "15000", quarterlyIncome: "", mode: "month" });

    expect(taxData.isValid).toBe(true);
    expect(taxData.gross).toBe(15000);
    expect(taxData.taxes).toHaveLength(3);
    expect(taxData.taxes[0]).toEqual(
      expect.objectContaining({ label: "Єдиний податок", value: 750 })
    );
    expect(taxData.taxes[1]).toEqual(
      expect.objectContaining({ label: "Військовий збір", value: 150 })
    );
    expect(taxData.taxes[2]).toEqual(expect.objectContaining({ label: "ЄСВ", value: 1902.34 }));
    expect(calculateNetIncome(taxData)).toBeCloseTo(12197.66, 2);
  });

  it("calculates quarterly taxes correctly", () => {
    const taxData = calculateTaxes({ income: "", quarterlyIncome: "150000", mode: "quarter" });

    expect(taxData.isValid).toBe(true);
    expect(taxData.gross).toBe(150000);
    expect(taxData.taxes).toHaveLength(3);
    expect(taxData.taxes[0]).toEqual(
      expect.objectContaining({ label: "Єдиний податок", value: 7500 })
    );
    expect(taxData.taxes[1]).toEqual(
      expect.objectContaining({ label: "Військовий збір", value: 1500 })
    );
    expect(taxData.taxes[2].value).toBeCloseTo(5707.02, 2);
    expect(calculateNetIncome(taxData)).toBeCloseTo(135292.98, 2);
  });

  it("handles invalid inputs gracefully", () => {
    const taxData = calculateTaxes({ income: "invalid", quarterlyIncome: "", mode: "month" });

    expect(taxData.isValid).toBe(false);
    expect(taxData.gross).toBe(0);
    expect(taxData.taxes.every((tax) => tax.value === 0)).toBe(true);
    expect(calculateNetIncome(taxData)).toBe(0);
  });

  it("handles negative values", () => {
    const taxData = calculateTaxes({ income: "-1000", quarterlyIncome: "", mode: "month" });

    expect(taxData.isValid).toBe(false);
    expect(taxData.gross).toBe(0);
    expect(calculateNetIncome(taxData)).toBe(0);
  });

  it("ignores wrong mode inputs", () => {
    const taxData = calculateTaxes({ income: "15000", quarterlyIncome: "", mode: "invalid" });

    expect(taxData.isValid).toBe(false);
    expect(taxData.gross).toBe(0);
  });
});
