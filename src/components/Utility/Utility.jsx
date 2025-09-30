import styles from "./Utility.module.css";
import UtilityInput from "../UI/UtilityInput/UtilityInput";
import Paycheck from "../UI/Paycheck/Paycheck";
import { useState, useMemo } from "react";

const DEFAULT_SERVICES = [
  { type: "Вода", coefficient: 2, quantity: 0 },
  { type: "Газ", coefficient: 1.5, quantity: 0 },
  { type: "Електроенергія", coefficient: 0.5, quantity: 0 },
  { type: "Опалення", coefficient: 3, quantity: 0 },
  { type: "Доставка газу", fixedAmount: 100, isFixed: true },
  { type: "Сміття", fixedAmount: 50, isFixed: true },
];

export default function Utility() {
  const [rows, setRows] = useState(DEFAULT_SERVICES);

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    const hasCoefficient = window.confirm(
      "Ця послуга має коефіцієнт? (OK = так, Cancel = ні)"
    );
    setRows([
      ...rows,
      hasCoefficient
        ? { type: "", coefficient: "", quantity: "" }
        : { type: "", fixedAmount: 0, isFixed: true },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const { items, subtotal, total } = useMemo(() => {
    const perType = {};
    let totalCost = 0;

    rows.forEach(({ type, coefficient, quantity, fixedAmount, isFixed }) => {
      let cost = 0;
      if (isFixed) {
        cost = parseFloat(fixedAmount) || 0;
      } else {
        const coef = parseFloat(coefficient) || 0;
        const qty = parseFloat(quantity) || 0;
        cost = coef * qty;
      }

      if (type) {
        if (!perType[type]) perType[type] = 0;
        perType[type] += cost;
      }

      totalCost += cost;
    });

    const items = Object.entries(perType).map(([label, value]) => ({
      label,
      value,
    }));

    return { items, subtotal: totalCost, total: totalCost };
  }, [rows]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className="title">Розрахунок комунальних послуг</h1>
      </div>

      {rows.map((row, index) => (
        <UtilityInput
          key={index}
          data={row}
          onChange={(field, value) => updateRow(index, field, value)}
          onRemove={() => removeRow(index)}
        />
      ))}

      <button className={styles.addButton} onClick={addRow}>
        + Додати послугу
      </button>

      <Paycheck
        title="Підсумок"
        subtitle="Вартість комунальних послуг"
        items={items}
        subtotalLabel="Загалом"
        subtotalValue={subtotal}
        totalLabel="До сплати"
        totalValue={total}
      />
    </div>
  );
}
