import { LuCalendarFold } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { formatHoursWord, formatDaysWord, formatWorkDaysWord } from "../../../utils/helpers";

import Button from "../Button/Button";
import styles from "./CalendarStats.module.css";

export default function CalendarStats({ 
  today,
  monthDays,
  weekdays,
  workingHours,
  isCalendarOpen,
  onToggleCalendar
}) {
  return (
    <div className={styles.container}>
      <span className={styles.statsText}>
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
        onClick={onToggleCalendar}
        variant="icon"
        icon={isCalendarOpen ? IoClose : LuCalendarFold}
        className={styles.calendarBtn}
      />
    </div>
  );
}