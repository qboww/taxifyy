import { useState } from "react";
import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { REPORT_PERIODS } from "../../utils/constants";
import IncomeCalculator from "../IncomeCalculator/IncomeCalculator";
import TaxCalculator from "../TaxCalculator/TaxCalculator";
import { FaGithub } from "react-icons/fa";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";

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
      <ToggleSwitch
        options={[
          { label: "Дохід", value: "income" },
          { label: "Податки", value: "taxes" },
        ]}
        value={tab}
        onChange={setTab}
        marginBottom={16}
        center
      />

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
      <a href="https://github.com/qboww/taxifyy" className="github-link" target="_blank" rel="noopener noreferrer" title="Відкрити репозиторій на GitHub">
        <FaGithub size={34} />
      </a>
    </div>
  );
}
