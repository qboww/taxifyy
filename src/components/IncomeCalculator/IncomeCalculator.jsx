import { useEffect, useState, useRef  } from "react";
import { getWeekdays, fetchUsdRate, formatHoursWord, formatDaysWord, formatWorkDaysWord } from "../../utils/helpers";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { StaticCalendar } from "../../components/StaticCalendar/StaticCalendar";
import { LuCalendarFold } from "react-icons/lu";
import { MdCurrencyExchange, MdContentPaste } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import styles from "./IncomeCalculator.module.css";

export default function IncomeCalculator({ onTransfer }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthDays = new Date(year, month + 1, 0).getDate();
  const weekdays = getWeekdays(year, month);
  const workingHours = weekdays * 8;
  const calendarRef = useRef();

  const [hoursWorked, setHoursWorked] = useLocalStorageWithExpiry("incomeCalc_hoursWorked", workingHours);
  const [hourlyRateUsd, setHourlyRateUsd] = useLocalStorageWithExpiry("incomeCalc_hourlyRateUsd", 0);
  const [customRate, setCustomRate] = useLocalStorageWithExpiry("incomeCalc_customRate", 0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [usdRate, setUsdRate] = useState(null);
  const [usdDate, setUsdDate] = useState(null);

  const handleSyncHours = (hours) => {
    setHoursWorked(hours);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUsdRate(controller.signal).then((res) => {
      if (res?.rate) {
        setUsdRate(res.rate);
        setUsdDate(res.exchangedate);
        if (!customRate || customRate === 0) {
          setCustomRate(res.rate);
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
      <div className={styles.subCalendar}>
        <span className={styles.subtitle}>
          <strong>сьогодні: </strong>
          {today.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          {"(Q"}
          {Math.floor(today.getMonth() / 3) + 1}
          {")"}
          <br />
          <strong>{today.toLocaleDateString("uk-UA", { month: "long" })}:</strong> {monthDays} {formatDaysWord(monthDays)}
          {" - "}
          {weekdays} {formatWorkDaysWord(weekdays)}
          {" - "}
          {workingHours} {formatHoursWord(workingHours)}
        </span>
        <button onClick={() => setIsCalendarOpen((prev) => !prev)} className={`${styles.calendarBtn} ${styles.button}`} style={{ marginTop: "8px" }}>
          {isCalendarOpen ? <IoClose size={20} /> : <LuCalendarFold size={20} />}
        </button>
      </div>

      {isCalendarOpen && <StaticCalendar ref={calendarRef} year={year} month={month} today={today} onSyncHours={handleSyncHours} />}

      <div className={styles.hourRate}>
        <label className={styles.label}>
          Відпрацьовані години:
          <input
            type="number"
            placeholder="Відпрацьований час"
            className={styles.input}
            value={hoursWorked}
            onChange={(e) => setHoursWorked(Number(e.target.value))}
          />
        </label>
        <label className={styles.label}>
          Рейт (USD/год):
          <input
            type="number"
            placeholder="Власний рейт"
            className={styles.input}
            value={hourlyRateUsd || ""}
            onChange={(e) => setHourlyRateUsd(Number(e.target.value))}
          />
        </label>
      </div>

      <label className={styles.label}>
        Курс USD НБУ {usdDate || "..."}: {usdRate ? `${usdRate} грн` : "(завантаження...)"}
        <div className={styles.inpQa}>
          <input
            type="number"
            className={styles.input}
            placeholder="Власний курс, якщо треба"
            value={customRate || ""}
            onChange={(e) => setCustomRate(Number(e.target.value))}
            step="0.0001"
          />

          {usdRate && customRate !== usdRate && (
            <button type="button" className={`${styles.button}`} onClick={() => setCustomRate(usdRate)}>
              <MdContentPaste size={20}/>
            </button>
          )}

          <button className={`${styles.qaBtn} ${styles.button}`} onClick={() => window.open("https://bank.gov.ua/ua/markets/exchangerates", "_blank")}>
            <MdCurrencyExchange size={20} />
          </button>
        </div>
      </label>

      <hr />

      <section className={styles.results}>
        <p className={styles.net}>
          Сума: <span>{salaryUah ? salaryUah.toFixed(2) : "-"} грн</span>
        </p>
      </section>

      <button onClick={() => onTransfer(salaryUah)} className={styles.button} disabled={!salaryUah}>
        Податки за місяць
      </button>
    </div>
  );
}
