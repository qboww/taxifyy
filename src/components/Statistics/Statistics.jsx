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

import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

import { fetchUsdRate } from "../../utils/helpers";
import FormInput from "../UI/FormInput/FormInput";
import ToggleSwitch from "../UI/ToggleSwitch/ToggleSwitch";
import styles from "./Statistics.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Statistics() {
  const [uah, setUah] = useState("");
  const [usd, setUsd] = useState("");
  const [todayRate, setTodayRate] = useState(null);
  const [chartPeriod, setChartPeriod] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [lastChanged, setLastChanged] = useState(null);
  const [loadingError, setLoadingError] = useState(false);

  // Отримати курс на сьогодні
  useEffect(() => {
    const controller = new AbortController();
    fetchUsdRate(controller.signal)
      .then((rate) => {
        setTodayRate(rate);
        setLoadingError(false);
      })
      .catch((error) => {
        console.error("Помилка завантаження курсу:", error);
        setLoadingError(true);
        setTodayRate(null);
      });
    return () => controller.abort();
  }, []);

  // Завантаження даних для графіку
  useEffect(() => {
    const controller = new AbortController();

    const loadRates = async () => {
      const today = new Date();
      const promises = [];

      if (chartPeriod === "week") {
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          promises.push(fetchUsdRate(controller.signal, d));
        }
      } else if (chartPeriod === "month") {
        // Отримуємо дані за останні 30 днів
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          promises.push(fetchUsdRate(controller.signal, d));
        }
      } else if (chartPeriod === "year") {
        // Отримуємо дані за останні 12 місяців (перший день кожного місяця)
        for (let i = 11; i >= 0; i--) {
          const d = startOfMonth(subMonths(today, i));
          promises.push(fetchUsdRate(controller.signal, d));
        }
      }

      try {
        const results = await Promise.all(promises);
        const filtered = results.filter(Boolean).map((r) => ({
          date: r.exchangedate,
          rate: r.rate,
        }));
        setChartData(filtered);
        setLoadingError(false);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        setLoadingError(true);
        setChartData([]);
      }
    };

    loadRates();
    return () => controller.abort();
  }, [chartPeriod]);

  // Синхронізація UAH → USD
  useEffect(() => {
    if (todayRate && lastChanged === "uah") {
      if (uah === "" || isNaN(uah)) {
        setUsd("");
      } else {
        setUsd((uah / todayRate.rate).toFixed(2));
      }
    }
  }, [uah, todayRate, lastChanged]);

  // Синхронізація USD → UAH
  useEffect(() => {
    if (todayRate && lastChanged === "usd") {
      if (usd === "" || isNaN(usd)) {
        setUah("");
      } else {
        setUah((usd * todayRate.rate).toFixed(2));
      }
    }
  }, [usd, todayRate, lastChanged]);

  // Форматування дати для міток графіка
  const formatChartLabel = (dateString) => {
    const date = new Date(dateString.split(".").reverse().join("-"));
    
    switch (chartPeriod) {
      case "week":
        return format(date, "dd.MM");
      case "month":
        return format(date, "dd.MM");
      case "year":
        return format(date, "MM.yy");
      default:
        return format(date, "dd.MM");
    }
  };

  // Дані для Chart.js
  const chartJsData = {
    labels: chartData.map(d => formatChartLabel(d.date)),
    datasets: [
      {
        label: "Курс USD",
        data: chartData.map((d) => d.rate),
        borderColor: "#708A58",
        backgroundColor: "#2D4F2B",
        tension: 0.3,
        pointRadius: chartPeriod === "year" ? 3 : 4,
        pointHoverRadius: chartPeriod === "year" ? 5 : 6,
      },
    ],
  };

  // Показати діапазон дат зверху графіка
  const periodText = chartData.length ? `Період: ${chartData[0].date} – ${chartData[chartData.length - 1].date}` : "";

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Курс: ${context.formattedValue} грн`,
          title: (context) => {
            const date = new Date(chartData[context[0].dataIndex].date.split(".").reverse().join("-"));
            return format(date, "dd.MM.yyyy");
          }
        },
      },
    },
    scales: {
      x: { 
        ticks: { 
          font: { size: chartPeriod === "year" ? 10 : 12 },
          maxRotation: chartPeriod === "month" ? 45 : 0
        } 
      },
      y: { beginAtZero: false },
    },
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.headerContainer}>
        <h2>Конвертація валют</h2>
        {loadingError ? (
          <p className={styles.errorMessage}>
            Не вдалося завантажити курс НБУ. Спробуйте пізніше.
          </p>
        ) : todayRate ? (
          <p className={styles.todayRate}>
            Курс НБУ: {todayRate.rate} грн за $1 ({todayRate.exchangedate})
          </p>
        ) : (
          <p className={styles.loadingMessage}>Завантаження курсу...</p>
        )}
      </div>

      <div className={styles.inputsContainer}>
        <FormInput
          type="number"
          value={uah}
          onChange={(val) => {
            setUah(val);
            setLastChanged("uah");
          }}
          placeholder="Сума в гривнях"
          label="Сума (UAH):"
          disabled={!todayRate || loadingError}
        />
        <FormInput
          type="number"
          value={usd}
          onChange={(val) => {
            setUsd(val);
            setLastChanged("usd");
          }}
          placeholder="Сума в доларах"
          label="Сума (USD):"
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
        disabled={loadingError}
      />

      <div className={styles.chartContainer}>
        {loadingError ? (
          <p className={styles.errorMessage}>
            Не вдалося завантажити дані для графіка. Спробуйте пізніше.
          </p>
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