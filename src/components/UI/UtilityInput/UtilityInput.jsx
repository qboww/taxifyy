import styles from "./UtilityInput.module.css";

export default function UtilityInput({ data, onChange, onRemove }) {
  const isFixed = data.isFixed || false;

  return (
    <div className={styles.container}>
        <button className={styles.removeButton} onClick={onRemove}>
          ✕
        </button>

      <label className={styles.label}>
        Тип послуги
        <input
          className={styles.input}
          type="text"
          placeholder="Вода, Газ, Електро..."
          value={data.type}
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
            value={data.fixedAmount || ""}
            onChange={(e) => onChange("fixedAmount", e.target.value)}
          />
        </label>
      ) : (
        <>
          <label className={styles.label}style={{width:"50px"}}>
            Коеф
            <input
                className={styles.input}
                style={{paddingLeft: "5px" ,paddingRight:"5px" }}
              type="number"
              placeholder="0.0"
              value={data.coefficient}
              onChange={(e) => onChange("coefficient", e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Показник
            <input
              className={styles.input}
              type="number"
                placeholder="0"
              value={data.quantity}
              onChange={(e) => onChange("quantity", e.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );
}
