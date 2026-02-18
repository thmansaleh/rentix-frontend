import { format } from "date-fns";

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch {
    return dateString;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "PPP");
  } catch {
    return dateString;
  }
};

export const getStatusVariant = (status) => {
  const variants = {
    available: "default",
    rented: "secondary",
    maintenance: "outline",
    sold: "destructive",
  };
  return variants[status] || "default";
};

export const getStatusLabel = (status, t) => {
  const labels = {
    available: t("cars.statusAvailable"),
    rented: t("cars.statusRented"),
    maintenance: t("cars.statusMaintenance"),
    sold: t("cars.statusSold"),
  };
  return labels[status] || status;
};

export const getDocumentTypeLabel = (type, t) => {
  const labels = {
    registration: t("cars.documents.types.registration"),
    insurance: t("cars.documents.types.insurance"),
    inspection: t("cars.documents.types.inspection"),
    purchase_invoice: t("cars.documents.types.purchase_invoice"),
    warranty: t("cars.documents.types.warranty"),
    other: t("cars.documents.types.other"),
  };
  return labels[type] || type;
};
