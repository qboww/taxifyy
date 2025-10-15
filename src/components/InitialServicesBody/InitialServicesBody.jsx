import React from "react";
import styles from "./InitialServicesBody.module.css";

export default function InitialServicesBody({ services, formState, setFormState }) {
  return (
    <div className={styles.container}>
      {services.map(s => (
        <label key={s.type} className={styles.label}>
          <input
            type="checkbox"
            checked={formState[s.type + "Checked"] || false}
            onChange={e => setFormState(prev => ({ ...prev, [s.type + "Checked"]: e.target.checked }))}
          />
          {s.type}
          {!s.isFixed && formState[s.type + "Checked"] && (
            <input
              type="number"
              placeholder="Початковий показник"
              value={formState[s.type + "Quantity"] || ""}
              onChange={e => setFormState(prev => ({ ...prev, [s.type + "Quantity"]: e.target.value }))}
              className={styles.input}
            />
          )}
        </label>
      ))}
    </div>
  );
}
