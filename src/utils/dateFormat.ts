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
  const formatted = new Intl.DateTimeFormat("en-GB", options).format(date);
  return formatted.replace(/\//g, "-");
}

/**
 * Format a date string or Date object to DD-MM-YYYY | HH:mm in GMT+6 (Bangladesh Standard Time).
 */
export function formatDateTimeBD(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const dateStr = formatDateBD(date);
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Dhaka",
  };
  const timeStr = new Intl.DateTimeFormat("en-GB", timeOptions).format(date);
  return `${dateStr} | ${timeStr}`;
}

/**
 * Categorize AI score into risk assessment.
 */
export function getRiskAssessment(score: number | null): string {
  if (score === null) return "N/A";
  const pct = Math.round(score * 100);
  if (pct <= 30) return "Low Risk";
  if (pct <= 70) return "Moderate Risk";
  return "High Risk";
}
