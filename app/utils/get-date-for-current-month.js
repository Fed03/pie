export default function getDateForCurrentMonth() {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0,0,0,0);

  return currentMonth;
}
