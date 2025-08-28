
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from '@/hooks/useTranslations';

function BookingDetailsModal({ open, onClose, booking }) {
  const t = useTranslations();
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center light:bg-black/50  dark:bg-white/50 backdrop-blur-sm">
      <div className=" rounded-lg bg-white dark:bg-black shadow-lg p-6 min-w-[320px]">
        <h3 className="text-lg font-bold mb-4">{t('website.detailsModal.title', 'تفاصيل الحجز')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2"><b>{t('website.detailsModal.customer', 'العميل')}:</b> {booking.customer}</div>
          <div className="mb-2"><b>{t('website.detailsModal.clientNumber', 'رقم العميل')}:</b> {booking.clientNumber}</div>
          <div className="mb-2"><b>{t('website.detailsModal.car', 'السيارة')}:</b> {booking.car}</div>
          <div className="mb-2"><b>{t('website.detailsModal.pickupLocation', 'موقع الاستلام')}:</b> {booking.pickupLocation}</div>
          <div className="mb-2"><b>{t('website.detailsModal.days', 'عدد الأيام')}:</b> {booking.days}</div>
          <div className="mb-2"><b>{t('website.detailsModal.startDay', 'تاريخ البدء')}:</b> {booking.startDay}</div>
          <div className="mb-4"><b>{t('website.detailsModal.endDay', 'تاريخ الانتهاء')}:</b> {booking.endDay}</div>
        </div>
        <Button onClick={onClose} className="w-full">{t('website.detailsModal.close', 'إغلاق')}</Button>
      </div>
    </div>
  );
}

export default BookingDetailsModal;