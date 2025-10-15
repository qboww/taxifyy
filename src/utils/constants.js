export const MIN_SALARY = 8000; // мінімальна ЗП (грн)
export const ESV_COEFFICIENT = 0.22; // ставка ЄСВ
export const SINGLE_TAX_RATE = 0.05; // 5% єдиний податок
export const WAR_TAX_RATE = 0.01; // 1% військовий збір

export const TAX_TYPES = {
  SINGLE: 'single',
  WAR: 'war',
  ESV: 'esv'
};

export const REPORT_PERIODS = {
  MONTH: 'month',
  QUARTER: 'quarter'
};

export const TARIFFS = {
  water: 35.0,        // грн/м³
  gas: 8.65,          // грн/м³
  electricity: 2.64,  // грн/кВт·год
  heating: 35.0,      // грн/м²
};

export const UNITS = {
  water: "грн/м³",
  gas: "грн/м³",
  electricity: "грн/кВт·год",
  heating: "грн/м²",
};

export const DEFAULT_SERVICES = [
  { type: "Вода", coefficient: TARIFFS.water, unit: UNITS.water, quantity: 0 },
  { type: "Газ", coefficient: TARIFFS.gas, unit: UNITS.gas, quantity: 0 },
  { type: "Електроенергія", coefficient: TARIFFS.electricity, unit: UNITS.electricity, quantity: 0 },
  { type: "Опалення", coefficient: TARIFFS.heating, unit: UNITS.heating, quantity: 0 },
  { type: "Доставка газу", fixedAmount: 100, isFixed: true, unit: "" },
  { type: "Сміття", fixedAmount: 50, isFixed: true, unit: "" },
];