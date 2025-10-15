import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, title, children, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) onSubmit();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        <div className={styles.bodyContainer}>
          {children}
        </div>

        <div className={styles.buttons}>
          <button className={styles.submitButton} onClick={handleSubmit}>Підтвердити</button>
          <button className={styles.cancelButton} onClick={onClose}>Відмінити</button>
        </div>
      </div>
    </div>
  );
}
