import { MIN_SALARY } from "./constants";

export const TAX_CONFIG = {
  single: {
    label: "Єдиний податок",
    rate: "5%",
    description: "від доходу",
    calculate: (amount) => amount * 0.05
  },
  war: {
    label: "Військовий збір",
    rate: "1%",
    description: "від доходу",
    calculate: (amount) => amount * 0.01
  },
  esv: {
    label: "ЄСВ",
    rate: "22%",
    description: `від ${MIN_SALARY} грн (МЗП)`,
    calculate: () => MIN_SALARY * 0.22
  }
};

export const TAX_ITEMS_ORDER = ["single", "war", "esv"];