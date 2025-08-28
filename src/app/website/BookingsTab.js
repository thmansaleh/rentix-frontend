
import * as React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import BookingDetailsModal from "./BookingDetailsModal";
import { useTranslations } from '@/hooks/useTranslations';

function BookingsTab() {
  const t = useTranslations();
  // Fake data for demonstration
  const bookings = [
    {
      id: 1,
      customer: "أحمد علي",
      clientNumber: "0501234567", // UAE mobile prefix
      car: "تويوتا كورولا",
      pickupLocation: "دبي", // Changed to UAE city
      days: 3,
      startDay: "2025-07-28",
      endDay: "2025-07-31",
      // status: "مؤكد"
    },
    {
      id: 2,
      customer: "سارة محمد",
      clientNumber: "0529876543", // UAE mobile prefix
      car: "هيونداي النترا",
      pickupLocation: "أبوظبي", // Changed to UAE city
      days: 2,
      startDay: "2025-07-29",
      endDay: "2025-07-31",
      // status: "ملغي"
    },
    {
      id: 3,
      customer: "خالد يوسف",
      clientNumber: "0543332222", // UAE mobile prefix
      car: "كيا سبورتاج",
      pickupLocation: "الشارقة", // Changed to UAE city
      days: 5,
      startDay: "2025-07-30",
      endDay: "2025-08-04",
      // status: "معلق"
    },
    {
      id: 4,
      customer: "منى حسن",
      clientNumber: "0568765432", // UAE mobile prefix
      car: "هوندا سيفيك",
      pickupLocation: "العين", // Changed to UAE city
      days: 1,
      startDay: "2025-08-01",
      endDay: "2025-08-02",
      // status: "مؤكد"
    },
  ];

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const handleShow = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <TabsContent value="bookings">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{t('website.bookingsListTitle', 'قائمة الحجوزات')}</h2>
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
              {/* <TableHead className="text-right">الحالة</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} className=" ">
                <TableCell className="text-right font-semibold">{b.id}</TableCell>
                <TableCell className="text-right">{b.customer}</TableCell>
                <TableCell className="text-right">{b.clientNumber}</TableCell>
                <TableCell className="text-right">{b.car}</TableCell>
                <TableCell className="text-right">{b.pickupLocation}</TableCell>
                <TableCell className="text-right">{b.days}</TableCell>
                <TableCell className="text-right">{b.startDay}</TableCell>
                <TableCell className="text-right">{b.endDay}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handleShow(b)}>{t('website.table.show', 'عرض')}</Button>
                </TableCell>
                {/* الحالة column removed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
