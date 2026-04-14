// utils/helpers.ts

export const getWeekdays = (year: number, month: number): number => {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
};

const pluralize = (count: number, words: [string, string, string]): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return words[2];
  if (lastDigit === 1) return words[0];
  if (lastDigit >= 2 && lastDigit <= 4) return words[1];
  return words[2];
};

export function formatWorkDaysWord(count: number): string {
  return pluralize(count, ["буд. день", "буд. дні", "буд. днів"]);
}

export function formatDaysWord(count: number): string {
  return pluralize(count, ["день", "дні", "днів"]);
}

export function formatHoursWord(count: number): string {
  return pluralize(count, ["година", "години", "годин"]);
}

export const fetchUsdRate = async (
  signal: AbortSignal,
  date: Date = new Date()
): Promise<{ rate: number; exchangedate: string } | null> => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}${mm}${dd}`;
  const url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=${formattedDate}&json`;

  try {
    const res = await fetch(url, { signal });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].rate) {
      return { rate: Number(data[0].rate), exchangedate: data[0].exchangedate };
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.error("fetchUsdRate error", err);
    }
  }
  return null;
};

export const formatCurrency = (val: number | string | any): string | any => {
  if (val == null || typeof val.toFixed !== "function") return val;

  const fixedStr = val.toFixed(2);
  return fixedStr.endsWith(".00") ? fixedStr.slice(0, -3) : fixedStr;
};
