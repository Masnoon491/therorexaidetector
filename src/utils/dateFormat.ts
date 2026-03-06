/**
 * Format a date string or Date object to DD-MM-YYYY in GMT+6 (Bangladesh Standard Time).
 */
export function formatDateBD(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  };
  // Intl formats as MM/DD/YYYY or DD/MM/YYYY depending on locale, so we use en-GB for DD/MM/YYYY then replace
  const formatted = new Intl.DateTimeFormat("en-GB", options).format(date);
  return formatted.replace(/\//g, "-");
}
