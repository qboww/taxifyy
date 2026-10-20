import { useEffect, useRef, useState } from "react";
import styles from "./CurrencySelect.module.css";

export default function CurrencySelect({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    optionRefs.current[Math.max(selectedIndex, 0)]?.focus();
  }, [isOpen, options, value]);

  const handleOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + options.length) % options.length;
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={styles.currencySelect} ref={selectRef}>
      <span className={styles.currencyLabel}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.currencyTrigger}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {options.find((option) => option.value === value)?.label || value}
        <span className={`${styles.currencyChevron} ${isOpen ? styles.currencyChevronOpen : ""}`} />
      </button>
      {isOpen && (
        <div className={styles.currencyMenu} role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              className={`${styles.currencyOption} ${
                value === option.value ? styles.selectedCurrency : ""
              }`}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
