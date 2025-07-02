import { useEffect, useState } from "react";
import { getWeekdays, fetchUsdRate, formatDaysWord, formatWorkDaysWord } from "../../utils/helpers";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import styles from "./IncomeCalculator.module.css";

export default function IncomeCalculator({ onTransfer }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthDays = new Date(year, month + 1, 0).getDate();
  const weekdays = getWeekdays(year, month);
  const workingHours = weekdays * 8;

  const [hoursWorked, setHoursWorked] = useLocalStorageWithExpiry("incomeCalc_hoursWorked", workingHours);
  const [hourlyRateUsd, setHourlyRateUsd] = useLocalStorageWithExpiry("incomeCalc_hourlyRateUsd", 0);
  const [customRate, setCustomRate] = useLocalStorageWithExpiry("incomeCalc_customRate", 0);

  const [usdRate, setUsdRate] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsdRate(controller.signal).then((rate) => {
      if (rate) {
        setUsdRate(rate);
        if (!customRate) {
          setCustomRate(rate);
        }
      }
    });
    return () => controller.abort();
  }, []);

  const rateToUse = customRate || usdRate || 0;
  const salaryUah = hoursWorked * hourlyRateUsd * rateToUse;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Калькулятор доходу</h1>
      <p className={styles.subtitle}>
        {today.toLocaleDateString("uk-UA", { month: "long" })}:
        <strong>
          {" "}
          {monthDays} {formatDaysWord(monthDays)}
        </strong>{" "}
        -
        <strong>
          {" "}
          {weekdays} {formatWorkDaysWord(weekdays)}
        </strong>{" "}
        -<strong> {workingHours} годин</strong>
        <br />
        {"сьогодні: "}
        <strong>
          {today.toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </strong>
      </p>

      <label className={styles.label}>
        Відпрацьовані години:
        <input type="number" 
        placeholder="Відпрацьований час" 
        className={styles.input} 
        value={hoursWorked} 
        onChange={(e) => setHoursWorked(Number(e.target.value))} />
      </label>

      <label className={styles.label}>
        Рейт (USD/год):
        <input type="number" 
        placeholder="Власний рейт" 
        className={styles.input} 
        value={hourlyRateUsd || ""} 
        onChange={(e) => setHourlyRateUsd(Number(e.target.value))} />
      </label>

      <label className={styles.label}>
        Курс USD НБУ сьогодні: {usdRate ? `${usdRate} грн` : "(завантаження...)"}
        <input
          type="number"
          className={styles.input}
          placeholder="Власний курс, якщо треба"
          value={customRate || ""}
          onChange={(e) => setCustomRate(Number(e.target.value))}
          step="0.0001"
        />
      </label>

      <hr />

      <section className={styles.results}>
        <p className={styles.net}>
          Сума: <span>{salaryUah ? salaryUah.toFixed(2) : "-"} грн</span>
        </p>
      </section>

      <button onClick={() => onTransfer(salaryUah)} className={styles.button} disabled={!salaryUah}>
        Розрахувати податки
      </button>
    </div>
  );
}
