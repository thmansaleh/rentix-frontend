// Pagination configuration
export const ITEMS_PER_PAGE = 20;

// Debounce delay for search (in milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 400;

// Table column configuration for export
export const getExportColumnConfig = (t, language) => ({
  name: {
    label: t("name"),
    dataKey: "name",
  },
  balance: {
    label: t("balance"),
    dataKey: "balance",
    formatter: (value) => {
      const numericValue = Number(value ?? 0);
      if (Number.isNaN(numericValue)) {
        return value ?? 0;
      }
      return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    },
  },
  phone: {
    label: t("phone"),
    dataKey: "phone",
  },
  nationality: {
    label: t("nationality"),
    dataKey: "nationality",
  },
});

// Table column definitions
export const TABLE_COLUMNS = {
  NAME: "name",
  BALANCE: "balance",
  PHONE: "phone",
  NATIONALITY: "nationality",
  ACTIONS: "actions",
};
