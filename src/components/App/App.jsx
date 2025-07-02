import { useState } from "react";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { REPORT_PERIODS } from "../../utils/constants";
import IncomeCalculator from "../IncomeCalculator/IncomeCalculator";
import TaxCalculator from "../TaxCalculator/TaxCalculator";
import "./App.css";

export default function App() {
  const [income, setIncome] = useLocalStorageWithExpiry("taxCalc_income", "");
  const [mode, setMode] = useLocalStorageWithExpiry("taxCalc_mode", REPORT_PERIODS.MONTH);
  const [quarterlyIncome, setQuarterlyIncome] = useLocalStorageWithExpiry("taxCalc_quarterlyIncome", "");
  const [tab, setTab] = useState("income");

  const handleTransfer = (uah) => {
    if (!uah) return;
    setIncome(uah.toFixed(2));
    setMode(REPORT_PERIODS.MONTH);
    setTab("taxes");
  };

  return (
    <div className="app">
      <div className="toggle-container">
        <button className={`toggle-option ${tab === "income" ? "active" : ""}`} onClick={() => setTab("income")}>Дохід</button>
        <button className={`toggle-option ${tab === "taxes" ? "active" : ""}`} onClick={() => setTab("taxes")}>Податки</button>
      </div>
      {tab === "income" ? (
        <IncomeCalculator onTransfer={handleTransfer} />
      ) : (
        <TaxCalculator
          income={income}
          setIncome={setIncome}
          mode={mode}
          setMode={setMode}
          quarterlyIncome={quarterlyIncome}
          setQuarterlyIncome={setQuarterlyIncome}
        />
      )}
    </div>
  );
}