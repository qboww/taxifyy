import styles from "./TaxCalculator.module.css";
import FormInput from "../UI/FormInput/FormInput";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import { REPORT_PERIODS } from "../../utils/constants";
import { useTaxCalculations } from "../../hooks/useTaxCalculations";
import Paycheck from "../UI/Paycheck/Paycheck";

export default function StatisticsTaxCalculator({
  income,
  setIncome,
  mode,
  setMode,
  quarterlyIncome,
  setQuarterlyIncome,
}) {
  const currentValue = mode === REPORT_PERIODS.MONTH ? income : quarterlyIncome;
  const isValidInput =
    currentValue === "" || (!isNaN(parseFloat(currentValue)) && parseFloat(currentValue) >= 0);

  const { taxData, netIncome, totalTaxes } = useTaxCalculations({ income, quarterlyIncome, mode });

  const handleInputChange = (value) => {
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      mode === REPORT_PERIODS.MONTH ? setIncome(value) : setQuarterlyIncome(value);
    }
  };

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
          value={currentValue}
          onChange={handleInputChange}
          error={!isValidInput ? "Введіть додатне число" : null}
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

      {isValidInput && (
        <Paycheck
          items={taxData.taxes}
          subtotalLabel="Загальні податки"
          subtotalValue={totalTaxes}
          totalLabel="Чистий дохід"
          totalValue={netIncome}
        />
      )}
    </div>
  );
}
