import styles from "./TaxCalculator.module.css";
import FormInput from "../UI/FormInput/FormInput";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import { REPORT_PERIODS } from "../../utils/constants";
import { calculateTaxes, calculateNetIncome } from "../../utils/taxCalculator";
import Paycheck from "../UI/Paycheck/Paycheck";

export default function StatisticsTaxCalculator({ income, setIncome, mode, setMode, quarterlyIncome, setQuarterlyIncome }) {
  const taxData = calculateTaxes({ income, quarterlyIncome, mode });
  const netIncome = calculateNetIncome(taxData);
  const totalTaxes = taxData.taxes.reduce((sum, tax) => sum + tax.value, 0);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className="title">Розрахунок податків</h1>
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

      <Paycheck
        items={taxData.taxes}
        subtotalLabel="Загальні податки"
        subtotalValue={totalTaxes}
        totalLabel="Чистий дохід"
        totalValue={netIncome}
      />
    </div>
  );
}
