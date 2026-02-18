"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, FileText, Loader2, Eye, Edit, Trash2, Printer, DollarSign, Receipt } from 'lucide-react';
import { AddContractModal } from './AddContractModal';
import { EditContractModal } from './EditContractModal';
import { ViewContractModal } from './ViewContractModal';
import { PrintContractModal } from './PrintContractModal';
import ContractInvoicesModal from './ContractInvoicesModal';
import { getContracts, deleteContract } from '../services/api/contracts';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useTranslations } from '@/hooks/useTranslations';

export default function ContractsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [selectedContractNumber, setSelectedContractNumber] = useState(null);

  // Fetch contracts data
  const { data: contractsData, error, isLoading, mutate } = useSWR('contracts', getContracts, {
    revalidateOnFocus: false,
  });

  const contracts = contractsData || [];

  // Handle view contract
  const handleViewContract = (contractId) => {
    setSelectedContractId(contractId);
    setIsViewModalOpen(true);
  };

  // Handle edit contract
  const handleEditContract = (contractId) => {
    setSelectedContractId(contractId);
    setIsEditModalOpen(true);
  };

  // Handle print contract
  const handlePrintContract = (contractId) => {
    setSelectedContractId(contractId);
    setIsPrintModalOpen(true);
  };

  // Handle view contract invoices
  const handleViewInvoices = (contract) => {
    setSelectedContractId(contract.id);
    setSelectedContractNumber(contract.contract_number);
    setIsInvoicesModalOpen(true);
  };

 

  // Handle delete contract
  const handleDeleteContract = async (contract) => {
    if (!confirm(`${t('contracts.confirmDelete')}${contract.id}?`)) {
      return;
    }

    try {
      await deleteContract(contract.id);
      toast.success(t('contracts.deleteSuccess'));
      mutate();
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error(error.response?.data?.message || t('contracts.deleteError'));
    }
  };

  // Get status badge variant and color
  const getStatusVariant = (status) => {
    const variants = {
      draft: 'outline',
      active: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    };
    return variants[status] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
      active: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || colors.draft;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  const handleSuccess = () => {
    mutate();
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('contracts.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('contracts.subtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('contracts.addNewContract')}
        </Button>
      </div>

      {/* Contracts Table */}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('contracts.loadingContracts')}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-red-500">
                    {t('contracts.errorLoading')}
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    {t('contracts.noContractsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
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
                    <TableCell> {formatCurrency(contract.daily_price)}</TableCell>
                    <TableCell className="font-medium">AED {formatCurrency(contract.total_amount)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium"> AED {formatCurrency(contract.paid_amount)}</div>
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
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContract(contract.id)}
                          title={t('contracts.viewDetails')}
                        >
                          <Eye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                        </Button>
                      
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewInvoices(contract)}
                          title={t('contracts.invoices.title')}
                        >
                          <Receipt className="w-4 h-4 text-emerald-600 hover:text-emerald-700" />
                        </Button>
                      
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintContract(contract.id)}
                          title={t('contracts.print.title')}
                        >
                          <Printer className="w-4 h-4 text-purple-600 hover:text-purple-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditContract(contract.id)}
                          title={t('contracts.edit')}
                        >
                          <Edit className="w-4 h-4 text-amber-600 hover:text-amber-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContract(contract)}
                          title={t('contracts.delete')}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Contract Modal */}
      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Contract Modal */}
      <EditContractModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContractId(null);
        }}
        onSuccess={handleSuccess}
        contractId={selectedContractId}
      />

      {/* View Contract Modal */}
      <ViewContractModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContractId(null);
        }}
        contractId={selectedContractId}
      />

      {/* Print Contract Modal */}
      <PrintContractModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedContractId(null);
        }}
        contractId={selectedContractId}
      />

      {/* Contract Invoices Modal */}
      <ContractInvoicesModal
        isOpen={isInvoicesModalOpen}
        onClose={() => {
          setIsInvoicesModalOpen(false);
          setSelectedContractId(null);
          setSelectedContractNumber(null);
        }}
        contractId={selectedContractId}
        contractNumber={selectedContractNumber}
      />

     
    </div>
  );
}