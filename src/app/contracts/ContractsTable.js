"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Trash2, Printer, Receipt, Loader2, FileText } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import { deleteContract } from '../services/api/contracts';
import { EditContractModal } from './EditContractModal';
import { ViewContractModal } from './ViewContractModal';
import { PrintContractModal } from './PrintContractModal';
import ContractInvoicesModal from './ContractInvoicesModal';

const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
    active: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || colors.draft;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount) return '0.00';
  return parseFloat(amount).toFixed(2);
};

export default function ContractsTable({ contracts = [], isLoading = false, error = null, onDelete, onUpdate }) {
  const { t } = useTranslations();

  const [selectedContractId, setSelectedContractId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedContractNumber, setSelectedContractNumber] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);

  const handleView = (contractId) => {
    setSelectedContractId(contractId);
    setIsViewModalOpen(true);
  };

  const handleEdit = (contract) => {
    setSelectedContractId(contract.id);
    setSelectedContract(contract);
    setIsEditModalOpen(true);
  };

  const handlePrint = (contractId) => {
    setSelectedContractId(contractId);
    setIsPrintModalOpen(true);
  };

  const handleViewInvoices = (contract) => {
    setSelectedContractId(contract.id);
    setSelectedContractNumber(contract.contract_number);
    setIsInvoicesModalOpen(true);
  };

  const handleDelete = async (contract) => {
    if (!confirm(`${t('contracts.confirmDelete')}${contract.id}?`)) return;
    try {
      await deleteContract(contract.id);
      toast.success(t('contracts.deleteSuccess'));
      onDelete?.(contract.id);
    } catch (err) {
      console.error('Error deleting contract:', err);
      toast.error(err.response?.data?.message || t('contracts.deleteError'));
    }
  };

  return (
    <>
      {/* Loading */}
      {isLoading && (
        <Card className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t('contracts.loadingContracts')}</span>
        </Card>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Card className="flex flex-col items-center justify-center py-16 gap-3">
          <FileText className="w-10 h-10 text-destructive/40" />
          <p className="text-sm text-destructive">{t('contracts.errorLoading')}</p>
        </Card>
      )}

      {/* Empty */}
      {!isLoading && !error && contracts.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 rounded-full bg-muted/50">
            <FileText className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="text-base font-semibold text-foreground">{t('contracts.noContractsFound')}</p>
        </Card>
      )}

      {/* Table — only when data exists */}
      {!isLoading && !error && contracts.length > 0 && (
        <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contracts.contractNumber')}</TableHead>
                <TableHead>{t('contracts.customerName')}</TableHead>
                <TableHead>{t('contracts.carDetails')}</TableHead>
                <TableHead>{t('contracts.startDate')}</TableHead>
                <TableHead>{t('contracts.endDate')}</TableHead>
                <TableHead>{t('contracts.pricePerDay')}</TableHead>
                <TableHead>{t('contracts.totalAmount')}</TableHead>
                <TableHead>{t('contracts.paidAmount')}</TableHead>
                <TableHead>{t('contracts.status')}</TableHead>
                <TableHead className="text-right">{t('contracts.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contract.customer_name}</div>
                      <div className="text-sm text-gray-500">{contract.customer_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contract.car_details}</div>
                      <div className="text-sm text-gray-500">{contract.plate_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(contract.start_date)}</TableCell>
                  <TableCell>{formatDate(contract.end_date)}</TableCell>
                  <TableCell>{formatCurrency(contract.daily_price)}</TableCell>
                  <TableCell className="font-medium">AED {formatCurrency(contract.total_amount)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">AED {formatCurrency(contract.paid_amount)}</div>
                      {contract.total_amount && contract.paid_amount && (
                        <div className="text-xs text-gray-500">
                          {t('contracts.remainingAmount')}: AED {formatCurrency(contract.total_amount - contract.paid_amount)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status === 'draft' && t('contracts.statusDraft')}
                      {contract.status === 'active' && t('contracts.statusActive')}
                      {contract.status === 'completed' && t('contracts.statusCompleted')}
                      {contract.status === 'cancelled' && t('contracts.statusCancelled')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                         variant="outline"
                        size="icon"
                        onClick={() => handleView(contract.id)}
                        title={t('contracts.viewDetails')}
                      >
                        <Eye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                      </Button>
                      <Button
                         variant="outline"
                        size="icon"
                        onClick={() => handleViewInvoices(contract)}
                        title={t('contracts.invoices.title')}
                      >
                        <Receipt className="w-4 h-4 text-emerald-600 hover:text-emerald-700" />
                      </Button>
                      <Button
                         variant="outline"
                        size="icon"
                        onClick={() => handlePrint(contract.id)}
                        title={t('contracts.print.title')}
                      >
                        <Printer className="w-4 h-4 text-purple-600 hover:text-purple-700" />
                      </Button>
                      <Button
                         variant="outline"
                        size="icon"
                        onClick={() => handleEdit(contract)}
                        title={t('contracts.edit')}
                      >
                        <Edit className="w-4 h-4 text-amber-600 hover:text-amber-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(contract)}
                        title={t('contracts.delete')}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </Card>
      )}

      <EditContractModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedContractId(null); setSelectedContract(null); }}
        onSuccess={(updatedFields) => {
          onUpdate?.({ ...selectedContract, ...updatedFields });
        }}
        contractId={selectedContractId}
      />

      <ViewContractModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedContractId(null); }}
        contractId={selectedContractId}
      />

      <PrintContractModal
        isOpen={isPrintModalOpen}
        onClose={() => { setIsPrintModalOpen(false); setSelectedContractId(null); }}
        contractId={selectedContractId}
      />

      <ContractInvoicesModal
        isOpen={isInvoicesModalOpen}
        onClose={() => { setIsInvoicesModalOpen(false); setSelectedContractId(null); setSelectedContractNumber(null); }}
        contractId={selectedContractId}
        contractNumber={selectedContractNumber}
      />
    </>
  );
}
