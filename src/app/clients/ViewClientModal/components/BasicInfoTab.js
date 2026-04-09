import { Phone, Mail, Building, Globe, Calendar, MapPin, User } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { InfoField } from "./InfoField";
import { ClientHeader } from "./ClientHeader";

export function BasicInfoTab({ customer, formatDate }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const nationalityDisplay = isRTL ? customer.nationality_ar : customer.nationality_en;

  return (
    <div className="space-y-6">
      <ClientHeader customer={customer} />

      {/* Contact Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {t("clients.view.sections.contactInfo")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.phoneNumber")} value={customer.phone} icon={Phone} />
          <InfoField label={t("clients.view.fields.emailAddress")} value={customer.email} icon={Mail} />
        </div>
      </div>

      {/* Location & Branch */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Building className="w-4 h-4" />
          {t("clients.view.sections.locationDetails")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.branch")} value={customer.branch_name} icon={Building} />
          <InfoField label={t("clients.view.fields.nationality")} value={nationalityDisplay} icon={Globe} />
          <InfoField label={t("clients.view.fields.dateOfBirth")} value={formatDate(customer.date_of_birth)} icon={Calendar} />
          <div className="md:col-span-2">
            <InfoField label={t("clients.view.fields.address")} value={customer.address} icon={MapPin} />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t("clients.view.sections.systemInfo")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoField label={t("clients.view.fields.joinDate")} value={formatDate(customer.created_at)} icon={Calendar} />
          <InfoField label={t("clients.view.fields.createdBy")} value={customer.created_by_name} icon={User} />
        </div>
      </div>
    </div>
  );
}
