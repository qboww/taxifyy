import { useEffect, useState, useRef } from "react";
import { getWeekdays, fetchUsdRate, formatHoursWord, formatDaysWord, formatWorkDaysWord } from "../../utils/helpers";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { StaticCalendar } from "../../components/StaticCalendar/StaticCalendar";
import { LuCalendarFold } from "react-icons/lu";
import { MdCurrencyExchange, MdContentPaste } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import FormInput from "../UI/FormInput/FormInput";
import Button from "../UI/Button/Button";

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
        if (!customRate) {
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
          <strong>{today.toLocaleDateString("uk-UA", { month: "long" })}:</strong> {monthDays}{" "}
          {formatDaysWord(monthDays)}
          {" - "}
          {weekdays} {formatWorkDaysWord(weekdays)}
          {" - "}
          {workingHours} {formatHoursWord(workingHours)}
        </span>

        <Button
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          variant="icon"
          icon={isCalendarOpen ? IoClose : LuCalendarFold}
          className={styles.calendarBtn}
        />
      </div>

      {isCalendarOpen && (
        <StaticCalendar ref={calendarRef} year={year} month={month} today={today} onSyncHours={handleSyncHours} />
      )}

      <div className={styles.hourRate}>
        <FormInput
          label="Відпрацьовані години:"
          type="number"
          placeholder="Відпрацьований час"
          value={hoursWorked}
          onChange={(value) => setHoursWorked(Number(value))}
        />

        <FormInput
          label="Рейт (USD/год):"
          type="number"
          placeholder="Власний рейт"
          value={hourlyRateUsd}
          onChange={(value) => setHourlyRateUsd(Number(value))}
        />
      </div>

      <label className={styles.label}>
        Курс USD НБУ {usdDate || "..."}: {usdRate ? `${usdRate} грн` : "(завантаження...)"}
        <div className={styles.rateWrapper}>
          <FormInput
            type="number"
            placeholder="Власний курс, якщо треба"
            value={customRate}
            onChange={(value) => setCustomRate(Number(value))}
          />

          {usdRate && customRate !== usdRate && (
            <Button
              onClick={() => setCustomRate(usdRate)}
              variant="icon"
              icon={MdContentPaste}
              disabled={!usdRate || customRate === usdRate}
            />
          )}

          <Button
            onClick={() => window.open("https://bank.gov.ua/ua/markets/exchangerates", "_blank")}
            variant="icon"
            icon={MdCurrencyExchange}
          />
        </div>
      </label>

      <hr />

      <section className={styles.results}>
        <p className={styles.net}>
          Сума: <span>{salaryUah ? salaryUah.toFixed(2) : "-"} грн</span>
        </p>
      </section>

      <Button onClick={() => onTransfer(salaryUah)} disabled={!salaryUah}>
        Податки за місяць
      </Button>
    </div>
  );
}
