import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { format, subMonths, startOfMonth } from "date-fns";

import { fetchExchangeRate } from "../../../utils/helpers";
import CurrencySelect from "../../UI/CurrencySelect/CurrencySelect";
import FormInput from "../../UI/FormInput/FormInput";
import ToggleSwitch from "../../UI/ToggleSwitch/ToggleSwitch";
import styles from "./Statistics.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CURRENCIES = ["UAH", "USD", "EUR", "RON", "PLN"];
const CURRENCY_OPTIONS = CURRENCIES.map((code) => ({ label: code, value: code }));

const getUahRate = async (currency, signal, date) => {
  if (currency === "UAH") {
    return { rate: 1, exchangedate: date.toLocaleDateString("uk-UA") };
  }
  return fetchExchangeRate(currency, signal, date);
};

const getPairRate = async (fromCurrency, toCurrency, signal, date = new Date()) => {
  if (fromCurrency === toCurrency) {
    return { rate: 1, exchangedate: date.toLocaleDateString("uk-UA") };
  }

  const [fromRate, toRate] = await Promise.all([
    getUahRate(fromCurrency, signal, date),
    getUahRate(toCurrency, signal, date),
  ]);
  if (!fromRate || !toRate || toRate.rate === 0) return null;

  return {
    rate: fromRate.rate / toRate.rate,
    exchangedate: fromRate.exchangedate || toRate.exchangedate,
  };
};

export default function Statistics() {
  const [fromCurrency, setFromCurrency] = useState("UAH");
  const [toCurrency, setToCurrency] = useState("RON");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [todayRate, setTodayRate] = useState(null);
  const [chartPeriod, setChartPeriod] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [lastChanged, setLastChanged] = useState(null);
  const [loadingError, setLoadingError] = useState(false);
  const [chartError, setChartError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setTodayRate(null);
    setLoadingError(false);

    getPairRate(fromCurrency, toCurrency, controller.signal)
      .then((rate) => {
        setTodayRate(rate);
        setLoadingError(!rate);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Помилка завантаження курсу:", error);
          setLoadingError(true);
        }
        setTodayRate(null);
      });
    return () => controller.abort();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!todayRate) return;
    if (lastChanged === "from") {
      setToAmount(
        fromAmount === "" || isNaN(fromAmount)
          ? ""
          : (Number(fromAmount) * todayRate.rate).toFixed(2)
      );
    } else if (lastChanged === "to") {
      setFromAmount(
        toAmount === "" || isNaN(toAmount) ? "" : (Number(toAmount) / todayRate.rate).toFixed(2)
      );
    }
  }, [fromAmount, toAmount, todayRate, lastChanged]);

  useEffect(() => {
    const controller = new AbortController();
    setChartError(false);

    const loadRates = async () => {
      const today = new Date();
      const dates = [];
      if (chartPeriod === "week") {
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
      } else if (chartPeriod === "month") {
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
      } else {
        for (let i = 11; i >= 0; i--) {
          dates.push(startOfMonth(subMonths(today, i)));
        }
      }

      try {
        const results = await Promise.all(
          dates.map((date) => getPairRate(fromCurrency, toCurrency, controller.signal, date))
        );
        const filtered = results
          .map((rate, index) =>
            rate ? { date: rate.exchangedate, rate: rate.rate, requestedDate: dates[index] } : null
          )
          .filter(Boolean);
        setChartData(filtered);
        setChartError(filtered.length === 0);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Помилка завантаження даних:", error);
          setChartError(true);
          setChartData([]);
        }
      }
    };

    loadRates();
    return () => controller.abort();
  }, [chartPeriod, fromCurrency, toCurrency]);

  // Synchronize the target amount whenever the source amount or exchange rate changes.
  useEffect(() => {
    if (!todayRate && !loadingError) return;
    if (loadingError) {
      if (lastChanged === "from") setToAmount("");
      if (lastChanged === "to") setFromAmount("");
    }
  }, [todayRate, loadingError, lastChanged]);

  const formatChartLabel = (dateString) => {
    const date = new Date(dateString.split(".").reverse().join("-"));

    switch (chartPeriod) {
      case "week":
      case "month":
        return format(date, "dd.MM");
      case "year":
        return format(date, "MM.yy");
      default:
        return format(date, "dd.MM");
    }
  };

  const chartJsData = {
    labels: chartData.map((item) => formatChartLabel(item.date)),
    datasets: [
      {
        label: `${toCurrency} за 1 ${fromCurrency}`,
        data: chartData.map((item) => item.rate),
        borderColor: "#708A58",
        backgroundColor: "#2D4F2B",
        tension: 0.3,
        pointRadius: chartPeriod === "year" ? 3 : 4,
        pointHoverRadius: chartPeriod === "year" ? 5 : 6,
      },
    ],
  };

  const periodText = chartData.length
    ? `Період: ${chartData[0].date} – ${chartData[chartData.length - 1].date}`
    : "";

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Курс: ${context.parsed.y.toFixed(4)} ${toCurrency}`,
          title: (context) => {
            const date = new Date(
              chartData[context[0].dataIndex].date.split(".").reverse().join("-")
            );
            return format(date, "dd.MM.yyyy");
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: chartPeriod === "year" ? 10 : 12 },
          maxRotation: chartPeriod === "month" ? 45 : 0,
        },
      },
      y: { beginAtZero: false },
    },
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.headerContainer}>
        <h1 className="title">Конвертація валют</h1>
        {loadingError ? (
          <p className={styles.errorMessage}>Не вдалося завантажити курс НБУ. Спробуйте пізніше.</p>
        ) : todayRate ? (
          <p className={styles.todayRate}>
            1 {fromCurrency} = {todayRate.rate.toFixed(4)} {toCurrency} (НБУ,{" "}
            {todayRate.exchangedate})
          </p>
        ) : (
          <p className={styles.loadingMessage}>Завантаження курсу...</p>
        )}
      </div>

      <div className={styles.currencyPair}>
        <CurrencySelect
          label="З валюти"
          value={fromCurrency}
          onChange={setFromCurrency}
          options={CURRENCY_OPTIONS}
        />
        <CurrencySelect
          label="У валюту"
          value={toCurrency}
          onChange={setToCurrency}
          options={CURRENCY_OPTIONS}
        />
      </div>

      <div className={styles.inputsContainer}>
        <FormInput
          type="number"
          value={fromAmount}
          onChange={(value) => {
            setFromAmount(value);
            setLastChanged("from");
          }}
          placeholder={`Сума в ${fromCurrency}`}
          label={`Сума (${fromCurrency}):`}
          disabled={!todayRate || loadingError}
        />
        <FormInput
          type="number"
          value={toAmount}
          onChange={(value) => {
            setToAmount(value);
            setLastChanged("to");
          }}
          placeholder={`Сума в ${toCurrency}`}
          label={`Сума (${toCurrency}):`}
          disabled={!todayRate || loadingError}
        />
      </div>

      <ToggleSwitch
        options={[
          { label: "Тиждень", value: "week" },
          { label: "Місяць", value: "month" },
          { label: "Рік", value: "year" },
        ]}
        value={chartPeriod}
        onChange={setChartPeriod}
        center
      />

      <div className={styles.chartContainer}>
        {chartError ? (
          <p className={styles.errorMessage}>Не вдалося завантажити дані для графіка.</p>
        ) : (
          <>
            {periodText && <p className={styles.period}>{periodText}</p>}
            <div style={{ width: "100%" }}>
              {chartData.length > 0 ? (
                <Line data={chartJsData} options={chartOptions} />
              ) : (
                <p className={styles.loadingMessage}>Завантаження графіка...</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
