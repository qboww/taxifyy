// HolidayService.ts
// Provides holiday data and logic for the calendar UI.
// Uses date-holidays for dynamic, region-aware holiday calculation.
// All holiday logic is encapsulated here for maintainability.

import Holidays, { Holiday, CountryCode, LanguageCode } from "date-holidays";

export interface HolidayInfo {
  date: string; // ISO date string (YYYY-MM-DD)
  name: string;
  type: string;
}

export interface HolidayServiceOptions {
  country: CountryCode;
  state?: string;
  region?: string;
  language?: LanguageCode;
}

export class HolidayService {
  private hd: Holidays;
  private country: CountryCode;
  private state?: string;
  private region?: string;
  private language?: LanguageCode;
  private holidaysByYear: Map<number, HolidayInfo[]> = new Map();

  constructor(options: HolidayServiceOptions) {
    this.country = options.country;
    this.state = options.state;
    this.region = options.region;
    this.language = options.language;
    this.hd = new Holidays(this.country, this.state, this.region, this.language);
  }

  async getHolidays(year: number): Promise<HolidayInfo[]> {
    if (this.holidaysByYear.has(year)) {
      return this.holidaysByYear.get(year)!;
    }
    const holidays = this.hd.getHolidays(year) as Holiday[];
    const result = holidays.map((h) => ({
      date: h.date.substring(0, 10),
      name: h.name,
      type: h.type,
    }));
    this.holidaysByYear.set(year, result);
    return result;
  }

  async isHoliday(date: Date): Promise<{ isHoliday: boolean; name?: string; type?: string }> {
    const year = date.getFullYear();
    const iso = date.toISOString().substring(0, 10);
    const holidays = await this.getHolidays(year);
    const found = holidays.find((h) => h.date === iso);
    return found ? { isHoliday: true, name: found.name, type: found.type } : { isHoliday: false };
  }

  static detectCountry(): CountryCode | undefined {
    // Try to detect country from browser locale or timezone
    // Fallback to undefined if not found
    const locale = navigator.language || navigator.languages?.[0];
    if (locale) {
      const country = locale.split("-")[1];
      if (country && country.length === 2) {
        return country.toUpperCase() as CountryCode;
      }
    }
    // Optionally, use Intl.DateTimeFormat().resolvedOptions().timeZone for more advanced mapping
    return undefined;
  }
}
