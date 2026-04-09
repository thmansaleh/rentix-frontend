import useSWR from "swr";
import { Loader2, AlertCircle, FileX } from "lucide-react";
import { getInvoicesByCustomerId } from "../../../services/api/invoices";
import InvoicesTable from "../../../finance/invoices/components/InvoicesTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

export function InvoicesTab({ customerId }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();

  const { data, isLoading, error, mutate } = useSWR(
    customerId ? `invoices-by-customer-${customerId}` : null,
    () => getInvoicesByCustomerId(customerId),
    { revalidateOnFocus: false }
  );

  const invoices = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500 gap-2">
        <AlertCircle className="w-8 h-8" />
        <p>{t("invoices.loadingInvoiceData")}</p>
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2">
        <FileX className="w-8 h-8" />
        <p>{t("invoices.noInvoicesFound")}</p>
      </div>
    );
  }

  return (
    <InvoicesTable
      invoices={invoices}
      language={isRTL ? "ar" : "en"}
      isRTL={isRTL}
      onDataChange={mutate}
    />
  );
}
