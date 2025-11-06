"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2, DollarSign, FileText, User, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { getDepositsByPartyId } from "@/app/services/api/clientsDeposits";
import AddDepositModal from "./AddDepositModal";
import EditDepositModal from "./EditDepositModal";
import DeleteDepositModal from "./DeleteDepositModal";

export default function DepositsTab({ clientId, clientName }) {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const { data: deposits, error, isLoading, mutate } = useSWR(
    `/clients-deposits/${clientId}`,
    () => getDepositsByPartyId(clientId)
  );

  const handleAddSuccess = () => {
    mutate();
  };

  const handleEditClick = (deposit) => {
    setSelectedDeposit(deposit);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (deposit) => {
    setSelectedDeposit(deposit);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <div className="py-8 text-center">{t("loading")}</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{t("errorLoading")}</div>;
  }

  const depositsList = deposits?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("clientFinance.deposits")}</h3>
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("clientFinance.addDeposit")}
        </Button>
      </div>

      {depositsList.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          {t("clientFinance.noDeposits")}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t("clientFinance.amount")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t("clientFinance.description")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("clientFinance.createdBy")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("clientFinance.createdAt")}
                  </div>
                </TableHead>
                <TableHead className="text-center">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositsList.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.amount}</TableCell>
                  <TableCell>{deposit.description || "-"}</TableCell>
                  <TableCell>{deposit.created_by_name || "-"}</TableCell>
                  <TableCell>
                    {new Date(deposit.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(deposit)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(deposit)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddDepositModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        clientId={clientId}
        clientName={clientName}
        onSuccess={handleAddSuccess}
      />

      {selectedDeposit && (
        <>
          <EditDepositModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedDeposit(null);
            }}
            deposit={selectedDeposit}
            clientName={clientName}
            onSuccess={handleAddSuccess}
          />

          <DeleteDepositModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedDeposit(null);
            }}
            deposit={selectedDeposit}
            onSuccess={handleAddSuccess}
          />
        </>
      )}
    </div>
  );
}
