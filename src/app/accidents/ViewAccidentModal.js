"use client";

import { useEffect, useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Image as ImageIcon, FileText, Calendar, MapPin, Shield, FileCheck } from "lucide-react";
import { getAccident } from "../services/api/accidents";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from 'date-fns';

export function ViewAccidentModal({ isOpen, onClose, accidentId }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && accidentId) {
      loadAccident();
    }
  }, [isOpen, accidentId]);

  const loadAccident = async () => {
    try {
      setLoading(true);
      const response = await getAccident(accidentId);
      setAccident(response.data);
    } catch (error) {
      console.error('Error loading accident:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLiabilityVariant = (type) => {
    const variants = {
      CUSTOMER: 'destructive',
      THIRD_PARTY: 'default',
      UNKNOWN: 'secondary',
    };
    return variants[type] || 'secondary';
  };

  const getLiabilityLabel = (type) => {
    const labels = {
      CUSTOMER: isRTL ? 'العميل' : 'Customer',
      THIRD_PARTY: isRTL ? 'طرف ثالث' : 'Third Party',
      UNKNOWN: isRTL ? 'غير معروف' : 'Unknown',
    };
    return labels[type] || type;
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    try {
      return format(new Date(datetime), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return datetime;
    }
  };

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>{isRTL ? 'تفاصيل الحادث' : 'Accident Details'}</span>
        </div>
      }
      size="lg"
    >
      <CustomModalBody>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : accident ? (
          <div className="space-y-6">
            {/* Accident Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{isRTL ? 'تاريخ ووقت الحادث' : 'Date & Time'}</span>
                </div>
                <p className="font-medium">{formatDateTime(accident.accident_datetime)}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{isRTL ? 'نوع المسؤولية' : 'Liability Type'}</span>
                </div>
                <Badge variant={getLiabilityVariant(accident.liability_type)}>
                  {getLiabilityLabel(accident.liability_type)}
                </Badge>
              </div>
            </div>

            {/* Car & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{isRTL ? 'معلومات السيارة' : 'Car Information'}</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'رقم اللوحة' : 'Plate Number'}:</span>
                    <p className="font-medium">{accident.car_plate_number || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'الماركة والموديل' : 'Brand & Model'}:</span>
                    <p className="font-medium">{accident.car_brand} {accident.car_model}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{isRTL ? 'معلومات العميل' : 'Customer Information'}</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'الاسم' : 'Name'}:</span>
                    <p className="font-medium">{accident.customer_name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'الهاتف' : 'Phone'}:</span>
                    <p className="font-medium">{accident.customer_phone}</p>
                  </div>
                  {accident.customer_email && (
                    <div>
                      <span className="text-sm text-gray-500">{isRTL ? 'البريد الإلكتروني' : 'Email'}:</span>
                      <p className="font-medium">{accident.customer_email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">{isRTL ? 'معلومات العقد' : 'Contract Information'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-sm text-gray-500">{isRTL ? 'رقم العقد' : 'Contract Number'}:</span>
                  <p className="font-medium">{accident.contract_number || '-'}</p>
                </div>
                {accident.contract_start_date && (
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'تاريخ البداية' : 'Start Date'}:</span>
                    <p className="font-medium">{format(new Date(accident.contract_start_date), 'dd/MM/yyyy')}</p>
                  </div>
                )}
                {accident.contract_end_date && (
                  <div>
                    <span className="text-sm text-gray-500">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}:</span>
                    <p className="font-medium">{format(new Date(accident.contract_end_date), 'dd/MM/yyyy')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {accident.location && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{isRTL ? 'الموقع' : 'Location'}</span>
                </div>
                <p className="font-medium">{accident.location}</p>
              </div>
            )}

            {/* Police Report Details */}
            {(accident.police_report_number || accident.police_station) && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5" />
                  <h3 className="font-semibold">{isRTL ? 'تفاصيل تقرير الشرطة' : 'Police Report Details'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accident.police_report_number && (
                    <div>
                      <span className="text-sm text-gray-500">{isRTL ? 'رقم التقرير' : 'Report Number'}:</span>
                      <p className="font-medium">{accident.police_report_number}</p>
                    </div>
                  )}
                  {accident.police_station && (
                    <div>
                      <span className="text-sm text-gray-500">{isRTL ? 'مركز الشرطة' : 'Police Station'}:</span>
                      <p className="font-medium">{accident.police_station}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {accident.description && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{isRTL ? 'الوصف' : 'Description'}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{accident.description}</p>
              </div>
            )}

            {/* Media */}
            {accident.media && accident.media.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{isRTL ? 'الملفات المرفقة' : 'Attached Media'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {accident.media.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={media.file_url}
                          alt={media.file_name}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <a
                        href={media.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-sm"
                      >
                        {isRTL ? 'عرض' : 'View'}
                      </a>
                      <p className="text-xs text-gray-500 mt-1 truncate" title={media.file_name}>
                        {media.file_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {isRTL ? 'لم يتم العثور على الحادث' : 'Accident not found'}
          </div>
        )}
      </CustomModalBody>

      <CustomModalFooter>
        <Button onClick={onClose}>
          {isRTL ? 'إغلاق' : 'Close'}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
