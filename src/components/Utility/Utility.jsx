import styles from "./Utility.module.css";
import UtilityInput from "../UI/UtilityInput/UtilityInput";
import Paycheck from "../UI/Paycheck/Paycheck";
import Modal from "../UI/Modal/Modal";
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
  const [showModal, setShowModal] = useState(false);

  const handleAddService = (data) => {
    const service =
      data.typeOption === "fixed"
        ? { type: data.name, fixedAmount: parseFloat(data.amount), isFixed: true }
        : { type: data.name, coefficient: parseFloat(data.coefficient), quantity: 0 };

    setRows([...rows, service]);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const { items, subtotal, total } = useMemo(() => {
    const perType = {};
    let totalCost = 0;

    rows.forEach(({ type, coefficient, quantity, fixedAmount, isFixed }) => {
      let cost = isFixed
        ? parseFloat(fixedAmount) || 0
        : (parseFloat(coefficient) || 0) * (parseFloat(quantity) || 0);

      if (type) perType[type] = (perType[type] || 0) + cost;
      totalCost += cost;
    });

    return { items: Object.entries(perType).map(([label, value]) => ({ label, value })), subtotal: totalCost, total: totalCost };
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

      {/* Кнопка відкриття модалки */}
      <button className={styles.addButton} onClick={() => setShowModal(true)}>
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

      {/* Модалка */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddService}
        title="Додати нову послугу"
        fields={[
          { name: "name", label: "Назва послуги", type: "text" },
          { 
            name: "typeOption", 
            label: "Тип послуги", 
            type: "radio",
            options: [
              { value: "coefficient", label: "З коефіцієнтом" },
              { value: "fixed", label: "Фіксована сума" }
            ],
            value: "coefficient"
          },
          { name: "coefficient", label: "Коефіцієнт", type: "number", placeholder: "0.0" },
          { name: "amount", label: "Сума", type: "number", placeholder: "0" }
        ]}
      />
    </div>
  );
}
