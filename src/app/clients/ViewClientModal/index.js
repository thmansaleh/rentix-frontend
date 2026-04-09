"use client";

import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, FileText, CreditCard, Banknote } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useViewClientModal } from "./useViewClientModal";
import { BasicInfoTab } from "./components/BasicInfoTab";
import { DocumentsTab } from "./components/DocumentsTab";
import { ContractsTab } from "./components/ContractsTab";
import { InvoicesTab } from "./components/InvoicesTab";
import { PaymentsTab } from "./components/PaymentsTab";

export function ViewClientModal({ isOpen, onClose, customerId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const {
    customer,
    loading,
    formatDate,
  } = useViewClientModal({ isOpen, customerId, onClose });

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("clients.view.title")} size="xl">
      <CustomModalBody className="h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : customer ? (
          <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-6 flex-shrink-0">
              <TabsTrigger value="basic">
                <User className="w-4 h-4 mr-2" />
                {t("clients.view.tabs.basic")}
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="w-4 h-4 mr-2" />
                {t("clients.view.tabs.documents") || "Documents"}
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <FileText className="w-4 h-4 mr-2" />
                {t("clients.view.tabs.contracts") || "Contracts"}
              </TabsTrigger>
              <TabsTrigger value="invoices">
                <CreditCard className="w-4 h-4 mr-2" />
                {t("clients.view.tabs.invoices") || "Invoices"}
              </TabsTrigger>
              <TabsTrigger value="payments">
                <Banknote className="w-4 h-4 mr-2" />
                {t("clients.view.tabs.payments") || "Payments"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="flex-1 overflow-y-auto">
              <BasicInfoTab customer={customer} formatDate={formatDate} />
            </TabsContent>

            <TabsContent value="documents" className="flex-1 overflow-y-auto">
              <DocumentsTab customer={customer} formatDate={formatDate} />
            </TabsContent>

            <TabsContent value="contracts" className="flex-1 overflow-y-auto">
              <ContractsTab customerId={customerId} />
            </TabsContent>

            <TabsContent value="invoices" className="flex-1 overflow-y-auto">
              <InvoicesTab customerId={customerId} />
            </TabsContent>

            <TabsContent value="payments" className="flex-1 overflow-y-auto">
              <PaymentsTab customerId={customerId} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t("clients.view.noData")}</p>
          </div>
        )}
      </CustomModalBody>

      <CustomModalFooter className="bg-gray-50 dark:bg-gray-800/50">
        <Button type="button" variant="outline" onClick={onClose} className="min-w-[120px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          {t("clients.view.close")}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
