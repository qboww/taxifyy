import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({
  options = [],
  value,
  onChange,
  className = "",
  center = false,
  marginBottom = 0,
}) {
  return (
    <div
      className={`${styles.toggleContainer} ${className} ${center ? styles.center : ""}`}
      style={{ marginBottom: `${marginBottom}px` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.toggleOption} ${value === option.value ? styles.active : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
