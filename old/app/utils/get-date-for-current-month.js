export default function getDateForCurrentMonth() {
  let currentMonth = new Date();
  currentMonth.setUTCDate(1);
  currentMonth.setUTCHours(0,0,0,0);

  return currentMonth;
}
