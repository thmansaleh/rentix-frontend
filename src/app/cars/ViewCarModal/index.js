"use client";

import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Car,
  FileCheck,
  Wrench,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Receipt,
  Wallet,
} from "lucide-react";
import { useSWRConfig } from "swr";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ViewAccidentModal } from "../../accidents/ViewAccidentModal";
import { EditAccidentModal } from "../../accidents/EditAccidentModal";
import { DeleteAccidentModal } from "../../accidents/DeleteAccidentModal";
import { AddContractModal } from "../../contracts/AddContractModal";

import { useCarData } from "./useCarData";
import { BasicInfoTab } from "./BasicInfoTab";
import { RegistrationTab } from "./RegistrationTab";
import { MaintenanceTab } from "./MaintenanceTab";
import { AccidentsTab } from "./AccidentsTab";
import { ContractsTab } from "./ContractsTab";
import { FilesTab } from "./FilesTab";
import { FinesTab } from "./FinesTab";

export function ViewCarModal({ isOpen, onClose, carId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const { mutate } = useSWRConfig();

  const {
    loading,
    carData,
    activeTab,
    setActiveTab,
    selectedAccidentId,
    setSelectedAccidentId,
    selectedAccident,
    setSelectedAccident,
    isViewAccidentOpen,
    setIsViewAccidentOpen,
    isEditAccidentOpen,
    setIsEditAccidentOpen,
    isDeleteAccidentOpen,
    setIsDeleteAccidentOpen,
    isAddContractOpen,
    setIsAddContractOpen,
  } = useCarData({ isOpen, carId });

  if (loading) {
    return (
      <CustomModal isOpen={isOpen} onClose={onClose} title={t("cars.carDetails")} size="xl">
        <CustomModalBody className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CustomModalBody>
      </CustomModal>
    );
  }

  if (!carData) {
    return null;
  }

  return (
    <>
      <CustomModal isOpen={isOpen} onClose={onClose} title={t("cars.carDetails")} size="xl">
        <CustomModalBody className="h-[70vh] overflow-y-auto">
          <Tabs dir={isRTL ? "rtl" : "ltr"} value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-8 mb-6 flex-shrink-0">
              <TabsTrigger value="basic">
                <Car className="w-4 h-4 mr-2" />
                {t("cars.tabs.basic")}
              </TabsTrigger>
              <TabsTrigger value="registration">
                <FileCheck className="w-4 h-4 mr-2" />
                {t("cars.tabs.registration")}
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Wrench className="w-4 h-4 mr-2" />
                {isRTL ? "الصيانة" : "Maintenance"}
              </TabsTrigger>
              <TabsTrigger value="accidents">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {isRTL ? "الحوادث" : "Accidents"}
              </TabsTrigger>
              <TabsTrigger value="files">
                <ImageIcon className="w-4 h-4 mr-2" />
                {t("cars.tabs.files")}
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <FileText className="w-4 h-4 mr-2" />
                {isRTL ? "العقود" : "Contracts"}
              </TabsTrigger>
              <TabsTrigger value="fines">
                <Receipt className="w-4 h-4 mr-2" />
                {isRTL ? "المخالفات" : "Fines"}
              </TabsTrigger>
            </TabsList>

            <BasicInfoTab carData={carData} t={t} />
            <RegistrationTab carData={carData} t={t} />
            <MaintenanceTab
              carId={carId}
              isActive={activeTab === "maintenance"}
              isRTL={isRTL}
              t={t}
            />
            <AccidentsTab
              carId={carId}
              isActive={activeTab === "accidents"}
              isRTL={isRTL}
              onViewAccident={(id) => {
                setSelectedAccidentId(id);
                setIsViewAccidentOpen(true);
              }}
              onEditAccident={(id) => {
                setSelectedAccidentId(id);
                setIsEditAccidentOpen(true);
              }}
              onDeleteAccident={(accident) => {
                setSelectedAccident(accident);
                setIsDeleteAccidentOpen(true);
              }}
            />
            <FilesTab photos={carData?.photos || []} documents={carData?.documents || []} t={t} />
            <ContractsTab
              carId={carId}
              isActive={activeTab === "contracts"}
              isRTL={isRTL}
              onAddContract={() => setIsAddContractOpen(true)}
              carStatus={carData?.status}
            />
            <FinesTab
              carId={carData?.id}
              isActive={activeTab === "fines"}
              isRTL={isRTL}
            />
          
          </Tabs>
        </CustomModalBody>

        <CustomModalFooter>
          <Button onClick={onClose} className="min-w-[120px]">
            {t("cars.buttons.close")}
          </Button>
        </CustomModalFooter>
      </CustomModal>

      {/* Accident Modals */}
      <ViewAccidentModal
        isOpen={isViewAccidentOpen}
        onClose={() => {
          setIsViewAccidentOpen(false);
          setSelectedAccidentId(null);
        }}
        accidentId={selectedAccidentId}
      />

      <EditAccidentModal
        isOpen={isEditAccidentOpen}
        onClose={() => {
          setIsEditAccidentOpen(false);
          setSelectedAccidentId(null);
        }}
        accidentId={selectedAccidentId}
        onSuccess={() => {
          setIsEditAccidentOpen(false);
          setSelectedAccidentId(null);
          mutate(`car-accidents-${carId}`);
        }}
      />

      <DeleteAccidentModal
        isOpen={isDeleteAccidentOpen}
        onClose={() => {
          setIsDeleteAccidentOpen(false);
          setSelectedAccident(null);
        }}
        accident={selectedAccident}
        onSuccess={() => {
          setIsDeleteAccidentOpen(false);
          setSelectedAccident(null);
          mutate(`car-accidents-${carId}`);
        }}
      />

      {/* Contract Modals */}
      <AddContractModal
        isOpen={isAddContractOpen}
        onClose={() => setIsAddContractOpen(false)}
        defaultCarId={carId}
        onSuccess={() => {
          setIsAddContractOpen(false);
          mutate(`car-contracts-${carId}`);
        }}
      />
    </>
  );
}
