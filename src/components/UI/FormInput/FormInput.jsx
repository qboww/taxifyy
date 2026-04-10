import styles from "./FormInput.module.css";

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  step,
  className = "",
  labelClass = "",
  inputClass = "",
  error,
  ...props
}) {
  const handleChange = (e) => {
    if (type === "number") {
      const val = e.target.value === "" ? "" : Number(e.target.value);
      onChange(val);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <label className={`${styles.label} ${labelClass}`}>
      {label && <span>{label}</span>}
      <input
        type={type}
        value={value === 0 ? "" : value}
        onChange={handleChange}
        placeholder={placeholder}
        step={step}
        className={`${styles.input} ${inputClass} ${className} ${error ? styles.error : ""}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
}
