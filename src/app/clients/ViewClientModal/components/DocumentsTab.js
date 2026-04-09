import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, IdCard, Plane } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { EmiratesIdTab } from "./EmiratesIdTab";
import { LicenseTab } from "./LicenseTab";
import { PassportTab } from "./PassportTab";
import { useLanguage } from "@/contexts/LanguageContext";

export function DocumentsTab({ customer, formatDate }) {
  const { t } = useTranslations();
const { isRTL } = useLanguage();
  return (
    <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="emirates" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="emirates">
          <CreditCard className="w-4 h-4 mr-2" />
          {t("clients.view.tabs.emirates")}
        </TabsTrigger>
        <TabsTrigger value="license">
          <IdCard className="w-4 h-4 mr-2" />
          {t("clients.view.tabs.license")}
        </TabsTrigger>
        <TabsTrigger value="passport">
          <Plane className="w-4 h-4 mr-2" />
          {t("clients.view.tabs.passport")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="emirates">
        <EmiratesIdTab customer={customer} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="license">
        <LicenseTab customer={customer} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="passport">
        <PassportTab customer={customer} formatDate={formatDate} />
      </TabsContent>
    </Tabs>
  );
}
