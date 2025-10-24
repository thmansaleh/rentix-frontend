"use client";

import { useState } from "react";
import useSWR from "swr";
import { getWallets, deleteWallet } from "../../services/api/wallets";
import { usePermission } from "@/hooks/useAuth";

import { WalletsFilterNew } from "./WalletsFilterNew";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AddWalletModal } from "@/app/finance/wallets/AddWalletModal";
import { WalletDepositModal } from "@/app/finance/wallets/WalletDepositModal";
import { WalletInfoModal } from "@/app/finance/wallets/info/WalletInfoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Wallet, DollarSign, Pencil, Trash2, ArrowDownToLine, Eye, Wallet2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function WalletsPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const { hasPermission: canAdd } = usePermission('Add Payment');
  const { hasPermission: canEdit } = usePermission('Edit Wallet');
  const { hasPermission: canDelete } = usePermission('Delete Wallet');
  const { hasPermission: canView } = usePermission('View Wallet');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositWalletId, setDepositWalletId] = useState(null);
  const [depositClientId, setDepositClientId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyWallet, setHistoryWallet] = useState(null);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // SWR fetcher function with params
  const { data, error, isLoading, mutate } = useSWR(
    ['/wallets', currentPage, searchQuery, selectedStatus],
    () => getWallets({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
    }),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSuccess = () => {
    // Refresh the data after successful add
    mutate();
  };

  const handleEdit = (wallet) => {
    setSelectedWallet(wallet);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedWallet(null);
  };

  const handleEditSuccess = () => {
    mutate();
    setIsEditModalOpen(false);
    setSelectedWallet(null);
  };

  const handleDeleteClick = (wallet) => {
    setWalletToDelete(wallet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!walletToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteWallet(walletToDelete.id);
      toast.success(t('wallets.walletDeletedSuccessfully'));
      mutate(); // Refresh the list
      setDeleteDialogOpen(false);
      setWalletToDelete(null);
    } catch (error) {
      console.error('Error deleting wallet:', error);
      toast.error(t('wallets.errorDeletingWallet'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setWalletToDelete(null);
  };

  const handleDepositClick = (wallet) => {
    setDepositWalletId(wallet.id);
    setDepositClientId(wallet.client_id);
    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
    setDepositWalletId(null);
    setDepositClientId(null);
  };

  const handleDepositSuccess = () => {
    mutate();
    setIsDepositModalOpen(false);
    setDepositWalletId(null);
    setDepositClientId(null);
  };

  const handleViewHistory = (wallet) => {
    setHistoryWallet(wallet);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setHistoryWallet(null);
    mutate(); // Refresh wallet data when closing history modal
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBalance = (balance, currency) => {
    const amount = parseFloat(balance || 0);
    return `${amount.toLocaleString()} ${currency}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: t('wallets.active') },
      suspended: { color: "bg-yellow-100 text-yellow-800", label: t('wallets.suspended') },
      closed: { color: "bg-red-100 text-red-800", label: t('wallets.closed') },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">
                {t('wallets.title')}
              </CardTitle>
            </div>
            {canAdd && (
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('wallets.addNewWallet')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <WalletsFilterNew
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Stats Cards */}
          {data?.stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{t('wallets.totalWallets')}</span>
                  </div>
                  <p className="text-2xl font-bold">{data.stats.total_wallets}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{t('wallets.activeWallets')}</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {data.stats.active_wallets}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{t('wallets.totalBalanceAED')}</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {parseFloat(data.stats.total_balance_aed || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
              {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">{t('wallets.loadingWallets')}</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p>{t('wallets.errorLoadingWallets')}</p>
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Wallet className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('wallets.noWalletsFound')}</p>
                <p className="text-sm">{t('wallets.createFirstWallet')}</p>
                {canAdd && (
                  <Button onClick={handleAddNew} className="mt-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('wallets.addFirstWallet')}
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('wallets.walletId')}</TableHead>
                    <TableHead>{t('wallets.clientId')}</TableHead>
                    {/* <TableHead>{t('wallets.clientName')}</TableHead> */}
                    <TableHead>{t('wallets.balance')}</TableHead>
                    <TableHead>{t('wallets.currency')}</TableHead>
                    <TableHead>{t('wallets.status')}</TableHead>
                    <TableHead>{t('wallets.createdDate')}</TableHead>
                    <TableHead>{t('wallets.createdByName')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.id}</TableCell>
                      {/* <TableCell className="font-medium">{wallet.client_id}</TableCell> */}
                      <TableCell>
                        {wallet.client_name || "-"}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatBalance(wallet.balance, wallet.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{wallet.currency}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(wallet.status)}
                      </TableCell>
                      <TableCell>{formatDate(wallet.created_at)}</TableCell>
                      <TableCell>{wallet.created_by_name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {canView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewHistory(wallet)}
                              title={t('walletDeposits.viewHistory')}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {canAdd && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDepositClick(wallet)}
                              title={t('wallets.deposit')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Wallet2 className="h-4 w-4" />
                            </Button>
                          )}
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(wallet)}
                              title={t('common.edit')}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(wallet)}
                              className="text-destructive hover:text-destructive"
                              title={t('common.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  />
                  
                  {[...Array(data.pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    const isFirstPage = pageNumber === 1;
                    const isLastPage = pageNumber === data.pagination.totalPages;
                    const isWithinRange = Math.abs(pageNumber - currentPage) <= 1;

                    if (!isWithinRange && !isFirstPage && !isLastPage) {
                      if (pageNumber === 2 || pageNumber === data.pagination.totalPages - 1) {
                        return <PaginationEllipsis key={`ellipsis-${pageNumber}`} />;
                      }
                      return null;
                    }

                    return (
                      <PaginationLink
                        key={pageNumber}
                        isActive={isCurrentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    );
                  })}

                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results info */}
          {data?.pagination && (
            <div className="text-sm text-muted-foreground text-center mt-2">
              {t('wallets.showingResults', { 
                start: ((currentPage - 1) * data.pagination.limit) + 1,
                end: Math.min(currentPage * data.pagination.limit, data.pagination.total),
                total: data.pagination.total 
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Wallet Modal */}
      <AddWalletModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Wallet Modal */}
      <AddWalletModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        wallet={selectedWallet}
        isEdit={true}
      />

      {/* Deposit Modal */}
      <WalletDepositModal 
        isOpen={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        onSuccess={handleDepositSuccess}
        walletId={depositWalletId}
        clientId={depositClientId}
      />

      {/* Deposits History Modal */}
      <WalletInfoModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        walletId={historyWallet?.id}
        clientId={historyWallet?.client_id}
        walletInfo={historyWallet}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('wallets.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('wallets.confirmDeleteMessage')}
              <br />
              <br />
              <span className="text-destructive font-medium">
                {t('wallets.deleteWarning')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default WalletsPage;