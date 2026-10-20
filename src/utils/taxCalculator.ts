import { REPORT_PERIODS } from "./constants";
import { TAX_CONFIG, TAX_ITEMS_ORDER, TaxItem } from "./taxConfig";

export interface IncomeData {
  income: string | number;
  quarterlyIncome: string | number;
  annualIncome?: string | number;
  mode: string;
}

export interface TaxData {
  taxes: (TaxItem & { value: number })[];
  isValid: boolean;
  gross: number;
}

/**
 * Calculates taxes based on income data and reporting period.
 * @param incomeData - Object containing income, quarterlyIncome, and mode
 * @returns TaxData object with calculated taxes, validity, and gross income
 */
export const calculateTaxes = (incomeData: IncomeData): TaxData => {
  const { income, quarterlyIncome, annualIncome = "", mode } = incomeData;
  const incomeByPeriod = {
    [REPORT_PERIODS.MONTH]: income,
    [REPORT_PERIODS.QUARTER]: quarterlyIncome,
    [REPORT_PERIODS.YEAR]: annualIncome,
  };
  const selectedIncome = incomeByPeriod[mode as keyof typeof incomeByPeriod];
  const baseAmount = parseFloat(String(selectedIncome));
  const isValid = selectedIncome !== undefined && !isNaN(baseAmount) && baseAmount >= 0;

  const taxes = TAX_ITEMS_ORDER.map((key) => {
    const config = TAX_CONFIG[key];
    let value = 0;

    if (isValid) {
      value = config.calculate(baseAmount, mode);
    }

    return { ...config, value };
  });

  return {
    taxes,
    isValid,
    gross: isValid ? baseAmount : 0,
  };
};

/**
 * Calculates net income after taxes.
 * @param taxData - TaxData object from calculateTaxes
 * @returns Net income as a number
 */
export const calculateNetIncome = (taxData: TaxData): number => {
  const totalTaxes = taxData.taxes.reduce((sum, tax) => sum + tax.value, 0);
  return taxData.isValid ? taxData.gross - totalTaxes : 0;
};
