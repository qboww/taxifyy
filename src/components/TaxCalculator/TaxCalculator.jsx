import styles from "./TaxCalculator.module.css";
import { REPORT_PERIODS, MIN_SALARY, SINGLE_TAX_RATE, WAR_TAX_RATE, ESV_COEFFICIENT } from "../../utils/constants";

export default function TaxCalculator({ income, setIncome, mode, setMode, quarterlyIncome, setQuarterlyIncome }) {
  const gross = parseFloat(income);
  const quarterGross = parseFloat(quarterlyIncome);
  const isValid = mode === REPORT_PERIODS.MONTH ? !isNaN(gross) && gross >= 0 : !isNaN(quarterGross) && quarterGross >= 0;

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
  const netIncome = isValid ? (mode === REPORT_PERIODS.QUARTER ? quarterGross : gross * multiplier) - totalTaxes : 0;

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>Калькулятор податків</h2>
        <p className={styles.subtitle}>ФОП III групи (спрощена система)</p>
      </div>

      <div className={styles.inputToggle}>
        <label className={styles.label}>
          {"Отримано коштів (UAH):"}
          <input
            className={styles.input}
            type="number"
            placeholder={mode === REPORT_PERIODS.MONTH ? "Дохід за місяць, грн" : "Дохід за квартал, грн"}
            value={mode === REPORT_PERIODS.MONTH ? income : quarterlyIncome}
            onChange={(e) => (mode === REPORT_PERIODS.MONTH ? setIncome(e.target.value) : setQuarterlyIncome(e.target.value))}
          />
        </label>

        <label className={styles.label}>
          {"Формат сплати:"}
          <div className={`${styles.toggleContainer} toggle-container`}>
            <button className={`toggle-option ${mode === REPORT_PERIODS.MONTH ? "active" : ""}`} onClick={() => setMode(REPORT_PERIODS.MONTH)}>
              Місяць
            </button>
            <button className={`toggle-option ${mode === REPORT_PERIODS.QUARTER ? "active" : ""}`} onClick={() => setMode(REPORT_PERIODS.QUARTER)}>
              Квартал
            </button>
          </div>
        </label>
      </div>

      <section className={styles.results}>
        <div className={styles.pretotals}>
          <p>
            Єдиний податок (5 %): <span>{isValid ? singleTax.toFixed(2) : "-"} грн</span>
          </p>
          <p>
            Військовий збір (1.5 %): <span>{isValid ? warTax.toFixed(2) : "-"} грн</span>
          </p>
          <p>
            ЄСВ (22 % від {MIN_SALARY} грн): <span>{esv.toFixed(2)} грн</span>
          </p>
        </div>
        <p>
          Загальні податки: <span>{isValid ? totalTaxes.toFixed(2) : "-"} грн</span>
        </p>
        <hr className={styles.hr} />
        <p className={styles.net}>
          Чистий дохід: <span>{isValid ? netIncome.toFixed(2) : "-"} грн</span>
        </p>
      </section>
    </div>
  );
}
