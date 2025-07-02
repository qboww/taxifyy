// components/StaticCalendar/StaticCalendar.jsx
import styles from "./StaticCalendar.module.css";

export default function StaticCalendar({ year, month }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0‑Sun … 6‑Sat
  const weeks = [];
  // Зсув, щоб календар починався з понеділка
  let current = 1 - (firstDay === 0 ? 6 : firstDay - 1);

  for (let w = 0; w < 6; w++) {
  const cells = [];
  let hasContent = false;

  for (let d = 0; d < 7; d++) {
    if (current < 1 || current > daysInMonth) {
      cells.push(<td key={d} />);
    } else {
      const dow = new Date(year, month, current).getDay();
      const isWeekend = dow === 0 || dow === 6;
      cells.push(
        <td
          key={d}
          className={isWeekend ? styles.weekend : ""}
        >
          {current}
        </td>
      );
      hasContent = true;
    }
    current++;
  }

  if (hasContent) {
    weeks.push(<tr key={w}>{cells}</tr>);
  }
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
    </div>
  );
}
