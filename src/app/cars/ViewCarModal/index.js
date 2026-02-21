"use client";

import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Car,
  FileCheck,
  Shield,
  Wrench,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ViewAccidentModal } from "../../accidents/ViewAccidentModal";
import { EditAccidentModal } from "../../accidents/EditAccidentModal";
import { DeleteAccidentModal } from "../../accidents/DeleteAccidentModal";
import { ViewContractModal } from "../../contracts/ViewContractModal";
import { EditContractModal } from "../../contracts/EditContractModal";
import { AddContractModal } from "../../contracts/AddContractModal";

import { useCarData } from "./useCarData";
import { BasicInfoTab } from "./BasicInfoTab";
import { RegistrationTab } from "./RegistrationTab";
import { InsuranceTab } from "./InsuranceTab";
import { MaintenanceTab } from "./MaintenanceTab";
import { AccidentsTab } from "./AccidentsTab";
import { ContractsTab } from "./ContractsTab";
import { FilesTab } from "./FilesTab";

export function ViewCarModal({ isOpen, onClose, carId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const {
    loading,
    carData,
    setCarData,
    photos,
    documents,
    accidents,
    reloadAccidents,
    contracts,
    reloadContracts,
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
    selectedContractId,
    setSelectedContractId,
    isViewContractOpen,
    setIsViewContractOpen,
    isEditContractOpen,
    setIsEditContractOpen,
    isAddContractOpen,
    setIsAddContractOpen,
  } = useCarData({ isOpen, carId, t });

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
          <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-7 mb-6 flex-shrink-0">
              <TabsTrigger value="basic">
                <Car className="w-4 h-4 mr-2" />
                {t("cars.tabs.basic")}
              </TabsTrigger>
              <TabsTrigger value="registration">
                <FileCheck className="w-4 h-4 mr-2" />
                {t("cars.tabs.registration")}
              </TabsTrigger>
              <TabsTrigger value="insurance">
                <Shield className="w-4 h-4 mr-2" />
                {t("cars.tabs.insurance")}
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Wrench className="w-4 h-4 mr-2" />
                {t("cars.tabs.maintenance")}
              </TabsTrigger>
              <TabsTrigger value="accidents">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {isRTL ? "الحوادث" : "Accidents"}
                {accidents.length > 0 && (
                  <Badge variant="destructive" className="ms-2 text-xs px-1.5 py-0">
                    {accidents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="files">
                <ImageIcon className="w-4 h-4 mr-2" />
                {t("cars.tabs.files")}
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <FileText className="w-4 h-4 mr-2" />
                {isRTL ? "العقود" : "Contracts"}
                {contracts.length > 0 && (
                  <Badge variant="secondary" className="ms-2 text-xs px-1.5 py-0">
                    {contracts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <BasicInfoTab carData={carData} t={t} />
            <RegistrationTab carData={carData} t={t} />
            <InsuranceTab carData={carData} t={t} />
            <MaintenanceTab carData={carData} t={t} onCarUpdated={(updated) => setCarData(updated)} />
            <AccidentsTab
              accidents={accidents}
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
            <FilesTab photos={photos} documents={documents} t={t} />
            <ContractsTab
              contracts={contracts}
              isRTL={isRTL}
              onViewContract={(id) => {
                setSelectedContractId(id);
                setIsViewContractOpen(true);
              }}
              onEditContract={(id) => {
                setSelectedContractId(id);
                setIsEditContractOpen(true);
              }}
              onAddContract={() => setIsAddContractOpen(true)}
              onReloadContracts={reloadContracts}
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
          reloadAccidents();
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
          reloadAccidents();
        }}
      />

      {/* Contract Modals */}
      <ViewContractModal
        isOpen={isViewContractOpen}
        onClose={() => {
          setIsViewContractOpen(false);
          setSelectedContractId(null);
        }}
        contractId={selectedContractId}
      />

      <EditContractModal
        isOpen={isEditContractOpen}
        onClose={() => {
          setIsEditContractOpen(false);
          setSelectedContractId(null);
        }}
        contractId={selectedContractId}
        onSuccess={() => {
          setIsEditContractOpen(false);
          setSelectedContractId(null);
          reloadContracts();
        }}
      />

      <AddContractModal
        isOpen={isAddContractOpen}
        onClose={() => setIsAddContractOpen(false)}
        defaultCarId={carId}
        onSuccess={() => {
          setIsAddContractOpen(false);
          reloadContracts();
        }}
      />
    </>
  );
}
