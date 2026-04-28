import { FaTimes } from "react-icons/fa";
import styles from "./SettingsModal.module.css";

const CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "PLN", value: "PLN" },
];

export default function SettingsModal({ isOpen, onClose, currency, onCurrencyChange }) {
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
            <label>Валюта:</label>
            <div className={styles.currencyOptions}>
              {CURRENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.currencyBtn} ${
                    currency === option.value ? styles.active : ""
                  }`}
                  onClick={() => onCurrencyChange(option.value)}
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
