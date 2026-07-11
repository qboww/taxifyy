// HolidayTooltip.jsx
import { useState } from "react";
import styles from "./HolidayTooltip.module.css";

export default function HolidayTooltip({ children, label }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {label && (
        <div className={`${styles.tooltip} ${isVisible ? styles.visible : ""}`}>{label}</div>
      )}
    </div>
  );
}
