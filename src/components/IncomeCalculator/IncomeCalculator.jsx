import { useEffect, useState, useRef } from "react";
import { getWeekdays, fetchUsdRate } from "../../utils/helpers";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { StaticCalendar } from "../UI/StaticCalendar/StaticCalendar";
import { MdCurrencyExchange, MdContentPaste } from "react-icons/md";
import CalendarStats from "../UI/CalendarStats/CalendarStats";
import FormInput from "../UI/FormInput/FormInput";
import Button from "../UI/Button/Button";
import Paycheck from "../UI/Paycheck/Paycheck";

import { REPORT_PERIODS } from "../../utils/constants";
import { calculateTaxes, calculateNetIncome } from "../../utils/taxCalculator";

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
  }, [customRate, setCustomRate]);

  const rateToUse = customRate || usdRate || 0;
  const gross = hoursWorked * hourlyRateUsd * rateToUse;

  const taxData = calculateTaxes({ income: gross, quarterlyIncome: 0, mode: REPORT_PERIODS.MONTH });
  const netIncome = calculateNetIncome(taxData);
  const totalTaxes = taxData.taxes.reduce((sum, tax) => sum + tax.value, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Розрахунок доходу</h1>

      <CalendarStats
        today={today}
        monthDays={monthDays}
        weekdays={weekdays}
        workingHours={workingHours}
        isCalendarOpen={isCalendarOpen}
        onToggleCalendar={() => setIsCalendarOpen((prev) => !prev)}
      />
      {isCalendarOpen && (
        <StaticCalendar ref={calendarRef} year={year} month={month} today={today} onSyncHours={handleSyncHours} />
      )}

      <div className={styles.hourRate}>
        <FormInput
          label="Години роботи:"
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
        USD НБУ {usdDate || "..."}: {usdRate ? `${usdRate} грн` : "(завантаження...)"}
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

      <Paycheck
        items={[
          { label: "Дохід брудними", value: gross },
          { label: "Сума податків", value: totalTaxes },
        ]}
        totalLabel="Чистий дохід"
        totalValue={netIncome}
      />

      <Button onClick={() => onTransfer(gross)} disabled={!gross}>
        Детальний звіт
      </Button>
    </div>
  );
}
