import styles from "./UtilityInput.module.css";

export default function UtilityInput({ data, onChange, onRemove }) {
  const isFixed = data.isFixed || false;

  return (
    <div className={styles.container}>
      <button className={styles.removeButton} onClick={onRemove}>✕</button>

      <label className={styles.label}>
        Тип послуги
        <input
          className={styles.input} 
          type="text"
          placeholder="Вода, Газ, Електро..."
          value={data.type || ""}
          onChange={(e) => onChange("type", e.target.value)}
        />
      </label>

      {isFixed ? (
        <label className={styles.label}>
          Фіксована сума
          <input
            className={styles.input}
            type="number"
            placeholder="0"
            value={data.fixedAmount ?? ""}
            onChange={(e) => onChange("fixedAmount", parseFloat(e.target.value))}
          />
        </label>
      ) : (
        <>
          <label className={styles.label}>
            Кількість ({data.unit ?? ""})
            <input
              className={styles.input}
              type="number"
              placeholder="0"
              value={data.quantity ?? ""}
              onChange={(e) => onChange("quantity", parseFloat(e.target.value))}
            />
          </label>
          <label className={styles.label}>
            Коефіцієнт
            <input
              className={styles.input}
              type="number"
              placeholder="0.0"
              value={data.coefficient ?? ""}
              onChange={(e) => onChange("coefficient", parseFloat(e.target.value))}
            />
          </label>
        </>
      )}
    </div>
  );
}
