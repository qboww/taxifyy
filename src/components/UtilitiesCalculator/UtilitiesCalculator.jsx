import { useMemo, useRef, useState, useEffect } from "react";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import FormInput from "../UI/FormInput/FormInput";
import Button from "../UI/Button/Button";
import Paycheck from "../UI/Paycheck/Paycheck";
import { FaPlus, FaTrash } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";

import styles from "./UtilitiesCalculator.module.css";

const defaultUtilities = {
  water: { prev: 0, current: 0, tariff: 0 },
  heating: { prev: 0, current: 0, tariff: 0 },
  electricity: { prev: 0, current: 0, tariff: 0 },
  customPayments: [],
};

const calculateAmount = (prev, current, tariff) => {
  const consumption = Math.max(0, (Number(current) || 0) - (Number(prev) || 0));
  return consumption * (Number(tariff) || 0);
};

const formatRate = (prev, current, tariff, unit) => {
  const consumption = Math.max(0, (Number(current) || 0) - (Number(prev) || 0));
  return `${formatCurrency(consumption)} ${unit} x ${Number(tariff) || 0} грн`;
};

const utilityItems = [
  { key: "heating", title: "Опалення", unit: "м³", tariffLabel: "Тариф (грн/м³)" },
  { key: "electricity", title: "Електрика", unit: "kWh", tariffLabel: "Тариф (грн/kWh)" },
  { key: "water", title: "Вода", unit: "м³", tariffLabel: "Тариф (грн/м³)" },
];

const getConsumption = (prev, current) => Math.max(0, (Number(current) || 0) - (Number(prev) || 0));

const formatSummary = (prev, current, tariff, unit) => {
  const consumption = getConsumption(prev, current);
  const amount = consumption * (Number(tariff) || 0);
  return `${formatCurrency(consumption)} ${unit} → ${formatCurrency(amount)} грн`;
};

const createEmptyPayment = () => ({ id: Date.now(), name: "", amount: 0 });

export default function UtilitiesCalculator() {
  const [utilities, setUtilities] = useLocalStorageWithExpiry(
    "utilities_data",
    defaultUtilities,
    null
  );

  const updateUtility = (section, field, value) => {
    setUtilities((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: Number(value) || 0,
      },
    }));
  };

  const updatePayment = (id, field, value) => {
    setUtilities((prev) => ({
      ...prev,
      customPayments: prev.customPayments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              [field]: field === "amount" ? Number(value) || 0 : value,
            }
          : payment
      ),
    }));
  };

  const addPayment = () => {
    setUtilities((prev) => ({
      ...prev,
      customPayments: [...prev.customPayments, createEmptyPayment()],
    }));
  };

  const removePayment = (id) => {
    setUtilities((prev) => ({
      ...prev,
      customPayments: prev.customPayments.filter((payment) => payment.id !== id),
    }));
  };

  const waterAmount = calculateAmount(
    utilities.water.prev,
    utilities.water.current,
    utilities.water.tariff
  );

  const heatingAmount = calculateAmount(
    utilities.heating.prev,
    utilities.heating.current,
    utilities.heating.tariff
  );

  const electricityAmount = calculateAmount(
    utilities.electricity.prev,
    utilities.electricity.current,
    utilities.electricity.tariff
  );

  const customTotal = utilities.customPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const totalAmount = waterAmount + heatingAmount + electricityAmount + customTotal;

  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) setActiveCard(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const paycheckItems = useMemo(() => {
    const items = [
      {
        label: "Опалення",
        rate: formatRate(
          utilities.heating.prev,
          utilities.heating.current,
          utilities.heating.tariff,
          "м³"
        ),
        value: heatingAmount,
      },
      {
        label: "Електрика",
        rate: formatRate(
          utilities.electricity.prev,
          utilities.electricity.current,
          utilities.electricity.tariff,
          "kWh"
        ),
        value: electricityAmount,
      },
      {
        label: "Вода",
        rate: formatRate(
          utilities.water.prev,
          utilities.water.current,
          utilities.water.tariff,
          "м³"
        ),
        value: waterAmount,
      },
    ];

    utilities.customPayments.forEach((payment) => {
      if (payment.name || payment.amount) {
        items.push({
          label: payment.name || "Додаткова плата",
          value: Number(payment.amount || 0),
        });
      }
    });

    return items;
  }, [utilities, waterAmount, heatingAmount, electricityAmount]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className="title">Розрахунок комуналки</h1>
        <p className={styles.subtitle}>Дані зберігаються автоматично</p>
      </div>

      <div className={styles.section}>
        <div className={styles.utilityGrid} ref={gridRef}>
          {utilityItems.map((item, index) => (
            <div
              key={item.key}
              className={styles.utilityCard}
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <div className={styles.cardHeader}>
                <h3>{item.title}</h3>
                <p className={styles.cardMeta}>
                  {formatSummary(
                    utilities[item.key].prev,
                    utilities[item.key].current,
                    utilities[item.key].tariff,
                    item.unit
                  )}
                </p>
              </div>
              <div className={styles.cardFieldRow}>
                <FormInput
                  label="Минулий показник"
                  type="number"
                  value={utilities[item.key].prev}
                  placeholder="0"
                  className={styles.halfInput}
                  onChange={(value) => updateUtility(item.key, "prev", value)}
                />
                <FormInput
                  label="Поточний показник"
                  type="number"
                  value={utilities[item.key].current}
                  placeholder="0"
                  className={styles.halfInput}
                  onChange={(value) => updateUtility(item.key, "current", value)}
                />
              </div>
              <FormInput
                label={item.tariffLabel}
                type="number"
                value={utilities[item.key].tariff}
                placeholder="0"
                className={styles.tariffInput}
                onChange={(value) => updateUtility(item.key, "tariff", value)}
              />
            </div>
          ))}
        </div>

        <div className={styles.cardDots}>
          {utilityItems.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className={`${styles.dot} ${index === activeCard ? styles.activeDot : ""}`}
              onClick={() => scrollToCard(index)}
              aria-label={`Перейти до ${item.title}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Додаткові платежі</h2>
        <div className={styles.sectionDescription}>
          <p>Додайте сюди оплату за сміття, газопостачання та інші витрати.</p>
          <Button
            onClick={addPayment}
            icon={FaPlus}
            aria-label="Додати платіж"
            className={styles.addButton}
          />
        </div>

        <div className={styles.customPayments}>
          {utilities.customPayments.map((payment) => (
            <div key={payment.id} className={styles.paymentRow}>
              <FormInput
                value={payment.name}
                placeholder="Сміття, газ або інше"
                onChange={(value) => updatePayment(payment.id, "name", value)}
              />
              <FormInput
                type="number"
                value={payment.amount}
                placeholder="грн"
                onChange={(value) => updatePayment(payment.id, "amount", value)}
              />
              <Button
                onClick={() => removePayment(payment.id)}
                icon={FaTrash}
                aria-label="Видалити платіж"
                className={styles.removeButton}
              />
            </div>
          ))}
        </div>
      </div>

      <Paycheck
        title="Підсумок"
        items={paycheckItems}
        splitIndex={utilities.customPayments.length > 0 ? 3 : undefined}
        totalLabel="Усього до сплати"
        totalValue={totalAmount}
      />
    </div>
  );
}
