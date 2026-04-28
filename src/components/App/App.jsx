import { useLocalStorageWithExpiry } from "../../utils/useLocalStorageWithExpiry";
import { REPORT_PERIODS } from "../../utils/constants";
import { FaGithub, FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";
import { useState } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import SettingsModal from "../UI/Settings/SettingsModal";
import Button from "../UI/Button/Button";
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

const ROUTE_MAP = {
  income: "/income",
  taxes: "/taxes",
  exchange: "/exchange",
  utilities: "/utilities",
};

export default function App() {
  const [income, setIncome] = useLocalStorageWithExpiry("taxCalc_income", "");
  const [mode, setMode] = useLocalStorageWithExpiry("taxCalc_mode", REPORT_PERIODS.MONTH);
  const [quarterlyIncome, setQuarterlyIncome] = useLocalStorageWithExpiry(
    "taxCalc_quarterlyIncome",
    ""
  );
  const [currency, setCurrency] = useLocalStorageWithExpiry("taxCalc_currency", "USD");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current tab from URL path
  const getCurrentTab = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    return path || "income";
  };

  const handleTransfer = (uah) => {
    if (!uah) return;
    setIncome(uah.toFixed(2));
    setMode(REPORT_PERIODS.MONTH);
    navigate("/taxes");
  };

  const handleTabChange = (tabValue) => {
    navigate(ROUTE_MAP[tabValue]);
  };

  return (
    <div className="app">
      <div className="app-header">
        <ToggleSwitch
          options={TAB_OPTIONS}
          value={getCurrentTab()}
          onChange={handleTabChange}
          center
        />
        <Button
          icon={FaCog}
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
          title="Налаштування"
          className="settings-btn"
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <Routes>
        <Route
          path="/income"
          element={<IncomeCalculator onTransfer={handleTransfer} currency={currency} />}
        />
        <Route
          path="/taxes"
          element={
            <TaxCalculator
              income={income}
              setIncome={setIncome}
              mode={mode}
              setMode={setMode}
              quarterlyIncome={quarterlyIncome}
              setQuarterlyIncome={setQuarterlyIncome}
            />
          }
        />
        <Route path="/utilities" element={<UtilitiesCalculator />} />
        <Route path="/exchange" element={<Statistics currency={currency} />} />
        {/* Redirect root to income */}
        <Route path="/" element={<Navigate to="/income" replace />} />
      </Routes>

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
