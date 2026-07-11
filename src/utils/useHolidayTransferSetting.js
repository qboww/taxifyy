// useHolidayTransferSetting.js
// React hook to manage the holiday transfer (перенесення свят) setting and persistence
import { useLocalStorageWithExpiry } from "./useLocalStorageWithExpiry";

const HOLIDAY_TRANSFER_KEY = "taxCalc_holidayTransfer";

// Default: enabled globally (can be refined per-country if needed)
const DEFAULT_TRANSFER = true;

export function useHolidayTransferSetting() {
  const [enabled, setEnabled] = useLocalStorageWithExpiry(
    HOLIDAY_TRANSFER_KEY,
    DEFAULT_TRANSFER,
    null
  );
  return [enabled, setEnabled];
}
