// getTransferredHolidays.js
// Utility to compute transferred holidays ("перенесення свят") for a given year/month and holiday list
// Returns a map: ISO date string => { name, isTransfer, originalDate }

export function getTransferredHolidays(holidays, year, month, transferEnabled) {
  if (!transferEnabled) return {};
  const transfers = {};
  const holidaysByDate = Object.fromEntries(holidays.map((h) => [h.date, h]));
  holidays.forEach((h) => {
    const date = new Date(h.date);
    // Only process holidays in the current month
    if (date.getFullYear() !== year || date.getMonth() !== month) return;
    const dow = date.getDay();
    if (dow === 0 || dow === 6) {
      // Sunday or Saturday
      // Find next Monday
      const monday = new Date(date);
      monday.setDate(date.getDate() + ((8 - dow) % 7));
      const mondayIso = monday.toISOString().substring(0, 10);
      // Only add if not already a holiday
      if (!holidaysByDate[mondayIso]) {
        transfers[mondayIso] = {
          name: h.name,
          isTransfer: true,
          originalDate: h.date,
        };
      }
    }
  });
  return transfers;
}
