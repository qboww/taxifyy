// utils/helpers.js
export function getWeekdays(year, month) {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }

  return count;
}

export function formatWorkDaysWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'будніх днів';
  if (lastDigit === 1) return 'будній день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'будніх дні';
  return 'будніх днів';
};

export function formatDaysWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'днів';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дні';
  return 'днів';
}

export function formatHoursWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'годин';
  if (lastDigit === 1) return 'година';
  if (lastDigit >= 2 && lastDigit <= 4) return 'години';
  return 'годин';
}


export const fetchUsdRate = async (signal) => {
  const url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json";
  try {
    const res = await fetch(url, { signal });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].rate) {
      return {
        rate: Number(data[0].rate),
        exchangedate: data[0].exchangedate, // формат '02.07.2025'
      };
    }
  } catch {
    // ignore fetch errors
  }
  return null;
};