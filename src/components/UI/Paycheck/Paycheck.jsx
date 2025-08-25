import styles from "./Paycheck.module.css";

export default function Paycheck({
  title,
  subtitle,
  items,
  subtotalLabel,
  subtotalValue,
  totalLabel,
  totalValue,
  footer,
}) {
  return (
    <section className={styles.paycheck}>
      {title && (
        <header className={styles.header}>
          <h3>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}

      <div className={styles.items}>
        {items.map((item, index) => (
          <p key={index}>
            {item.label}
            {item.rate ? ` (${item.rate})` : ""}:
            <span>{item.value?.toFixed ? item.value.toFixed(2) : item.value} грн</span>
          </p>
        ))}
      </div>

      {subtotalLabel && (
        <div className={styles.subtotal}>
          <p>
            {subtotalLabel}: <span>{subtotalValue?.toFixed ? subtotalValue.toFixed(2) : subtotalValue} грн</span>
          </p>
        </div>
      )}

      <hr className={styles.hr} />

      {totalLabel && (
        <div className={styles.total}>
          <p className={styles.net}>
            {totalLabel}: <span>{totalValue?.toFixed ? totalValue.toFixed(2) : totalValue} грн</span>
          </p>
        </div>
      )}

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
