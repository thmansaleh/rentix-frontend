'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Eye, Search } from 'lucide-react';
import { getAllParties } from '@/app/services/api/parties';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { usePermission } from '@/hooks/usePermission';
import { ClientInfoModal } from '@/app/finance/clients/ClientInfoModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const FinanceClientsPage = () => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const { hasPermission: canView } = usePermission('View Client');
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const itemsPerPage = 10;
  
  // Build query parameters - only fetch client type parties
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    partyType: 'client',
    ...(searchTerm && { search: searchTerm })
  }), [currentPage, searchTerm]);
  
  // Fetch client parties data
  const { data: partiesData, error, isLoading, mutate } = useSWR(
    ['/parties/clients', queryParams],
    ([url, params]) => getAllParties(params),
    {
      refreshInterval: 300000,
      revalidateOnFocus: true
    }
  );

  // Process parties data
  const clients = useMemo(() => {
    if (!partiesData?.success || !partiesData?.data) return [];
    return partiesData.data;
  }, [partiesData]);
  
  // Get pagination info
  const pagination = useMemo(() => {
    return partiesData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  }, [partiesData]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle view wallet
  const handleViewWallet = (client) => {
    setSelectedClient(client);
    setIsWalletModalOpen(true);
  };

  // Handle close wallet modal
  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
    setSelectedClient(null);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const totalPages = pagination.totalPages;
    const current = pagination.page;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - 1 && i <= current + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={current === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === current - 2 && current > 3) ||
        (i === current + 2 && current < totalPages - 2)
      ) {
        items.push(
          <PaginationItem key={i}>
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'إدارة موكلي المالية' : 'Finance Clients Management'}
          </CardTitle>
          <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' 
              ? 'إدارة ومتابعة الحسابات المالية للموكلين'
              : 'Manage and track client financial accounts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-gray-400`} />
              <Input
                placeholder={language === 'ar' ? 'البحث بالاسم أو رقم الهاتف...' : 'Search by name or phone...'}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 text-red-600">
              {language === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                        {language === 'ar' ? 'الرقم' : 'ID'}
                      </TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      </TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                        {language === 'ar' ? 'الجنسية' : 'Nationality'}
                      </TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                            {client.id}
                          </TableCell>
                          <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                            {client.name}
                          </TableCell>
                          <TableCell className={isRTL ? 'text-right' : 'text-left'} dir="ltr">
                            {client.phone || '-'}
                          </TableCell>
                          <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                            {client.nationality || '-'}
                          </TableCell>
                          <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                            {canView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewWallet(client)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                {language === 'ar' ? 'عرض' : 'View'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                          className={`cursor-pointer ${currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {language === 'ar' 
                      ? `عرض ${clients.length} من ${pagination.total} موكل`
                      : `Showing ${clients.length} of ${pagination.total} clients`}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Client Wallet Info Modal */}
      {selectedClient && (
        <ClientInfoModal
          isOpen={isWalletModalOpen}
          onClose={handleCloseWalletModal}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default FinanceClientsPage;
