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
import { Plus, AlertTriangle, Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import { AddAccidentModal } from './AddAccidentModal';
import { ViewAccidentModal } from './ViewAccidentModal';
import { EditAccidentModal } from './EditAccidentModal';
import { DeleteAccidentModal } from './DeleteAccidentModal';
import { getAccidents } from '../services/api/accidents';
import useSWR from 'swr';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

export default function AccidentsPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);

  // Fetch accidents data
  const { data: accidentsData, error, isLoading, mutate } = useSWR('accidents',() => getAccidents(), {
    revalidateOnFocus: false,
  });

  const accidents = accidentsData?.data || [];

  // Handle view accident
  const handleViewAccident = (accidentId) => {
    setSelectedAccidentId(accidentId);
    setIsViewModalOpen(true);
  };

  // Handle edit accident
  const handleEditAccident = (accidentId) => {
    setSelectedAccidentId(accidentId);
    setIsEditModalOpen(true);
  };

  // Handle delete accident
  const handleDeleteAccident = (accident) => {
    setSelectedAccident(accident);
    setIsDeleteModalOpen(true);
  };

  // Get liability type badge variant
  const getLiabilityVariant = (type) => {
    const variants = {
      CUSTOMER: 'destructive',
      THIRD_PARTY: 'default',
      UNKNOWN: 'secondary',
    };
    return variants[type] || 'secondary';
  };

  // Get liability type label
  const getLiabilityLabel = (type) => {
    const labels = {
      CUSTOMER: isRTL ? 'العميل' : 'Customer',
      THIRD_PARTY: isRTL ? 'طرف ثالث' : 'Third Party',
      UNKNOWN: isRTL ? 'غير معروف' : 'Unknown',
    };
    return labels[type] || type;
  };

  // Format datetime
  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    try {
      return format(new Date(datetime), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return datetime;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isRTL ? 'الحوادث' : 'Accidents'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? 'إدارة حوادث السيارات' : 'Manage car accidents'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isRTL ? 'إضافة حادث' : 'Add Accident'}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              {isRTL ? 'فشل تحميل البيانات' : 'Failed to load data'}
            </p>
          </div>
        ) : accidents.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isRTL ? 'لا توجد حوادث' : 'No accidents found'}
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'إضافة أول حادث' : 'Add First Accident'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isRTL ? 'التاريخ والوقت' : 'Date & Time'}</TableHead>
                  <TableHead>{isRTL ? 'السيارة' : 'Car'}</TableHead>
                  <TableHead>{isRTL ? 'العميل' : 'Customer'}</TableHead>
                  <TableHead>{isRTL ? 'رقم العقد' : 'Contract'}</TableHead>
                  <TableHead>{isRTL ? 'الموقع' : 'Location'}</TableHead>
                  <TableHead>{isRTL ? 'المسؤولية' : 'Liability'}</TableHead>
                  <TableHead>{isRTL ? 'رقم التقرير' : 'Report #'}</TableHead>
                  <TableHead className={isRTL ? "text-left" : "text-right"}>
                    {isRTL ? 'الإجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accidents.map((accident) => (
                  <TableRow key={accident.id}>
                    <TableCell className="font-medium">
                      {formatDateTime(accident.accident_datetime)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{accident.car_plate_number || '-'}</div>
                        <div className="text-gray-500">
                          {accident.car_brand} {accident.car_model}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{accident.customer_name || '-'}</div>
                        <div className="text-gray-500">{accident.customer_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{accident.contract_number || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm max-w-[200px] truncate" title={accident.location}>
                        {accident.location || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLiabilityVariant(accident.liability_type)}>
                        {getLiabilityLabel(accident.liability_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{accident.police_report_number || '-'}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewAccident(accident.id)}
                          title={isRTL ? 'عرض' : 'View'}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAccident(accident.id)}
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAccident(accident)}
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddAccidentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          mutate();
          setIsAddModalOpen(false);
        }}
      />
      
      <ViewAccidentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAccidentId(null);
        }}
        accidentId={selectedAccidentId}
      />
      
      <EditAccidentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccidentId(null);
        }}
        accidentId={selectedAccidentId}
        onSuccess={() => {
          mutate();
          setIsEditModalOpen(false);
          setSelectedAccidentId(null);
        }}
      />
      
      <DeleteAccidentModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAccident(null);
        }}
        accident={selectedAccident}
        onSuccess={() => {
          mutate();
          setIsDeleteModalOpen(false);
          setSelectedAccident(null);
        }}
      />
    </div>
  );
}