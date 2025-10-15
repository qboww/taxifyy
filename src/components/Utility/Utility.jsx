import { useState, useEffect, useMemo } from "react";
import styles from "./Utility.module.css";
import UtilityInput from "../UI/UtilityInput/UtilityInput";
import Paycheck from "../UI/Paycheck/Paycheck";
import Modal from "../UI/Modal/Modal";

import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { UtilityService } from "../../utils/UtilityService";
import { TARIFFS, UNITS } from "../../utils/constants";
import InitialServicesBody from "../InitialServicesBody/InitialServicesBody";
import AddServiceBody from "../AddServiceBody/AddServiceBody";

// Початкові послуги
const DEFAULT_SERVICES = [
  { type: "Вода", coefficient: TARIFFS.water, unit: UNITS.water, quantity: 0 },
  { type: "Газ", coefficient: TARIFFS.gas, unit: UNITS.gas, quantity: 0 },
  { type: "Електроенергія", coefficient: TARIFFS.electricity, unit: UNITS.electricity, quantity: 0 },
  { type: "Опалення", coefficient: TARIFFS.heating, unit: UNITS.heating, quantity: 0 },
  { type: "Доставка газу", fixedAmount: 100, isFixed: true, unit: "" },
  { type: "Сміття", fixedAmount: 50, isFixed: true, unit: "" },
];

// Функція для визначення одиниці виміру
const getUnitByType = (type) => {
  switch (type?.toLowerCase()) {
    case "вода":
      return UNITS.water;
    case "газ":
      return UNITS.gas;
    case "електроенергія":
      return UNITS.electricity;
    case "опалення":
      return UNITS.heating;
    default:
      return "";
  }
};

export default function Utility() {
  const [savedState, setSavedState] = useLocalStorageWithExpiry("utility_state", null);
  const [utilityService] = useState(() => new UtilityService(DEFAULT_SERVICES, savedState));
  const [rows, setRows] = useState(utilityService.getAll());
  const [history, setHistory] = useState(utilityService.getHistory());

  const [showInitialModal, setShowInitialModal] = useState(() => !savedState);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    setSavedState(utilityService.toJSON());
  }, [rows, history, setSavedState, utilityService]);

  const refresh = () => setRows([...utilityService.getAll()]);

  const handleAddService = (data) => {
    const service =
      data.typeOption === "fixed"
        ? {
            type: data.name,
            fixedAmount: parseFloat(data.amount),
            isFixed: true,
            unit: "",
          }
        : {
            type: data.name,
            coefficient: parseFloat(data.coefficient),
            quantity: 0,
            unit: getUnitByType(data.name),
          };
    utilityService.addService(service);
    refresh();
  };

  const handleInitialServices = (data) => {
    DEFAULT_SERVICES.forEach((s) => {
      if (data[s.type + "Checked"]) {
        const service = s.isFixed
          ? { ...s, unit: "" }
          : {
              ...s,
              unit: getUnitByType(s.type),
              quantity: parseFloat(data[s.type + "Quantity"] || 0),
            };
        utilityService.addService(service);
      }
    });
    setRows([...utilityService.getAll()]);
    setShowInitialModal(false);
    setSavedState(utilityService.toJSON());
  };

  const updateRow = (index, field, value) => {
    utilityService.updateService(index, field, value);
    if (field === "type") {
      utilityService.services[index].unit = getUnitByType(value);
    }
    refresh();
  };

  const removeRow = (index) => {
    utilityService.removeService(index);
    refresh();
  };

  const handleSaveReading = () => {
    utilityService.services = utilityService.calculateDifferences(utilityService.services);
    utilityService.saveCurrentState();
    setHistory([...utilityService.getHistory()]);
    refresh();
  };

  const handleDeleteHistory = (index) => {
    utilityService.deleteHistory(index);
    setHistory([...utilityService.getHistory()]);
    setSavedState(utilityService.toJSON());
  };

  const { items, subtotal, total } = useMemo(() => utilityService.calculate(), [rows, utilityService]);

  return (
    <div className={styles.container}>
      <h1 className="title">Розрахунок комунальних послуг</h1>

      {rows.map((row, index) => (
        <UtilityInput
          key={index}
          data={row}
          onChange={(field, value) => updateRow(index, field, value)}
          onRemove={() => removeRow(index)}
        />
      ))}

      <div className={styles.actions}>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          Додати послугу
        </button>
        <button className={styles.saveButton} onClick={handleSaveReading}>
          Зберегти показники
        </button>
      </div>

      <Paycheck
        title="Підсумок"
        subtitle="Вартість комунальних послуг (за різницю)"
        items={items}
        subtotalLabel="Загалом"
        subtotalValue={subtotal}
        totalLabel="До сплати"
        totalValue={total}
      />

      {history.length > 0 && (
        <div className={styles.history}>
          <h3>Історія платежів</h3>
          {history.map((entry, i) => (
            <div key={i} className={styles.historyEntry}>
              <p>
                <b>{new Date(entry.date).toLocaleDateString()}</b>
                <button onClick={() => handleDeleteHistory(i)}>Видалити</button>
              </p>
              <ul>
                {entry.services.map((s, j) => (
                  <li key={j}>
                    {s.type}: {s.diff ?? s.quantity} × {s.coefficient ?? s.fixedAmount} {s.unit ?? ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Універсальна модалка */}
      <Modal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        onSubmit={() => handleInitialServices(formState)}
        title="Виберіть стартові послуги"
      >
        <InitialServicesBody
          services={DEFAULT_SERVICES}
          formState={formState}
          setFormState={setFormState}
        />
      </Modal>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={() => handleAddService(formState)}
        title="Додати нову послугу"
      >
        <AddServiceBody formState={formState} setFormState={setFormState} />
      </Modal>
    </div>
  );
}
