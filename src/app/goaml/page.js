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
import ExportButtons from '@/components/ui/export-buttons';
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
import { useTranslations } from '@/hooks/useTranslations';
import AddGoamlModal from './components/AddGoamlModal';
import EditGoamlModal from './components/EditGoamlModal';

const GoAmlPage = () => {
  const { t } = useTranslations();
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

  const exportColumnConfig = {
    name: { ar: t('goaml.export.name'), en: 'Name', dataKey: 'name' },
    phone: { ar: t('goaml.export.phone'), en: 'Phone', dataKey: 'phone' },
    type: { ar: t('goaml.export.type'), en: 'Type', dataKey: 'type' },
    status: {
      ar: t('goaml.export.status'),
      en: 'Status',
      dataKey: 'status',
      type: 'status',
      statusMap: {
        compliant: { ar: t('goaml.status.compliant'), en: 'Compliant' },
        safe: { ar: t('goaml.status.safe'), en: 'Safe' },
        under_review: { ar: t('goaml.status.under_review'), en: 'Under Review' }
      }
    },
    note: { ar: t('goaml.export.note'), en: 'Note', dataKey: 'note' },
    created_at: { ar: t('goaml.export.createdAt'), en: 'Created At', dataKey: 'created_at', type: 'date' },
    created_by_name: { ar: t('goaml.export.createdBy'), en: 'Created By', dataKey: 'created_by_name' }
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      const result = await deleteGoamlRecord(id);
      if (result.success) {
        toast.success(t('goaml.deleteRecordSuccess'));
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || t('goaml.deleteRecordError'));
      }
    } catch (error) {
      toast.error(t('goaml.deleteRecordError'));
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      compliant: {
        label: t('goaml.status.compliant'),
        variant: 'default',
        className: 'bg-green-500 hover:bg-green-600 text-white'
      },
      safe: {
        label: t('goaml.status.safe'),
        variant: 'secondary',
        className: 'bg-blue-500 hover:bg-blue-600 text-white'
      },
      under_review: {
        label: t('goaml.status.under_review'),
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

  // Show error state if needed
  if (isError) {
    toast.error(t('goaml.errorLoadingRecords'));
  }

  return (
    <div className="container mx-auto p-6 space-y-6" >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br  flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 " />
            </div>
            <div>
              <h1 className="text-2xl font-bold ">{t('goaml.title')}</h1>
              <p className=" mt-1">{t('goaml.description')}</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('goaml.addNewRecord')}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('goaml.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center justify-between w-full md:w-auto">
            <span>{t('goaml.recordsList')}</span>
            <span className="text-sm font-normal ">
              {filteredRecords.length} {t('goaml.recordsCount')}
            </span>
          </CardTitle>
          {!isLoading && filteredRecords.length > 0 && (
            <ExportButtons
              data={filteredRecords}
              columnConfig={exportColumnConfig}
              exportName="goaml_records"
              sheetName="GoAML"
              language="ar"
            />
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 "></div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8 ">
              {searchTerm ? t('goaml.noSearchResults') : t('goaml.noRecords')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{t('goaml.table.name')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.phone')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.type')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.status')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.note')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.createdAt')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.createdBy')}</TableHead>
                    <TableHead className="text-right">{t('goaml.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium max-w-32 truncate">{record.name}</TableCell>
                      <TableCell className="font-mono">{record.phone || '-'}</TableCell>
                      <TableCell className="max-w-24 truncate">{record.type || '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="max-w-48 truncate">
                        {record.note || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(record.created_at)}</TableCell>
                      <TableCell className="max-w-28 truncate">{record.created_by_name || '-'}</TableCell>
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
                            <AlertDialogContent >
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('goaml.confirmDelete')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('goaml.confirmDeleteMessage')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(record.id)}
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
