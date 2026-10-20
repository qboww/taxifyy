import { LuCalendarFold } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { formatDaysWord, formatHoursWord, formatHolidayWord } from "../../../utils/helpers";

import Button from "../Button/Button";
import styles from "./CalendarStats.module.css";

export default function CalendarStats({
  today,
  weekdays,
  weekendDays,
  holidayDays,
  isCalendarOpen,
  onToggleCalendar,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.statsText}>
        <div>
          <strong>сьогодні: </strong>
          {today.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          {"(Q"}
          {Math.floor(today.getMonth() / 3) + 1}
          {")"}
        </div>
        <div>
          <strong>будні:</strong> {weekdays} {formatDaysWord(weekdays)}
          {" - "}
          {weekdays * 8} {formatHoursWord(weekdays * 8)}
        </div>
        <div>
          <strong>вихідні:</strong> {weekendDays} {formatDaysWord(weekendDays)}
          {" - "}
          {holidayDays} {formatHolidayWord(holidayDays)}
        </div>
      </div>

      <Button
        onClick={onToggleCalendar}
        variant="icon"
        icon={isCalendarOpen ? IoClose : LuCalendarFold}
        className={styles.calendarBtn}
      />
    </div>
  );
}
