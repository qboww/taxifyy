import { useEffect, useState } from "react";

export const HOLIDAY_COUNTRIES = [
  { label: "Україна", value: "UA" },
  { label: "Польща", value: "PL" },
  { label: "Румунія", value: "RO" },
  { label: "США", value: "US" },
  { label: "Велика Британія", value: "GB" },
  { label: "Німеччина", value: "DE" },
  { label: "Франція", value: "FR" },
  { label: "Іспанія", value: "ES" },
  { label: "Італія", value: "IT" },
  { label: "Канада", value: "CA" },
];

export function getMonthCalendarStats(year, month, holidays = []) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workingDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = [year, String(month + 1).padStart(2, "0"), String(day).padStart(2, "0")].join(
      "-"
    );

    if (holidays.some((holiday) => holiday.date === dateKey)) holidayDays++;
    if (date.getDay() === 0 || date.getDay() === 6) weekendDays++;
    else workingDays++;
  }

  return { daysInMonth, workingDays, weekendDays, holidayDays };
}

export function usePublicHolidays(countryCode, year) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setHolidays([]);
    setLoading(true);
    setError(false);

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Holiday service returned ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.some((holiday) => !holiday.date || !holiday.localName)) {
          throw new Error("Holiday service returned invalid data");
        }
        setHolidays(data);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          console.error("Помилка завантаження свят:", fetchError);
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [countryCode, year]);

  return { holidays, loading, error };
}
