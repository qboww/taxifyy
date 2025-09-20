import { useState } from "react";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { REPORT_PERIODS } from "../../utils/constants";
import { FaGithub } from "react-icons/fa";

import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import IncomeCalculator from "../IncomeCalculator/IncomeCalculator";
import TaxCalculator from "../TaxCalculator/TaxCalculator";
import Statistics from "../Statistics/Statistics";

import "./App.css";

const TAB_OPTIONS = [
  { label: "Дохід", value: "income" },
  { label: "Податки", value: "taxes" },
  { label: "Обмін", value: "exchange" },
];

export default function App() {
  const [income, setIncome] = useLocalStorageWithExpiry("taxCalc_income", "");
  const [mode, setMode] = useLocalStorageWithExpiry("taxCalc_mode", REPORT_PERIODS.MONTH);
  const [quarterlyIncome, setQuarterlyIncome] = useLocalStorageWithExpiry("taxCalc_quarterlyIncome", "");
  const [activeTab, setActiveTab] = useLocalStorageWithExpiry("taxCalc_activeTab", "income");

  const handleTransfer = (uah) => {
    if (!uah) return;
    setIncome(uah.toFixed(2));
    setMode(REPORT_PERIODS.MONTH);
    setActiveTab("taxes");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "income":
        return <IncomeCalculator onTransfer={handleTransfer} />;
      
      case "taxes":
        return (
          <TaxCalculator
            income={income}
            setIncome={setIncome}
            mode={mode}
            setMode={setMode}
            quarterlyIncome={quarterlyIncome}
            setQuarterlyIncome={setQuarterlyIncome}
          />
        );
      
      case "exchange":
        return <Statistics />;
      
      default:
        return <IncomeCalculator onTransfer={handleTransfer} />;
    }
  };

  return (
    <div className="app">
      <ToggleSwitch
        options={TAB_OPTIONS}
        value={activeTab}
        onChange={setActiveTab}
        center
      />

      {renderActiveTab()}

      <a
        href="https://github.com/qboww/taxifyy"
        className="github-link"
        target="_blank"
        rel="noopener noreferrer"
        title="Відкрити репозиторій на GitHub"
      >
        <FaGithub size={34} />
      </a>
    </div>
  );
}