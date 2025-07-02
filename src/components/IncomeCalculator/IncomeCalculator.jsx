// IncomeCalculator.jsx
import { useEffect, useState } from "react";
import { getWeekdays, fetchUsdRate, formatDaysWord, formatWorkDaysWord } from "../../utils/helpers";
import styles from "./IncomeCalculator.module.css";

export default function IncomeCalculator({ onTransfer }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthDays = new Date(year, month + 1, 0).getDate();
  const будні = getWeekdays(year, month);
  const робочіГодини = будні * 8;

  const [hoursWorked, setHoursWorked] = useState(0);
  const [hourlyRateUsd, setHourlyRateUsd] = useState(0);
  const [usdRate, setUsdRate] = useState(null);
  const [customRate, setCustomRate] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsdRate(controller.signal).then((r) => setUsdRate(r));
    return () => controller.abort();
  }, []);

  const rateToUse = customRate || usdRate || 0;
  const salaryUah = hoursWorked * hourlyRateUsd * rateToUse;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Калькулятор доходу</h2>
      <p className={styles.subtitle}>
        {today.toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" })}<br />
        {today.toLocaleDateString("uk-UA", { month: "long" })}:  
        <strong> {monthDays} {formatDaysWord(monthDays)}</strong> |  
        <strong> {будні} {formatWorkDaysWord(будні)}</strong> |  
        <strong> {робочіГодини} годин</strong>
      </p>

      <label className={styles.label}>
        Відпрацьовані години
        <input
          type="number"
          className={styles.input}
          value={hoursWorked || ""}
          onChange={(e) => setHoursWorked(Number(e.target.value))}
        />
      </label>

      <label className={styles.label}>
        Рейт (USD/год)
        <input
          type="number"
          className={styles.input}
          value={hourlyRateUsd || ""}
          onChange={(e) => setHourlyRateUsd(Number(e.target.value))}
        />
      </label>

      <label className={styles.label}>
        Курс USD-UAH {usdRate ? `(${usdRate.toFixed(2)} за НБУ)` : "(завантаження...)"} 
        <input
          type="number"
          className={styles.input}
          placeholder="Кастомний курс, якщо треба"
          value={customRate || ""}
          onChange={(e) => setCustomRate(Number(e.target.value))}
        />
      </label>

      <hr />

      <p className={styles.net}>
        Сума (UAH): <span>{salaryUah ? salaryUah.toFixed(2) : "-"}</span>
      </p>

      <button
        onClick={() => onTransfer(salaryUah)}
        className={styles.button}
        disabled={!salaryUah}
      >
        Розрахувати податки
      </button>
    </div>
  );
}
