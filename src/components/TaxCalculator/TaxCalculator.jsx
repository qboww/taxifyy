import styles from "./TaxCalculator.module.css";
import FormInput from "../UI/FormInput/FormInput";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import { REPORT_PERIODS, MIN_SALARY } from "../../utils/constants";
import { calculateTaxes, calculateNetIncome } from "../../utils/taxCalculator";

export default function TaxCalculator({ income, setIncome, mode, setMode, quarterlyIncome, setQuarterlyIncome }) {
  const taxData = calculateTaxes({ income, quarterlyIncome, mode });
  const netIncome = calculateNetIncome(taxData);
  const totalTaxes = taxData.taxes.reduce((sum, tax) => sum + tax.value, 0);

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
          onChange={(value) => (mode === REPORT_PERIODS.MONTH ? setIncome(value) : setQuarterlyIncome(value))}
        />

        <ToggleSwitch
          label="Форма сплати:"
          options={[
            { label: "Місяць", value: REPORT_PERIODS.MONTH },
            { label: "Квартал", value: REPORT_PERIODS.QUARTER },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>

      <section className={styles.results}>
        <div className={styles.pretotals}>
          {taxData.taxes.map((tax, index) => (
            <p key={index}>
              {tax.label} ({tax.rate}): <span>{taxData.isValid ? tax.value.toFixed(2) : "-"} грн</span>
            </p>
          ))}
        </div>
        <p>
          Загальні податки: <span>{taxData.isValid ? totalTaxes.toFixed(2) : "-"} грн</span>
        </p>
        <hr className={styles.hr} />
        <p className={styles.net}>
          Чистий дохід: <span>{taxData.isValid ? netIncome.toFixed(2) : "-"} грн</span>
        </p>
      </section>
    </div>
  );
}