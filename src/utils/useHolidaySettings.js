// useHolidaySettings.js
// React hook to manage holiday country/region selection and persistence
import { useLocalStorageWithExpiry } from "./useLocalStorageWithExpiry";
import { HolidayService } from "./HolidayService";

const HOLIDAY_COUNTRY_KEY = "taxCalc_holidayCountry";

export function useHolidaySettings() {
  // Try to auto-detect on first load, but persist user override
  const detected = HolidayService.detectCountry() || "UA"; // fallback to UA
  const [country, setCountry] = useLocalStorageWithExpiry(HOLIDAY_COUNTRY_KEY, detected, null); // no expiry

  return {
    country,
    setCountry,
    detected,
  };
}
