import { MIN_SALARY, ESV_COEFFICIENT, REPORT_PERIODS } from "./constants";

export interface TaxItem {
  label: string;
  rate: string;
  description: string;
  calculate: (amount: number, mode?: string) => number;
}

export interface TaxConfig {
  [key: string]: TaxItem;
}

export const TAX_CONFIG: TaxConfig = {
  single: {
    label: "Єдиний податок",
    rate: "5%",
    description: "від доходу",
    calculate: (amount) => amount * 0.05,
  },
  war: {
    label: "Військовий збір",
    rate: "1%",
    description: "від доходу",
    calculate: (amount) => amount * 0.01,
  },
  esv: {
    label: "ЄСВ",
    rate: `22% від ${MIN_SALARY} грн`,
    description: `від ${MIN_SALARY} грн (МЗП)`,
    calculate: (_, mode) =>
      MIN_SALARY * ESV_COEFFICIENT * (mode === REPORT_PERIODS.QUARTER ? 3 : 1),
  },
};

export const TAX_ITEMS_ORDER = ["single", "war", "esv"] as const;
