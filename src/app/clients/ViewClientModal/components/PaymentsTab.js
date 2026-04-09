import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { Loader2, AlertCircle, FileX } from "lucide-react";
import { getPaymentsByCustomerId, deletePayment } from "../../../services/api/payments";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import PaymentHistory from "../../../finance/payments/PaymentHistory";
import ViewPaymentModal from "../../../finance/payments/ViewPaymentModal";
import PaymentDialog from "../../../finance/payments/PaymentDialog";
import DeletePaymentDialog from "../../../finance/payments/DeletePaymentDialog";

export function PaymentsTab({ customerId }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const language = isRTL ? "ar" : "en";

  // View
  const [viewPaymentModalOpen, setViewPaymentModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  // Edit
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState(null);

  const { data, isLoading, error, mutate } = useSWR(
    customerId ? `payments-by-customer-${customerId}` : null,
    () => getPaymentsByCustomerId(customerId),
    { revalidateOnFocus: false }
  );

  const payments = data?.data || [];

  const handleView = (payment) => {
    setViewingPayment(payment);
    setViewPaymentModalOpen(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSaved = () => {
    setPaymentDialogOpen(false);
    setEditingPayment(null);
    mutate();
  };

  const handleDeleteClick = (payment) => {
    setDeletingPayment(payment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPayment) return;
    try {
      const res = await deletePayment(deletingPayment.id);
      if (res.success) {
        toast.success(
          language === "ar" ? "تم حذف الدفعة بنجاح" : "Payment deleted successfully"
        );
        setDeleteDialogOpen(false);
        setDeletingPayment(null);
        mutate();
      } else {
        toast.error(
          res.message || (language === "ar" ? "خطأ في حذف الدفعة" : "Error deleting payment")
        );
      }
    } catch {
      toast.error(
        language === "ar" ? "خطأ في حذف الدفعة" : "Error deleting payment"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500 gap-2">
        <AlertCircle className="w-8 h-8" />
        <p>{language === "ar" ? "خطأ في تحميل الدفعات" : "Error loading payments"}</p>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 gap-2">
        <FileX className="w-8 h-8" />
        <p>{language === "ar" ? "لا توجد دفعات بعد" : "No payments yet"}</p>
      </div>
    );
  }

  return (
    <>
      <PaymentHistory
        payments={payments}
        invoiceStatus="paid"
        invoice={null}
        language={language}
        t={t}
        onAdd={() => {}}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

      <ViewPaymentModal
        isOpen={viewPaymentModalOpen}
        onClose={() => {
          setViewPaymentModalOpen(false);
          setViewingPayment(null);
        }}
        paymentId={viewingPayment?.id}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        invoiceId={editingPayment?.invoice_id}
        payment={editingPayment}
        onSaved={handlePaymentSaved}
        language={language}
        isRTL={isRTL}
      />

      <DeletePaymentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        payment={deletingPayment}
        onConfirm={handleDeleteConfirm}
        language={language}
      />
    </>
  );
}
