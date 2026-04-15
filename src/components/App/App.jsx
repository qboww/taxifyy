import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { REPORT_PERIODS } from "../../utils/constants";
import { FaGithub, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import IncomeCalculator from "../Forms/IncomeCalculator/IncomeCalculator";
import TaxCalculator from "../Forms/TaxCalculator/TaxCalculator";
import UtilitiesCalculator from "../Forms/UtilitiesCalculator/UtilitiesCalculator";
import Statistics from "../Forms/Statistics/Statistics";

import "./App.css";

const TAB_OPTIONS = [
  { label: "Дохід", value: "income" },
  { label: "Податки", value: "taxes" },
  { label: "Обмін", value: "exchange" },
  { label: "Житло", value: "utilities" },
];

export default function App() {
  const [income, setIncome] = useLocalStorageWithExpiry("taxCalc_income", "");
  const [mode, setMode] = useLocalStorageWithExpiry("taxCalc_mode", REPORT_PERIODS.MONTH);
  const [quarterlyIncome, setQuarterlyIncome] = useLocalStorageWithExpiry(
    "taxCalc_quarterlyIncome",
    ""
  );
  const [activeTab, setActiveTab] = useLocalStorageWithExpiry("taxCalc_activeTab", "income");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      case "utilities":
        return <UtilitiesCalculator />;

      case "exchange":
        return <Statistics />;

      default:
        return <IncomeCalculator onTransfer={handleTransfer} />;
    }
  };

  return (
    <div className="app">
      <ToggleSwitch options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} center />

      {renderActiveTab()}

      <div className={`side-drawer-container ${isMenuOpen ? "open" : ""}`}>
        <button
          className="drawer-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle links"
        >
          {isMenuOpen ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>

        <div className="drawer-menu">
          <a
            href="https://github.com/qboww/taxifyy"
            className="drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            title="Відкрити репозиторій на GitHub"
          >
            <FaGithub size={24} />
          </a>

          <a
            href="https://send.monobank.ua/jar/LHAfJ6J5c"
            className="drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            title="Відкрити моно-банку"
          >
            <img src="/jar.png" alt="MonoJar" width="24" height="24" />
          </a>
        </div>
      </div>
    </div>
  );
}
