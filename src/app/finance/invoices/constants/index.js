export const ITEMS_PER_PAGE = 10;

export const PAYMENT_METHODS = [
  { value: "cash", labelAr: "نقداً", labelEn: "Cash" },
  { value: "card", labelAr: "بطاقة", labelEn: "Card" },
  { value: "bank_transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer" },
];

export const ITEM_TYPES = [
    { value: "rental", labelAr: "إيجار", labelEn: "Rental" },
  { value: "service", labelAr: "خدمة", labelEn: "Service" },
//   { value: "fee", labelAr: "رسوم", labelEn: "Fee" },
  { value: "other", labelAr: "أخرى", labelEn: "Other" },
];

export const STATUS_OPTIONS = [
  { value: "all", labelAr: "جميع الحالات", labelEn: "All Statuses" },
  { value: "unpaid", labelAr: "غير مدفوعة", labelEn: "Unpaid" },
  { value: "partial", labelAr: "مدفوعة جزئياً", labelEn: "Partial" },
  { value: "paid", translationKey: "statusPaid" },
];

export const TAX_RATE = 0.05;

export const DEFAULT_INVOICE_ITEM = {
  description: "",
  quantity: 1,
  unit_price: 0,
  item_type: "service",
};
