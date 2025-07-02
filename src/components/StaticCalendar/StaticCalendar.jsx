import { useState } from "react";
import styles from "./StaticCalendar.module.css";

export default function StaticCalendar({ year, month }) {
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0‑Sun … 6‑Sat
  const weeks = [];
  let current = 1 - (firstDay === 0 ? 6 : firstDay - 1);

  for (let w = 0; w < 6; w++) {
    const cells = [];
    let hasContent = false;

    for (let d = 0; d < 7; d++) {
      if (current < 1 || current > daysInMonth) {
        cells.push(<td key={d} />);
      } else {
        const dayNum = current;
        const dow = new Date(year, month, dayNum).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isSelected = selectedDays.includes(dayNum);

        cells.push(
          <td
            key={d}
            className={`${isWeekend ? styles.weekend : ""} ${
              isSelected ? styles.selected : ""
            }`}
            onClick={() => toggleDay(dayNum)}
          >
            {dayNum}
          </td>
        );
        hasContent = true;
      }
      current++;
    }

    if (hasContent) weeks.push(<tr key={w}>{cells}</tr>);
  }

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className={styles.calendarContainer}>
      <table className={styles.calendar}>
        <thead>
          <tr>{weekDays.map((d) => <th key={d}>{d}</th>)}</tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>

      {selectedDays.length > 0 && (
        <div className={styles.summary}>
          Вибрано днів: {selectedDays.length} - Годин: {selectedDays.length * 8}
        </div>
      )}
    </div>
  );
}
