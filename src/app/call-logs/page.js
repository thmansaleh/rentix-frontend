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
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import ExportButtons from '@/components/ui/export-buttons';
import AddCallModal from './components/AddCallModal';
import EditCallModal from './components/EditCallModal';

const CallLogsPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslations();
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
        toast.success(t('callLogs.deleteCallSuccess'));
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || t('callLogs.deleteCallError'));
      }
    } catch (error) {
      toast.error(t('callLogs.deleteCallError'));
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
          {t('callLogs.callTypes.incoming')}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <PhoneCall className="w-3 h-3" />
          {t('callLogs.callTypes.outgoing')}
        </Badge>
      );
    }
  };

  // Show error state if needed
  if (isError) {
    toast.error(t('callLogs.errorLoadingCalls'));
  }

  // Column configuration for export
  const callLogsColumnConfig = {
    id: {
      ar: 'المعرف',
      en: 'ID',
      dataKey: 'id'
    },
    client_name: {
      ar: t('callLogs.table.callerName'),
      en: 'Client Name',
      dataKey: 'client_name'
    },
    phone_number: {
      ar: t('callLogs.table.phoneNumber'),
      en: 'Phone Number',
      dataKey: 'phone_number'
    },
    call_type: {
      ar: t('callLogs.table.type'),
      en: 'Call Type',
      dataKey: 'call_type',
      type: 'status',
      statusMap: {
        'incoming': { ar: t('callLogs.callTypes.incoming'), en: 'Incoming' },
        'outgoing': { ar: t('callLogs.callTypes.outgoing'), en: 'Outgoing' }
      }
    },
    date: {
      ar: t('callLogs.table.date'),
      en: 'Date',
      dataKey: 'date',
      type: 'date'
    },
    time: {
      ar: t('callLogs.table.time'),
      en: 'Time',
      dataKey: 'time'
    },
    duration: {
      ar: t('callLogs.table.duration'),
      en: 'Duration (minutes)',
      dataKey: 'duration'
    },
    notes: {
      ar: 'ملاحظات',
      en: 'Notes',
      dataKey: 'notes'
    },
    employee_name: {
      ar: 'اسم الموظف',
      en: 'Employee Name',
      dataKey: 'employee_name'
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold ">{t('callLogs.title')}</h1>
          <p className=" mt-1">{t('callLogs.description')}</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('callLogs.addNewCall')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2  w-4 h-4" />
              <Input
                placeholder={t('callLogs.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={callTypeFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('callLogs.filters.callType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('callLogs.filters.allCalls')}</SelectItem>
                <SelectItem value="incoming">{t('callLogs.filters.incomingCalls')}</SelectItem>
                <SelectItem value="outgoing">{t('callLogs.filters.outgoingCalls')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('callLogs.callsList')}</span>
            <span className="text-sm font-normal ">
              {pagination.totalRecords} {t('callLogs.totalCalls')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Buttons */}
          {callLogs && callLogs.length > 0 && !isLoading && !isError && (
            <ExportButtons
              data={callLogs}
              columnConfig={callLogsColumnConfig}
              language={language}
              exportName="call-logs"
              sheetName={language === 'ar' ? t('callLogs.title') : 'Call Logs'}
            />
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : callLogs.length === 0 ? (
            <div className="text-center py-8 ">
              {t('callLogs.noCalls')}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">{t('callLogs.table.type')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.callerName')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.phoneNumber')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.date')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.time')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.topic')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.duration')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.caseNumber')}</TableHead>
                      <TableHead className="text-right">{t('callLogs.table.actions')}</TableHead>
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
                                    <AlertDialogTitle>{t('callLogs.confirmDelete')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('callLogs.confirmDeleteMessage')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(call.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {t('common.delete')}
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
                  <div className="text-sm ">
                    {t('callLogs.pagination.showing')} {((pagination.currentPage - 1) * pagination.limit) + 1} {t('callLogs.pagination.to')}{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}{' '}
                    {t('callLogs.pagination.of')} {pagination.totalRecords} {t('callLogs.pagination.results')}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      {t('callLogs.pagination.previous')}
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
                            <span className="px-2 py-1 ">...</span>
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
                      {t('callLogs.pagination.next')}
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
        isOpen={!!editingCall}
        callId={editingCall?.id}
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