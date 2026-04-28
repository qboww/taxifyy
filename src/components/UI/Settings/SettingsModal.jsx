import { FaTimes } from "react-icons/fa";
import styles from "./SettingsModal.module.css";

const INCOME_CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "PLN", value: "PLN" },
  { label: "UAH", value: "UAH" },
];

const EXCHANGE_CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "PLN", value: "PLN" },
];

export default function SettingsModal({
  isOpen,
  onClose,
  incomeCurrency,
  onIncomeCurrencyChange,
  exchangeCurrency,
  onExchangeCurrencyChange,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Налаштування</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.setting}>
            <label>Валюта розрахунку доходу:</label>
            <div className={styles.currencyOptions}>
              {INCOME_CURRENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.currencyBtn} ${
                    incomeCurrency === option.value ? styles.active : ""
                  }`}
                  onClick={() => onIncomeCurrencyChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.setting}>
            <label>Валюта для обміну:</label>
            <div className={styles.currencyOptions}>
              {EXCHANGE_CURRENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.currencyBtn} ${
                    exchangeCurrency === option.value ? styles.active : ""
                  }`}
                  onClick={() => onExchangeCurrencyChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
