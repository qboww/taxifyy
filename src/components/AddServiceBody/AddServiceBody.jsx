import React from "react";
import styles from "./AddServiceBody.module.css";

export default function AddServiceBody({ formState, setFormState }) {
  return (
    <div className={styles.container}>
      <label>
        Назва послуги
        <input
          type="text"
          value={formState.name || ""}
          onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
        />
      </label>

      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name="typeOption"
            value="coefficient"
            checked={formState.typeOption !== "fixed"}
            onChange={() => setFormState(prev => ({ ...prev, typeOption: "coefficient" }))}
          />
          З коефіцієнтом
        </label>
        <label>
          <input
            type="radio"
            name="typeOption"
            value="fixed"
            checked={formState.typeOption === "fixed"}
            onChange={() => setFormState(prev => ({ ...prev, typeOption: "fixed" }))}
          />
          Фіксована сума
        </label>
      </div>

      {formState.typeOption !== "fixed" && (
        <input
          type="number"
          placeholder="Коефіцієнт"
          value={formState.coefficient || ""}
          onChange={e => setFormState(prev => ({ ...prev, coefficient: e.target.value }))}
        />
      )}

      {formState.typeOption === "fixed" && (
        <input
          type="number"
          placeholder="Сума"
          value={formState.amount || ""}
          onChange={e => setFormState(prev => ({ ...prev, amount: e.target.value }))}
        />
      )}
    </div>
  );
}
