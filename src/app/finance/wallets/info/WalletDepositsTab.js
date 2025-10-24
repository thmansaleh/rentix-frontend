"use client";

import { useState } from "react";
import useSWR from "swr";
import { getDepositsByWalletId } from "@/app/services/api/walletDeposits";
import { WalletDepositModal } from "@/app/finance/wallets/WalletDepositModal";
import { EditWalletDepositModal } from "@/app/finance/wallets/EditWalletDepositModal";
import { DeleteWalletDepositModal } from "@/app/finance/wallets/DeleteWalletDepositModal";
import { printDepositReceipt } from "@/app/finance/wallets/PrintDepositReceipt";
import ExportButtons from "@/components/ui/export-buttons";
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
import { Loader2, Plus, Receipt, ArrowDownToLine, Edit, Trash2, Printer } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function WalletDepositsTab({ walletId, clientId, walletInfo, isOpen }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
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

  const handlePrintReceipt = (deposit) => {
    printDepositReceipt(deposit, walletInfo);
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

  const totalDeposits = data?.data?.reduce((sum, deposit) => sum + parseFloat(deposit.amount || 0), 0) || 0;

  // Column configuration for export
  const depositColumnConfig = {
    id: {
      en: 'Deposit ID',
      ar: 'رقم الإيداع',
      dataKey: 'id',
      formatter: (value) => `#${value}`
    },
    case_number: {
      en: 'Case Number',
      ar: 'رقم القضية',
      dataKey: 'case_number'
    },
    file_number: {
      en: 'File Number',
      ar: 'رقم الملف',
      dataKey: 'file_number'
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatAmount(value, walletInfo?.currency)
    },
    method: {
      en: 'Payment Method',
      ar: 'طريقة الدفع',
      dataKey: 'method',
      type: 'status',
      statusMap: {
        cash: { en: 'Cash', ar: 'نقداً' },
        bank_transfer: { en: 'Bank Transfer', ar: 'تحويل بنكي' },
        card: { en: 'Card', ar: 'بطاقة' },
        cheque: { en: 'Cheque', ar: 'شيك' },
        other: { en: 'Other', ar: 'أخرى' }
      }
    },
    bank_account: {
      en: 'Bank Account',
      ar: 'الحساب البنكي',
      dataKey: 'account_name',
      formatter: (value, item) => {
        if (item.bank_account_id) {
          return `${item.account_name || ''} - ${item.bank_name || ''} - ${item.account_number || ''}`;
        }
        return '-';
      }
    },
    created_by_name: {
      en: 'Created By',
      ar: 'أنشئ بواسطة',
      dataKey: 'created_by_name'
    },
    created_at: {
      en: 'Created At',
      ar: 'تاريخ الإنشاء',
      dataKey: 'created_at',
      type: 'date'
    }
  };

  return (
    <>
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

        {/* Export and Add Deposit Buttons */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <ExportButtons
            data={data?.data || []}
            columnConfig={depositColumnConfig}
            language={language}
            exportName="wallet_deposits"
            sheetName={language === 'ar' ? 'الإيداعات' : 'Deposits'}
          />
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
                          onClick={() => handlePrintReceipt(deposit)}
                          title={t('walletDeposits.printReceipt') || 'طباعة سند قبض'}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
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
