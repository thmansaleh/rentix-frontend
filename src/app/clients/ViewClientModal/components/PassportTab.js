import { Plane, Globe, Calendar, FileText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { InfoField } from "./InfoField";
import { DocumentField } from "./DocumentField";

export function PassportTab({ customer, formatDate }) {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      {/* Passport Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Plane className="w-4 h-4" />
          {t("clients.view.sections.passportInfo")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.passportNumber")} value={customer.passport_number} icon={Plane} />
          <InfoField label={t("clients.view.fields.passportCountry")} value={customer.passport_country} icon={Globe} />
          <InfoField label={t("clients.view.fields.issueDate")} value={formatDate(customer.passport_issue_date)} icon={Calendar} />
          <InfoField label={t("clients.view.fields.expiryDate")} value={formatDate(customer.passport_expiry_date)} icon={Calendar} />
        </div>
      </div>

      {/* Passport Documents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t("clients.view.sections.passportDocuments")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentField label={t("clients.view.fields.passportFront")} url={customer.passport_front} />
          <DocumentField label={t("clients.view.fields.passportBack")} url={customer.passport_back} />
        </div>
      </div>
    </div>
  );
}
