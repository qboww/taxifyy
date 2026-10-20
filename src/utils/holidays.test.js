import { describe, expect, it } from "vitest";
import { getMonthCalendarStats } from "./holidays";

describe("getMonthCalendarStats", () => {
  it("counts weekdays, weekends, and holidays without changing working days", () => {
    const stats = getMonthCalendarStats(2026, 9, [
      { date: "2026-10-01", localName: "Holiday" },
      { date: "2026-10-03", localName: "Weekend holiday" },
    ]);

    expect(stats).toEqual({
      daysInMonth: 31,
      workingDays: 22,
      weekendDays: 9,
      holidayDays: 2,
    });
  });

  it("returns zero holidays when no holiday data is available", () => {
    expect(getMonthCalendarStats(2026, 1)).toEqual({
      daysInMonth: 28,
      workingDays: 20,
      weekendDays: 8,
      holidayDays: 0,
    });
  });
});
