"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { getDepositsByWalletId } from "@/app/services/api/walletDeposits";
import { WalletDepositModal } from "@/app/finance/wallets/WalletDepositModal";
import { EditWalletDepositModal } from "@/app/finance/wallets/EditWalletDepositModal";
import { DeleteWalletDepositModal } from "@/app/finance/wallets/DeleteWalletDepositModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Receipt, ArrowDownToLine, X, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function WalletDepositsHistoryModal({ isOpen, onClose, walletId, clientId, walletInfo }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [isAddDepositOpen, setIsAddDepositOpen] = useState(false);
  const [isEditDepositOpen, setIsEditDepositOpen] = useState(false);
  const [isDeleteDepositOpen, setIsDeleteDepositOpen] = useState(false);
  const [selectedDepositId, setSelectedDepositId] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  // Fetch deposits for this wallet
  const { data, error, isLoading, mutate } = useSWR(
    isOpen && walletId ? `/wallet-deposits/wallet/${walletId}` : null,
    () => getDepositsByWalletId(walletId),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isAddDepositOpen && !isEditDepositOpen && !isDeleteDepositOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isAddDepositOpen, isEditDepositOpen, isDeleteDepositOpen, onClose]);

  const handleAddDeposit = () => {
    setIsAddDepositOpen(true);
  };

  const handleCloseAddDeposit = () => {
    setIsAddDepositOpen(false);
  };

  const handleDepositSuccess = () => {
    mutate(); // Refresh the deposits list
    setIsAddDepositOpen(false);
  };

  const handleEditClick = (depositId) => {
    setSelectedDepositId(depositId);
    setIsEditDepositOpen(true);
  };

  const handleCloseEditDeposit = () => {
    setIsEditDepositOpen(false);
    setSelectedDepositId(null);
  };

  const handleEditSuccess = () => {
    mutate(); // Refresh the deposits list
    setIsEditDepositOpen(false);
    setSelectedDepositId(null);
  };

  const handleDeleteClick = (deposit) => {
    setSelectedDeposit(deposit);
    setIsDeleteDepositOpen(true);
  };

  const handleCloseDeleteDeposit = () => {
    setIsDeleteDepositOpen(false);
    setSelectedDeposit(null);
  };

  const handleDeleteSuccess = () => {
    mutate(); // Refresh the deposits list
    setIsDeleteDepositOpen(false);
    setSelectedDeposit(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      cash: { color: "bg-green-100 text-green-800", label: t('walletDeposits.cash') },
      bank_transfer: { color: "bg-blue-100 text-blue-800", label: t('walletDeposits.bankTransfer') },
      card: { color: "bg-purple-100 text-purple-800", label: t('walletDeposits.card') },
      cheque: { color: "bg-orange-100 text-orange-800", label: t('walletDeposits.cheque') },
      other: { color: "bg-gray-100 text-gray-800", label: t('walletDeposits.other') },
    };

    const config = methodConfig[method] || methodConfig.cash;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isAddDepositOpen && !isEditDepositOpen && !isDeleteDepositOpen) {
      onClose();
    }
  };

  const totalDeposits = data?.data?.reduce((sum, deposit) => sum + parseFloat(deposit.amount || 0), 0) || 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">{t('walletDeposits.depositsHistory')}</h2>
              </div>
              {walletInfo && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <strong>{t('wallets.walletId')}:</strong> {walletInfo.id}
                  </span>
                  <span>
                    <strong>{t('wallets.clientName')}:</strong> {walletInfo.client_name}
                  </span>
                  <span>
                    <strong>{t('wallets.balance')}:</strong> {formatAmount(walletInfo.balance, walletInfo.currency)}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <ArrowDownToLine className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{t('walletDeposits.totalDeposits')}</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatAmount(totalDeposits, walletInfo?.currency)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{t('walletDeposits.numberOfDeposits')}</span>
                    </div>
                    <p className="text-2xl font-bold">{data?.data?.length || 0}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Add Deposit Button */}
              <div className="flex justify-end">
                <Button onClick={handleAddDeposit} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('walletDeposits.addDeposit')}
                </Button>
              </div>

              {/* Deposits Table */}
              <div className="rounded-md border">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2">{t('walletDeposits.loadingDeposits')}</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12 text-destructive">
                    <p>{t('walletDeposits.errorLoadingDeposits')}</p>
                  </div>
                ) : !data?.data || data.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">{t('walletDeposits.noDepositsFound')}</p>
                    <p className="text-sm">{t('walletDeposits.addFirstDeposit')}</p>
                    <Button onClick={handleAddDeposit} className="mt-4 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('walletDeposits.addDeposit')}
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('walletDeposits.depositId')}</TableHead>
                        <TableHead>{t('walletDeposits.caseNumber')}</TableHead>
                        <TableHead>{t('walletDeposits.fileNumber')}</TableHead>
                        <TableHead>{t('walletDeposits.amount')}</TableHead>
                        <TableHead>{t('walletDeposits.paymentMethod')}</TableHead>
                        <TableHead>{t('walletDeposits.bankAccount')}</TableHead>
                        <TableHead>{t('walletDeposits.createdBy')}</TableHead>
                        <TableHead>{t('walletDeposits.createdAt')}</TableHead>
                        <TableHead>{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">#{deposit.id}</TableCell>
                          <TableCell className="font-medium">
                            {deposit.case_number || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {deposit.file_number || "-"}
                          </TableCell>
                          <TableCell className="font-mono font-semibold text-green-600">
                            {formatAmount(deposit.amount, walletInfo?.currency)}
                          </TableCell>
                          <TableCell>
                            {getMethodBadge(deposit.method)}
                          </TableCell>
                          <TableCell>
                            {deposit.bank_account_id ? (
                              <div className="text-xs">
                                <div className="font-medium">{deposit.account_name}</div>
                                <div className="text-muted-foreground">
                                  {deposit.bank_name} - {deposit.account_number}
                                </div>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{deposit.created_by_name || "-"}</TableCell>
                          <TableCell className="text-xs">
                            {formatDate(deposit.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(deposit.id)}
                                title={t('common.edit')}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(deposit)}
                                title={t('common.delete')}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Results info */}
              {data?.data && data.data.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                  {t('walletDeposits.showingDeposits', { count: data.data.length })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Deposit Modal */}
      <WalletDepositModal
        isOpen={isAddDepositOpen}
        onClose={handleCloseAddDeposit}
        onSuccess={handleDepositSuccess}
        walletId={walletId}
        clientId={clientId}
      />

      {/* Edit Deposit Modal */}
      <EditWalletDepositModal
        isOpen={isEditDepositOpen}
        onClose={handleCloseEditDeposit}
        onSuccess={handleEditSuccess}
        depositId={selectedDepositId}
      />

      {/* Delete Deposit Modal */}
      <DeleteWalletDepositModal
        isOpen={isDeleteDepositOpen}
        onClose={handleCloseDeleteDeposit}
        onSuccess={handleDeleteSuccess}
        deposit={selectedDeposit}
      />
    </>
  );
}
