// utils/helpers.js
export const getWeekdays = (year, month) => {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
};

export function formatWorkDaysWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "буд. днів";
  if (lastDigit === 1) return "буд. день";
  if (lastDigit >= 2 && lastDigit <= 4) return "буд. дні";
  return "буд. днів";
}

export function formatDaysWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "днів";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дні";
  return "днів";
}

export function formatHoursWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "годин";
  if (lastDigit === 1) return "година";
  if (lastDigit >= 2 && lastDigit <= 4) return "години";
  return "годин";
}

export const fetchUsdRate = async (signal, date = new Date()) => {
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
    if (err.name !== "AbortError") {
      console.error("fetchUsdRate error", err);
    }
  }
  return null;
};
