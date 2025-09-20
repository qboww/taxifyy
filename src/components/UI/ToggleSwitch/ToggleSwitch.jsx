import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({
  options = [],
  value,
  onChange,
  label,
  className = "",
  center = false,
  marginBottom = 0,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.labelText}>{label}</p>}
      <div
        className={`${styles.toggleContainer} ${className} ${center ? styles.center : ""}`}
        style={{ marginBottom: `${marginBottom}px` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.toggleOption} ${value === option.value ? styles.active : ""}`}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}