
import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import BookingDetailsModal from "./BookingDetailsModal";
import { useTranslations } from '@/hooks/useTranslations';
import { getBookings, deleteBooking } from "@/app/services/api/bookings";
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
import { Trash2, CalendarX } from "lucide-react";

function BookingsTab() {
  const {t} = useTranslations();
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bookingToDelete, setBookingToDelete] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  // Fetch bookings from API
  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        
        if (data.success) {
          setBookings(data.data);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleShow = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    setDeleting(true);
    try {
      await deleteBooking(bookingToDelete.id);
      setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Calculate days between dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div>
        <div className="p-4 text-center">
          <p>{t('website.loading', 'جاري التحميل...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="p-4 text-center text-red-500">
          <p>{t('website.error', 'حدث خطأ')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{t('website.bookingsListTitle', 'قائمة الحجوزات')}</h2>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <CalendarX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t('website.noBookings', 'لا توجد حجوزات')}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              لم يتم تسجيل أي حجوزات حتى الآن. ستظهر هنا عند وصول طلبات الحجز من الموقع.
            </p>
          </div>
        ) : (
          <Table className="w-full border rounded-lg ">
            <TableHeader>
              <TableRow className="">
                <TableHead className="text-right">{t('website.table.id', '#')}</TableHead>
                <TableHead className="text-right">{t('website.table.customer', 'العميل')}</TableHead>
                <TableHead className="text-right">{t('website.table.clientNumber', 'رقم العميل')}</TableHead>
                <TableHead className="text-right">{t('website.table.car', 'السيارة')}</TableHead>
                <TableHead className="text-right">{t('website.table.pickupLocation', 'موقع الاستلام')}</TableHead>
                <TableHead className="text-right">{t('website.table.days', 'عدد الأيام')}</TableHead>
                <TableHead className="text-right">{t('website.table.startDay', 'تاريخ البدء')}</TableHead>
                <TableHead className="text-right">{t('website.table.endDay', 'تاريخ الانتهاء')}</TableHead>
                <TableHead className="text-right">{t('website.table.actions', 'إجراءات')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id} className=" ">
                  <TableCell className="text-right font-semibold">{b.id}</TableCell>
                  <TableCell className="text-right">{b.customer_name}</TableCell>
                  <TableCell className="text-right">{b.phone}</TableCell>
                  <TableCell className="text-right">{b.car_name || `${b.brand || ''} ${b.model || ''}`.trim() || 'N/A'}</TableCell>
                  <TableCell className="text-right">{b.pickup_from || 'N/A'}</TableCell>
                  <TableCell className="text-right">{calculateDays(b.start_date, b.end_date)}</TableCell>
                  <TableCell className="text-right">{new Date(b.start_date).toLocaleDateString('ar-AE')}</TableCell>
                  <TableCell className="text-right">{new Date(b.end_date).toLocaleDateString('ar-AE')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button onClick={() => handleShow(b)}>{t('website.table.show', 'عرض')}</Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(b)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <BookingDetailsModal
          open={modalOpen}
          onClose={handleClose}
          booking={selectedBooking}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف حجز{' '}
                <span className="font-semibold">{bookingToDelete?.customer_name}</span>؟
                لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? 'جاري الحذف...' : 'حذف'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default BookingsTab
