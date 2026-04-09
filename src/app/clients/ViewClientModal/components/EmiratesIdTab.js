import { CreditCard, Calendar, FileText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { InfoField } from "./InfoField";
import { DocumentField } from "./DocumentField";

export function EmiratesIdTab({ customer, formatDate }) {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      {/* ID Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          {t("clients.view.sections.idInfo")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.emiratesIdNumber")} value={customer.emirates_id} icon={CreditCard} />
          <InfoField label={t("clients.view.fields.expiryDate")} value={formatDate(customer.emirates_id_expiry)} icon={Calendar} />
        </div>
      </div>

      {/* ID Documents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t("clients.view.sections.idDocuments")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentField label={t("clients.view.fields.emiratesIdFront")} url={customer.emirates_id_front} />
          <DocumentField label={t("clients.view.fields.emiratesIdBack")} url={customer.emirates_id_back} />
        </div>
      </div>
    </div>
  );
}
