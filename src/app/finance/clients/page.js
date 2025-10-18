'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllParties } from '@/app/services/api/parties';
import { toast } from 'react-toastify';
import ClientFinancialModal from './components/ClientFinancialModal';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState('');

  const limit = 10;

  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: limit,
        party_type: 'client', // Filter by client type
        search: searchTerm || undefined
      };

      const response = await getAllParties(params);
      
      if (response.success) {
        setClients(response.data || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        toast.error('فشل في جلب بيانات العملاء');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('حدث خطأ أثناء جلب بيانات العملاء');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchClients();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewFinancials = (client) => {
    setSelectedClientId(client.id);
    setSelectedClientName(client.name);
    setShowFinancialModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إدارة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Section */}
          <div className="mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search" className="mb-2 block">البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="البحث بالاسم أو رقم الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                بحث
              </Button>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                    setTimeout(fetchClients, 0);
                  }}
                >
                  مسح
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 text-sm text-gray-500">
            إجمالي العملاء: {total}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="mr-3">جاري تحميل العملاء...</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">لا توجد عملاء</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الجنسية</TableHead>
                      <TableHead>الفرع</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          {client.name || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {client.phone || '-'}
                        </TableCell>
                        <TableCell>
                          {client.nationality || '-'}
                        </TableCell>
                        <TableCell>
                          {client.branch_name || '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFinancials(client)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            الفواتير والدفعات
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                      السابق
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Financial Modal */}
      <ClientFinancialModal
        isOpen={showFinancialModal}
        onClose={() => {
          setShowFinancialModal(false);
          setSelectedClientId(null);
          setSelectedClientName('');
        }}
        clientId={selectedClientId}
        clientName={selectedClientName}
      />
    </div>
  );
}