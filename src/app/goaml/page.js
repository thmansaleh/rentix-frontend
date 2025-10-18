'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import { useGoamlRecords } from '@/hooks/useGoaml';
import { deleteGoamlRecord } from '@/app/services/api/goaml';
import AddGoamlModal from './components/AddGoamlModal';
import EditGoamlModal from './components/EditGoamlModal';

const GoAmlPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Use SWR for data fetching
  const { records, count, isLoading, isError, mutate } = useGoamlRecords();

  // Filter records based on search
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      record.name?.toLowerCase().includes(searchLower) ||
      record.phone?.toLowerCase().includes(searchLower) ||
      record.note?.toLowerCase().includes(searchLower)
    );
  });

  // Delete record
  const handleDelete = async (id) => {
    try {
      const result = await deleteGoamlRecord(id);
      if (result.success) {
        toast.success('تم حذف السجل بنجاح');
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || 'فشل في حذف السجل');
      }
    } catch (error) {
      console.error('Error deleting GoAML record:', error);
      toast.error('فشل في حذف السجل');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      compliant: {
        label: 'مطابق',
        variant: 'default',
        className: 'bg-green-500 hover:bg-green-600 text-white'
      },
      safe: {
        label: 'آمن',
        variant: 'secondary',
        className: 'bg-blue-500 hover:bg-blue-600 text-white'
      },
      under_review: {
        label: 'قيد المراجعة',
        variant: 'outline',
        className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
      }
    };

    const config = statusConfig[status] || statusConfig.under_review;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-AE');
    } catch (error) {
      return '-';
    }
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  // Show error state if needed
  if (isError) {
    toast.error('فشل في جلب سجلات GoAML');
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مكافحة غسل الأموال</h1>
              <p className="text-gray-600 mt-1">إدارة وتتبع سجلات GoAML</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة سجل جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في السجلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>قائمة السجلات</span>
            <span className="text-sm font-normal text-gray-500">
              {filteredRecords.length} سجل
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد سجلات مسجلة'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">ملاحظة</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-right">أُنشئ بواسطة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell className="font-mono">{record.phone || '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatAmount(record.amount)}
                      </TableCell>
                      <TableCell className="max-w-48 truncate">
                        {record.note || '-'}
                      </TableCell>
                      <TableCell>{formatDate(record.created_at)}</TableCell>
                      <TableCell>{record.created_by_name || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingRecord(record)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(record.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddGoamlModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={mutate}
      />
      
      {editingRecord && (
        <EditGoamlModal
          record={editingRecord}
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSuccess={mutate}
        />
      )}
    </div>
  );
};

export default GoAmlPage;
