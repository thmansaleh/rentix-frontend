'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useCallLogs } from '@/hooks/useCallLogs';
import { deleteCallLog } from '@/app/services/api/callLogs';
import AddCallModal from './components/AddCallModal';
import EditCallModal from './components/EditCallModal';

const CallLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState(null);

  // Prepare params for SWR
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(callTypeFilter && callTypeFilter !== 'all' && { callType: callTypeFilter })
  }), [currentPage, searchTerm, callTypeFilter]);

  // Use SWR for data fetching
  const { callLogs, pagination, isLoading, isError, mutate } = useCallLogs(queryParams);

  // Delete call log
  const handleDelete = async (id) => {
    try {
      const result = await deleteCallLog(id);
      if (result.success) {
        toast.success('تم حذف المكالمة بنجاح');
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || 'فشل في حذف المكالمة');
      }
    } catch (error) {

      toast.error('فشل في حذف المكالمة');
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setCallTypeFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    // Check if date and time are valid
    if (!date || !time) {
      return {
        date: '-',
        time: '-'
      };
    }
    
    // Extract just the date part if it's an ISO string (e.g., "2025-10-13T20:00:00.000Z" -> "2025-10-13")
    const datePart = date.split('T')[0];
    const dateObj = new Date(`${datePart}T${time}`);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return {
        date: '-',
        time: '-'
      };
    }
    
    return {
      date: dateObj.toLocaleDateString('ar-AE'),
      time: dateObj.toLocaleTimeString('ar-AE', {
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };

  // Get call type badge
  const getCallTypeBadge = (type) => {
    if (type === 'incoming') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          واردة
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <PhoneCall className="w-3 h-3" />
          صادرة
        </Badge>
      );
    }
  };

  // Show error state if needed
  if (isError) {
    toast.error('فشل في جلب سجل المكالمات');
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">سجل المكالمات</h1>
          <p className="text-gray-600 mt-1">إدارة وتتبع جميع المكالمات الواردة والصادرة</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مكالمة جديدة
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المكالمات..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={callTypeFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع المكالمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المكالمات</SelectItem>
                <SelectItem value="incoming">المكالمات الواردة</SelectItem>
                <SelectItem value="outgoing">المكالمات الصادرة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>قائمة المكالمات</span>
            <span className="text-sm font-normal text-gray-500">
              {pagination.totalRecords} مكالمة إجمالية
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : callLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مكالمات مسجلة
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">اسم المتصل</TableHead>
                      <TableHead className="text-right">رقم الهاتف</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الوقت</TableHead>
                      <TableHead className="text-right">الموضوع</TableHead>
                      <TableHead className="text-right">المدة (دقيقة)</TableHead>
                      <TableHead className="text-right">رقم القضية</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callLogs.map((call) => {
                      const { date, time } = formatDateTime(call.call_date, call.call_time);
                      return (
                        <TableRow key={call.id}>
                          <TableCell>{getCallTypeBadge(call.call_type)}</TableCell>
                          <TableCell className="font-medium">{call.caller_name}</TableCell>
                          <TableCell className="font-mono">{call.phone_number}</TableCell>
                          <TableCell>{date}</TableCell>
                          <TableCell>{time}</TableCell>
                          <TableCell className="max-w-48 truncate">
                            {call.topic || '-'}
                          </TableCell>
                          <TableCell>{call.duration_minutes}</TableCell>
                          <TableCell className="font-mono">
                            {call.file_case_number || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingCall(call)}
                                className="p-1 h-8 w-8"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذه المكالمة؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(call.id)}
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-700">
                    عرض {((pagination.currentPage - 1) * pagination.limit) + 1} إلى{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}{' '}
                    من {pagination.totalRecords} نتيجة
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      السابق
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-gray-500">...</span>
                          )}
                          <Button
                            size="sm"
                            variant={pagination.currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddCallModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          mutate(); // Refresh data
        }}
      />

      <EditCallModal 
        call={editingCall}
        onClose={() => setEditingCall(null)}
        onSuccess={() => {
          setEditingCall(null);
          mutate(); // Refresh data
        }}
      />
    </div>
  );
};

export default CallLogsPage;