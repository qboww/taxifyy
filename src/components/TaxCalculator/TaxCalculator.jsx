import styles from "./TaxCalculator.module.css";
import FormInput from "../UI/FormInput/FormInput";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import { REPORT_PERIODS, MIN_SALARY, SINGLE_TAX_RATE, WAR_TAX_RATE, ESV_COEFFICIENT } from "../../utils/constants";

export default function TaxCalculator({ income, setIncome, mode, setMode, quarterlyIncome, setQuarterlyIncome }) {
  const gross = parseFloat(income);
  const quarterGross = parseFloat(quarterlyIncome);
  const isValid =
    mode === REPORT_PERIODS.MONTH ? !isNaN(gross) && gross >= 0 : !isNaN(quarterGross) && quarterGross >= 0;

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
        <FormInput
          label="Дохід (UAH):"
          type="number"
          placeholder={mode === REPORT_PERIODS.MONTH ? "Дохід за місяць" : "Дохід за квартал"}
          value={mode === REPORT_PERIODS.MONTH ? income : quarterlyIncome}
          onChange={(value) => (mode === REPORT_PERIODS.MONTH ? setIncome(value) : setQuarterlyIncome(e.target.value))}
        />

        <label className={styles.label}>
          {"Форма сплати:"}
          <ToggleSwitch
            label="Форма сплати:"
            options={[
              { label: "Місяць", value: REPORT_PERIODS.MONTH },
              { label: "Квартал", value: REPORT_PERIODS.QUARTER },
            ]}
            value={mode}
            onChange={setMode}
          />
        </label>
      </div>

      <section className={styles.results}>
        <div className={styles.pretotals}>
          <p>
            Єдиний податок (5 %): <span>{isValid ? singleTax.toFixed(2) : "-"} грн</span>
          </p>
          <p>
            Військовий збір (1 %): <span>{isValid ? warTax.toFixed(2) : "-"} грн</span>
          </p>
          <p>
            ЄСВ (22 % від {MIN_SALARY} грн): <span>{esv.toFixed(2)} грн</span>
          </p>
        </div>
        <p>
          Загальний дохід: <span>{isValid ? totalTaxes.toFixed(2) : "-"} грн</span>
        </p>
        <hr className={styles.hr} />
        <p className={styles.net}>
          Чистий дохід: <span>{isValid ? netIncome.toFixed(2) : "-"} грн</span>
        </p>
      </section>
    </div>
  );
}
