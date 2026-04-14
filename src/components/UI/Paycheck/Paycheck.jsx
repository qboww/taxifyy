import { Fragment } from "react";
import { formatCurrency } from "../../../utils/helpers";
import styles from "./Paycheck.module.css";

export default function Paycheck({
  title,
  subtitle,
  items,
  splitIndex,
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
          <Fragment key={index}>
            <p>
              {item.label}
              {item.rate ? ` (${item.rate})` : ""}:<span>{formatCurrency(item.value)} грн</span>
            </p>
            {splitIndex === index + 1 && <div className={styles.sectionDivider} />}
          </Fragment>
        ))}
      </div>

      {subtotalLabel && (
        <div className={styles.subtotal}>
          <p>
            {subtotalLabel}: <span>{formatCurrency(subtotalValue)} грн</span>
          </p>
        </div>
      )}

      <hr className={styles.hr} />

      {totalLabel && (
        <div className={styles.total}>
          <p className={styles.net}>
            {totalLabel}: <span>{formatCurrency(totalValue)} грн</span>
          </p>
        </div>
      )}

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
