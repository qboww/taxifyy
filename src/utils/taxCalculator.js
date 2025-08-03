// utils/taxCalculator.js
import { REPORT_PERIODS } from "./constants";
import { TAX_CONFIG, TAX_ITEMS_ORDER } from "./taxConfig";

export const calculateTaxes = (incomeData) => {
  const { income, quarterlyIncome, mode } = incomeData;
  const gross = parseFloat(income);
  const quarterGross = parseFloat(quarterlyIncome);
  const isValid = mode === REPORT_PERIODS.MONTH ? !isNaN(gross) && gross >= 0 : !isNaN(quarterGross) && quarterGross >= 0;

  const amount = mode === REPORT_PERIODS.MONTH ? gross : quarterGross;
  const multiplier = mode === REPORT_PERIODS.QUARTER ? 3 : 1;

  const taxes = TAX_ITEMS_ORDER.map(key => {
    const config = TAX_CONFIG[key];
    const value = isValid ? config.calculate(amount) * multiplier : 0;
    return { ...config, value };
  });

  return {
    taxes,
    multiplier,
    isValid,
    gross: isValid ? amount * multiplier : 0
  };
};

export const calculateNetIncome = (taxData) => {
  const totalTaxes = taxData.taxes.reduce((sum, tax) => sum + tax.value, 0);
  return taxData.isValid ? taxData.gross - totalTaxes : 0;
};