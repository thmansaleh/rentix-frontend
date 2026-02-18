import { format } from "date-fns";

/**
 * Format a monetary amount with locale support.
 */
export function formatAmount(amount, language = "en") {
  const num = parseFloat(amount || 0);
  return num.toLocaleString(language === "ar" ? "ar-AE" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a date string to yyyy-MM-dd.
 */
export function formatDateShort(date) {
  if (!date) return "-";
  try {
    return format(new Date(date), "yyyy-MM-dd");
  } catch {
    return "-";
  }
}

/**
 * Format a date string with locale.
 */
export function formatDateLocale(dateStr, language = "en") {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString(
    language === "ar" ? "ar-AE" : "en-US"
  );
}
