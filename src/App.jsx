import { useState, useEffect } from "react";
import { 
  MIN_SALARY, 
  ESV_COEFFICIENT, 
  SINGLE_TAX_RATE, 
  WAR_TAX_RATE,
  REPORT_PERIODS
} from "./constants";
import "./App.css";

const useLocalStorageWithExpiry = (key, initialValue, expiryDays = 30) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    if (!item) return initialValue;
    
    try {
      const parsed = JSON.parse(item);
      if (parsed.expiry && new Date().getTime() > parsed.expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }
      return parsed.value !== undefined ? parsed.value : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const now = new Date();
    const expiryDate = now.getTime() + expiryDays * 24 * 60 * 60 * 1000;
    const item = {
      value: value,
      expiry: expiryDate
    };
    localStorage.setItem(key, JSON.stringify(item));
  }, [key, value, expiryDays]);

  return [value, setValue];
};

export default function App() {
 const [income, setIncome] = useLocalStorageWithExpiry("taxCalc_income", "");
  const [mode, setMode] = useLocalStorageWithExpiry("taxCalc_mode", REPORT_PERIODS.MONTH);
  const [quarterlyIncome, setQuarterlyIncome] = useLocalStorageWithExpiry("taxCalc_quarterlyIncome", "");

  const gross = parseFloat(income);
  const quarterGross = parseFloat(quarterlyIncome);
  const isValid = mode === REPORT_PERIODS.MONTH 
    ? !isNaN(gross) && gross >= 0 
    : !isNaN(quarterGross) && quarterGross >= 0;

  const singleTaxMo = mode === REPORT_PERIODS.MONTH && isValid ? gross * SINGLE_TAX_RATE : 0;
  const warTaxMo = mode === REPORT_PERIODS.MONTH && isValid ? gross * WAR_TAX_RATE : 0;
  const esvMo = MIN_SALARY * ESV_COEFFICIENT;

  const singleTaxQr = mode === REPORT_PERIODS.QUARTER && isValid ? quarterGross * SINGLE_TAX_RATE : 0;
  const warTaxQr = mode === REPORT_PERIODS.QUARTER && isValid ? quarterGross * WAR_TAX_RATE : 0;

  const multiplier = mode === REPORT_PERIODS.QUARTER ? 3 : 1;

  const singleTax = mode === REPORT_PERIODS.QUARTER ? singleTaxQr : singleTaxMo * multiplier;
  const warTax = mode === REPORT_PERIODS.QUARTER ? warTaxQr : warTaxMo * multiplier;
  const esv = esvMo * multiplier;

  const totalTaxes = singleTax + warTax + esv;
  const netIncome = isValid 
    ? (mode === REPORT_PERIODS.QUARTER ? quarterGross : gross * multiplier) - totalTaxes 
    : 0;

  return (
    <main className="app">
      <h1 className="title">Калькулятор податків</h1>
      <h2 className="subtitle">ФОП III групи (спрощена система)</h2>

      {mode === REPORT_PERIODS.MONTH ? (
        <input
          className="income-input"
          type="number"
          placeholder="Дохід за місяць, грн"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      ) : (
        <input
          className="income-input"
          type="number"
          placeholder="Дохід за квартал, грн"
          value={quarterlyIncome}
          onChange={(e) => setQuarterlyIncome(e.target.value)}
        />
      )}

      <div className="toggle-container">
        <button
          className={`toggle-option ${mode === REPORT_PERIODS.MONTH ? "active" : ""}`}
          onClick={() => setMode(REPORT_PERIODS.MONTH)}
        >
          Місяць
        </button>
        <button
          className={`toggle-option ${mode === REPORT_PERIODS.QUARTER ? "active" : ""}`}
          onClick={() => setMode(REPORT_PERIODS.QUARTER)}
        >
          Квартал
        </button>
      </div>

      <section className="results">
        <p>
          Єдиний&nbsp;податок&nbsp;(5 %):{" "}
          <span>{isValid ? singleTax.toFixed(2) : "-"} грн</span>
        </p>
        <p>
          Військовий&nbsp;збір&nbsp;(1.5 %):{" "}
          <span>{isValid ? warTax.toFixed(2) : "-"} грн</span>
        </p>
        <p>
          ЄСВ&nbsp;(22 % від&nbsp;{MIN_SALARY} грн):{" "}
          <span>{esv.toFixed(2)} грн</span>
        </p>
        <p>
          Загальні&nbsp;податки:{" "}
          <span>{isValid ? totalTaxes.toFixed(2) : "-"} грн</span>
        </p>
        <hr />
        <p className="net">
          Чистий&nbsp;дохід:{" "}
          <span>{isValid ? netIncome.toFixed(2) : "-"} грн</span>
        </p>
      </section>
    </main>
  );
}