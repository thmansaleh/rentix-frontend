
import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import BookingDetailsModal from "./BookingDetailsModal";
import { useTranslations } from '@/hooks/useTranslations';
import { getBookings } from "@/app/services/api/bookings";

function BookingsTab() {
  const {t} = useTranslations();
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

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
      <TabsContent value="bookings">
        <div className="p-4 text-center">
          <p>{t('website.loading', 'جاري التحميل...')}</p>
        </div>
      </TabsContent>
    );
  }

  if (error) {
    return (
      <TabsContent value="bookings">
        <div className="p-4 text-center text-red-500">
          <p>{t('website.error', 'حدث خطأ')}: {error}</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="bookings">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{t('website.bookingsListTitle', 'قائمة الحجوزات')}</h2>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">{t('website.noBookings', 'لا توجد حجوزات')}</p>
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
                    <Button onClick={() => handleShow(b)}>{t('website.table.show', 'عرض')}</Button>
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
      </div>
    </TabsContent>
  )
}

export default BookingsTab
