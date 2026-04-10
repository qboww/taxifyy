import { useMemo } from "react";
import { calculateTaxes, calculateNetIncome, IncomeData, TaxData } from "../utils/taxCalculator";

/**
 * Custom hook for tax calculations with memoization
 * @param incomeData - Income data object
 * @returns Object containing taxData, netIncome, and totalTaxes
 */
export const useTaxCalculations = (incomeData: IncomeData) => {
  const taxData: TaxData = useMemo(() => calculateTaxes(incomeData), [incomeData]);

  const netIncome: number = useMemo(() => calculateNetIncome(taxData), [taxData]);

  const totalTaxes: number = useMemo(
    () => taxData.taxes.reduce((sum, tax) => sum + tax.value, 0),
    [taxData.taxes]
  );

  return {
    taxData,
    netIncome,
    totalTaxes,
  };
};
