import { useState } from "react";
import useSWR from "swr";
import { Loader2, AlertCircle, FileX, Plus } from "lucide-react";
import { getContractsByCustomerId } from "../../../services/api/contracts";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/button";
import ContractsTable from "../../../contracts/ContractsTable";
import { AddContractModal } from "../../../contracts/AddContractModal";

export function ContractsTab({ customerId }) {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    customerId ? `contracts-by-customer-${customerId}` : null,
    () => getContractsByCustomerId(customerId),
    { revalidateOnFocus: false }
  );

  const contracts = data?.data || data || [];

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
        <p>{t("contracts.loadingContracts")}</p>
      </div>
    );
  }

  if (!contracts.length) {
    return (
      <>
        <div className="flex justify-end mb-4">
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            {t("contracts.addContract") || "Add Contract"}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2">
          <FileX className="w-8 h-8" />
          <p>{t("contracts.noContractsFound")}</p>
        </div>
        <AddContractModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => { setIsAddModalOpen(false); mutate(); }}
          defaultCustomerId={customerId}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          {t("contracts.addContract") || "Add Contract"}
        </Button>
      </div>
      <ContractsTable
        contracts={contracts}
        isLoading={isLoading}
        error={error}
        onMutate={mutate}
      />
      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => { setIsAddModalOpen(false); mutate(); }}
        defaultCustomerId={customerId}
      />
    </>
  );
}
