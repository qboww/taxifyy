import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, onSubmit, title = "Вибір типу послуги" }) {
  if (!isOpen) return null;

  const handleSelect = (typeOption) => {
    onSubmit({ typeOption }); // передаємо лише вибір
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        <div className={styles.buttonGroup}>
          <button className={styles.optionButton} onClick={() => handleSelect("coefficient")}>
            З коефіцієнтом
          </button>
          <button className={styles.optionButton} onClick={() => handleSelect("fixed")}>
            Фіксована сума
          </button>
        </div>

        <button className={styles.cancelButton} onClick={onClose}>
          Відмінити
        </button>
      </div>
    </div>
  );
}
