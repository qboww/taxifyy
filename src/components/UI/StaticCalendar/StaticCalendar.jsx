import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { formatHoursWord } from "../../../utils/helpers";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./StaticCalendar.module.css";

export const StaticCalendar = forwardRef(function StaticCalendar(
  { year, month, today, onSyncHours },
  ref
) {
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragMode = useRef(null);
  const calendarRef = useRef(null);

  useImperativeHandle(ref, () => ({
    syncHoursToParent: () => {
      if (onSyncHours) {
        onSyncHours(selectedDays.length * 8);
      }
    },
  }));

  const toggleDay = (dayNum, add) => {
    setSelectedDays((prev) =>
      add ? (prev.includes(dayNum) ? prev : [...prev, dayNum]) : prev.filter((d) => d !== dayNum)
    );
  };

  // ====== Unified drag handlers ======
  const startDrag = (dayNum) => {
    setIsDragging(true);
    dragMode.current = !selectedDays.includes(dayNum);
    toggleDay(dayNum, dragMode.current);
  };

  const moveDrag = (dayNum) => {
    if (!isDragging) return;
    toggleDay(dayNum, dragMode.current);
  };

  const endDrag = () => {
    setIsDragging(false);
    dragMode.current = null;
  };

  // ====== Touch support ======
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // запобігає скролу сторінки під час свайпу
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.dataset.daynum) {
      moveDrag(Number(el.dataset.daynum));
    }
  };

  // ====== Prevent page scroll during drag ======
  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    const handleTouchMovePreventScroll = (e) => {
      if (isDragging) e.preventDefault();
    };

    calendarEl.addEventListener("touchmove", handleTouchMovePreventScroll, { passive: false });

    return () => {
      calendarEl.removeEventListener("touchmove", handleTouchMovePreventScroll);
    };
  }, [isDragging]);

  // ====== Month navigation ======
  const changeMonth = (delta) => {
    setViewMonth((prevMonth) => {
      let newMonth = prevMonth + delta;
      let newYear = viewYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      setViewYear(newYear);
      return newMonth;
    });
    setSelectedDays([]);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleString("uk-UA", {
    month: "long",
  });
  const quarter = `Q${Math.floor(viewMonth / 3) + 1}`;

  const workingDays = Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)).filter(
    (date) => date.getDay() !== 0 && date.getDay() !== 6
  ).length;
  const workingHours = workingDays * 8;

  // ====== Build weeks ======
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
        const dow = new Date(viewYear, viewMonth, dayNum).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isSelected = selectedDays.includes(dayNum);
        const isToday =
          today &&
          today.getFullYear() === viewYear &&
          today.getMonth() === viewMonth &&
          today.getDate() === dayNum;

        cells.push(
          <td
            key={d}
            data-daynum={dayNum}
            className={`${isWeekend ? styles.weekend : ""} ${
              isSelected ? styles.selected : ""
            } ${isToday ? styles.today : ""}`}
            onMouseDown={() => startDrag(dayNum)}
            onMouseEnter={() => moveDrag(dayNum)}
            onMouseUp={endDrag}
            onTouchStart={() => startDrag(dayNum)}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrag}
            style={{ userSelect: "none" }}
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
    <div ref={calendarRef} className={styles.calendarContainer}>
      <div>
        <table className={styles.calendar}>
          <thead>
            <tr>
              {weekDays.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
        {selectedDays.length > 0 && (
          <div className={styles.summary}>
            Вибрано днів: {selectedDays.length} - Годин:{" "}
            {selectedDays.length * 8}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.button} onClick={() => changeMonth(-1)}>
          <FaAngleLeft size={20} />
        </button>
        <span>
          {monthName} {viewYear} ({quarter}) {workingHours}{" "}
          {formatHoursWord(workingHours)}
        </span>
        <button className={styles.button} onClick={() => changeMonth(1)}>
          <FaAngleRight size={20} />
        </button>
      </div>

      {selectedDays.length > 0 && (
        <button
          className={`${styles.button} ${styles.buttonText}`}
          onClick={() => ref?.current?.syncHoursToParent()}
        >
          Перенести час
        </button>
      )}

      <hr className={styles.hr} />
    </div>
  );
});
