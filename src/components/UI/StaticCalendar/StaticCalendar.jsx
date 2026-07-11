import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { formatHoursWord } from "../../../utils/helpers";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./StaticCalendar.module.css";
import { HolidayService } from "../../../utils/HolidayService";
import HolidayTooltip from "./HolidayTooltip";
import { useHolidaySettings } from "../../../utils/useHolidaySettings";
import { useHolidayTransferSetting } from "../../../utils/useHolidayTransferSetting";
import { getTransferredHolidays } from "../../../utils/getTransferredHolidays";

export const StaticCalendar = forwardRef(function StaticCalendar(
  { year, month, today, onSyncHours },
  ref
) {
  // Get user holiday country
  const { country: holidayCountry } = useHolidaySettings();
  const [holidays, setHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidaysError, setHolidaysError] = useState(null);
  const [holidayTransferEnabled] = useHolidayTransferSetting();
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

  // Fetch holidays for the current view year/month and country
  useEffect(() => {
    let cancelled = false;
    setHolidaysLoading(true);
    setHolidaysError(null);
    if (!holidayCountry) return;
    const service = new HolidayService({ country: holidayCountry });
    service
      .getHolidays(viewYear)
      .then((list) => {
        if (!cancelled) setHolidays(list);
      })
      .catch((e) => {
        if (!cancelled) setHolidaysError(e);
      })
      .finally(() => {
        if (!cancelled) setHolidaysLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [holidayCountry, viewYear]);

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

  const workingDays = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(viewYear, viewMonth, i + 1)
  ).filter((date) => date.getDay() !== 0 && date.getDay() !== 6).length;
  const workingHours = workingDays * 8;

  const getLocalIso = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  const normalizeTransferLabel = (name) => {
    if (!name) return "Перенесено";
    const cleaned = name.replace(/\s*\((?:зам[іи]нити день|замінено|замінити).*?\)/gi, "").trim();
    return cleaned ? `${cleaned} (Перенесено)` : "Перенесено";
  };

  const holidaysByIso = Object.fromEntries(holidays.map((h) => [h.date.substring(0, 10), h]));

  // Compute transferred holidays for this month
  const transferred = getTransferredHolidays(holidays, viewYear, viewMonth, holidayTransferEnabled);

  // Collect holidays for this month
  const monthHolidays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(viewYear, viewMonth, day);
    const iso = getLocalIso(dateObj);
    const holiday = holidaysByIso[iso];
    const fallbackTransfer = transferred[iso];

    if (holiday && !holiday.substitute) {
      monthHolidays.push({
        date: day,
        name: holiday.name,
        type: "holiday",
      });
    } else if (holiday?.substitute && holidayTransferEnabled) {
      monthHolidays.push({
        date: day,
        name: normalizeTransferLabel(holiday.name),
        type: "transfer",
      });
    } else if (fallbackTransfer) {
      monthHolidays.push({
        date: day,
        name: normalizeTransferLabel(fallbackTransfer.name),
        type: "transfer",
      });
    }
  }

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
        const dateObj = new Date(viewYear, viewMonth, dayNum);
        const dow = dateObj.getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isSelected = selectedDays.includes(dayNum);
        const isToday =
          today &&
          today.getFullYear() === viewYear &&
          today.getMonth() === viewMonth &&
          today.getDate() === dayNum;

        // Holiday logic
        const iso = getLocalIso(dateObj);
        let holiday = holidaysByIso[iso];
        if (holiday?.substitute && !holidayTransferEnabled) {
          holiday = undefined;
        }
        const isHoliday = !!holiday && !holiday.substitute;
        const isSubstitute = !!holiday?.substitute;
        const holidayName = holiday?.name;

        // Transferred holiday logic
        const fallbackTransfer = transferred[iso];
        const isTransfer = isSubstitute || !!fallbackTransfer;
        const transferName = isSubstitute
          ? normalizeTransferLabel(holiday.name)
          : fallbackTransfer
            ? normalizeTransferLabel(fallbackTransfer.name)
            : undefined;

        // Combine classes for weekend, holiday, transfer, selected, today
        let cellClass = "";
        if (isTransfer && isWeekend) cellClass = styles.holidayTransferWeekend;
        else if (isTransfer) cellClass = styles.holidayTransfer;
        else if (isHoliday && isWeekend) cellClass = styles.holidayWeekend;
        else if (isHoliday) cellClass = styles.holiday;
        else if (isWeekend) cellClass = styles.weekend;
        if (isSelected) cellClass += ` ${styles.selected}`;
        if (isToday) cellClass += ` ${styles.today}`;

        let cellContent = <div className={styles.cellContent}>{dayNum}</div>;
        if (isTransfer) {
          cellContent = (
            <HolidayTooltip label={transferName}>
              <div className={styles.cellContent}>{dayNum}</div>
            </HolidayTooltip>
          );
        } else if (isHoliday) {
          cellContent = (
            <HolidayTooltip label={holidayName}>
              <div className={styles.cellContent}>{dayNum}</div>
            </HolidayTooltip>
          );
        }

        cells.push(
          <td
            key={d}
            data-daynum={dayNum}
            className={cellClass}
            onMouseDown={() => startDrag(dayNum)}
            onMouseEnter={() => moveDrag(dayNum)}
            onMouseUp={endDrag}
            onTouchStart={() => startDrag(dayNum)}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrag}
            style={{ userSelect: "none" }}
          >
            {cellContent}
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
        {holidaysLoading && <div className={styles.holidayLoading}>Завантаження свят...</div>}
        {holidaysError && <div className={styles.holidayError}>Не вдалося завантажити свята</div>}
        {selectedDays.length > 0 && (
          <div className={styles.summary}>
            Вибрано днів: {selectedDays.length} - Годин: {selectedDays.length * 8}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.button} onClick={() => changeMonth(-1)}>
          <FaAngleLeft size={20} />
        </button>
        <span>
          {monthName} {viewYear} ({quarter}) {workingHours} {formatHoursWord(workingHours)}
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

      {monthHolidays.length > 0 && (
        <div className={styles.holidayList}>
          <h4>Свята цього місяця:</h4>
          <ul>
            {monthHolidays.map((h, index) => (
              <li key={index} className={h.type === "transfer" ? styles.transferHoliday : ""}>
                {h.date} - {h.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className={styles.hr} />
    </div>
  );
});
