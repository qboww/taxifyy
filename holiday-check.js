import Holidays from "date-holidays";

const hd = new Holidays("UA");

console.log("count", hd.getHolidays(2026).length);
console.log(
  JSON.stringify(
    hd.getHolidays(2026).filter((h) => h.date.startsWith("2026-05")),
    null,
    2
  )
);
console.log("observed", hd.isObserved());
