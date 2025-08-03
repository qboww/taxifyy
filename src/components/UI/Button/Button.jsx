import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  icon: Icon,
  disabled = false,
  className = "",
  ...props
}) {
  const hasIcon = Boolean(Icon);
  const fontSizeClass = hasIcon ? styles.iconFontSize : styles.textFontSize;

  return (
    <button
      className={`${styles.button} ${styles.default} ${fontSizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      {children}
    </button>
  );
}
