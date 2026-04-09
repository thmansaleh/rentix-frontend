import { IdCard, Globe, Calendar, FileText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { InfoField } from "./InfoField";
import { DocumentField } from "./DocumentField";

export function LicenseTab({ customer, formatDate }) {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      {/* License Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <IdCard className="w-4 h-4" />
          {t("clients.view.sections.licenseInfo")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.licenseNumber")} value={customer.driving_license_no} icon={IdCard} />
          <InfoField label={t("clients.view.fields.issuingCountry")} value={customer.driving_license_country} icon={Globe} />
          <InfoField label={t("clients.view.fields.expiryDate")} value={formatDate(customer.driving_license_expiry)} icon={Calendar} />
        </div>
      </div>

      {/* License Documents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t("clients.view.sections.licenseDocuments")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentField label={t("clients.view.fields.licenseFront")} url={customer.license_front} />
          <DocumentField label={t("clients.view.fields.licenseBack")} url={customer.license_back} />
        </div>
      </div>
    </div>
  );
}
