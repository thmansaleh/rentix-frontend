/**
 * Get the Badge variant for a given invoice status.
 */
export function getStatusVariant(status) {
  switch (status) {
    case "paid":
      return "default";
    case "partial":
      return "secondary";
    case "unpaid":
      return "destructive";
    default:
      return "outline";
  }
}

/**
 * Get a human-readable label for an invoice status.
 */
export function getStatusLabel(status, language = "en") {
  const labels = {
    unpaid: language === "ar" ? "غير مدفوعة" : "Unpaid",
    partial: language === "ar" ? "مدفوعة جزئياً" : "Partial",
    paid: language === "ar" ? "مدفوعة" : "Paid",
  };
  return labels[status] || status;
}

/**
 * Get a human-readable label for a payment method.
 */
export function getPaymentMethodLabel(method, language = "en") {
  const methods = {
    cash: language === "ar" ? "نقداً" : "Cash",
    card: language === "ar" ? "بطاقة" : "Card",
    bank_transfer: language === "ar" ? "تحويل بنكي" : "Bank Transfer",
    // credit_card: language === "ar" ? "بطاقة ائتمان" : "Credit Card",
    // online: language === "ar" ? "أونلاين" : "Online",
    // wallet: language === "ar" ? "محفظة" : "Wallet",
    cheque: language === "ar" ? "شيك" : "Cheque",
  };
  return methods[method] || method;
}

/**
 * Get the branch display name based on language direction.
 */
export function getBranchName(branch, isRTL) {
  if (!branch) return "-";
  if (isRTL) return branch.name_ar || branch.name_en || "-";
  return branch.name_en || branch.name_ar || "-";
}

/**
 * Get the branch display name from an invoice row.
 */
export function getInvoiceBranchName(invoice, isRTL) {
  if (isRTL) return invoice.branch_name || "-";
  return invoice.branch_name_en || invoice.branch_name || "-";
}
