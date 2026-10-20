import { FaTimes } from "react-icons/fa";
import CurrencySelect from "../CurrencySelect/CurrencySelect";
import { HOLIDAY_COUNTRIES } from "../../../utils/holidays";
import styles from "./SettingsModal.module.css";

const FOREIGN_CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "RON", value: "RON" },
  { label: "PLN", value: "PLN" },
];

const INCOME_CURRENCY_OPTIONS = [...FOREIGN_CURRENCY_OPTIONS, { label: "UAH", value: "UAH" }];

const UTILITIES_CURRENCY_OPTIONS = [...FOREIGN_CURRENCY_OPTIONS, { label: "UAH", value: "UAH" }];

export default function SettingsModal({
  isOpen,
  onClose,
  incomeCurrency,
  onIncomeCurrencyChange,
  utilitiesCurrency,
  onUtilitiesCurrencyChange,
  holidayCountry,
  onHolidayCountryChange,
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
            <CurrencySelect
              label="Валюта розрахунку доходу:"
              value={incomeCurrency}
              onChange={onIncomeCurrencyChange}
              options={INCOME_CURRENCY_OPTIONS}
            />
          </div>

          <div className={styles.setting}>
            <CurrencySelect
              label="Валюта комунальних платежів:"
              value={utilitiesCurrency}
              onChange={onUtilitiesCurrencyChange}
              options={UTILITIES_CURRENCY_OPTIONS}
            />
            <small className={styles.settingHint}>
              Зміна валюти не конвертує вже збережені суми.
            </small>
          </div>

          <div className={styles.setting}>
            <CurrencySelect
              label="Країна свят у календарі:"
              value={holidayCountry}
              onChange={onHolidayCountryChange}
              options={HOLIDAY_COUNTRIES}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
