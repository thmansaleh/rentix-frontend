"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { getExpenseById, approveExpense, rejectExpense } from "@/app/services/api/walletExpenses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, FileText, DollarSign, Calendar, User, Building2, Hash, Users, Landmark, Receipt, CheckCircle, XCircle, Clock, Image, Download, Upload } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";
import { UploadReceiptsModal } from "./UploadReceiptsModal";

export function ViewWalletExpenseModal({ isOpen, onClose, expenseId }) {
  const { t } = useTranslations();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch expense details
  const { data, error, isLoading, mutate } = useSWR(
    isOpen && expenseId ? `/wallet-expenses/${expenseId}` : null,
    () => getExpenseById(expenseId),
    {
      revalidateOnFocus: false,
      onError: (err) => {

      }
    }
  );

  const expense = data?.data;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      verified: { label: "تم التحقق", color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { label: "مرفوض", color: "bg-red-100 text-red-800", icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await approveExpense(expenseId);
      toast.success("تم التحقق من المصروف بنجاح");
      mutate(); // Refresh data
    } catch (error) {

      toast.error(error.response?.data?.error || "فشل في التحقق من المصروف");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("الرجاء إدخال سبب الرفض");
      return;
    }
    
    try {
      setIsRejecting(true);
      await rejectExpense(expenseId, rejectionReason);
      toast.success("تم رفض المصروف وإعادة المبلغ");
      mutate(); // Refresh data
    } catch (error) {

      toast.error(error.response?.data?.error || "فشل في رفض المصروف");
    } finally {
      setIsRejecting(false);
      setShowRejectDialog(false);
      setRejectionReason("");
    }
  };

  const handleUploadSuccess = () => {
    mutate(); // Refresh data after upload
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold">تفاصيل المصروف</h2>
            {expense && getStatusBadge(expense.status)}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">جاري تحميل التفاصيل...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <p className="text-lg font-semibold mb-2">خطأ في تحميل تفاصيل المصروف</p>
              <p className="text-sm text-gray-600">
                {error?.response?.data?.error || error?.message || 'حدث خطأ غير متوقع'}
              </p>
              <Button onClick={onClose} variant="outline" className="mt-4">
                إغلاق
              </Button>
            </div>
          ) : !expense ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <p>لم يتم العثور على المصروف</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount Card */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">إجمالي المبلغ</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {formatAmount(expense.amount, expense.currency || "AED")}
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-orange-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    معلومات الفاتورة
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      رقم الفاتورة
                    </label>
                    <p className="text-base font-semibold">
                      {expense.invoice_number || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      تاريخ الفاتورة
                    </label>
                    <p className="text-base font-semibold">
                      {formatDate(expense.invoice_date)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      رقم الملف
                    </label>
                    <p className="text-base font-semibold">
                      {expense.file_number || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      رقم المحفظة
                    </label>
                    <p className="text-base font-semibold">
                      #{expense.wallet_id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Account Information */}
              {expense.bank_name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Landmark className="h-5 w-5" />
                      معلومات الحساب البنكي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        اسم البنك
                      </label>
                      <p className="text-base font-semibold">
                        {expense.bank_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        رقم الحساب
                      </label>
                      <p className="text-base font-semibold">
                        {expense.account_number}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Expense Items */}
              {expense.items && expense.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      بنود المصروف
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expense.items.map((item, index) => (
                        <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">
                              {index + 1}. {item.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(item.created_at)}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-orange-600">
                              {formatAmount(item.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Subtotal and VAT Calculation */}
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">المجموع الفرعي:</span>
                          <span className="font-semibold">
                            {formatAmount(expense.items.reduce((sum, item) => sum + parseFloat(item.amount), 0))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ضريبة القيمة المضافة (5%):</span>
                          <span className="font-semibold">
                            {formatAmount(expense.items.reduce((sum, item) => sum + parseFloat(item.amount), 0) * 0.05)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-lg pt-2 border-t">
                          <span className="font-bold">الإجمالي شامل الضريبة:</span>
                          <span className="font-bold text-orange-600">
                            {formatAmount(expense.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Receipts */}
              {expense.receipts && expense.receipts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      الإيصالات المرفقة ({expense.receipts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {expense.receipts.map((receipt) => (
                        <div key={receipt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {receipt.file_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(receipt.uploaded_at).toLocaleDateString("ar-AE")}
                              </p>
                              {receipt.uploaded_by_name && (
                                <p className="text-xs text-muted-foreground">
                                  رفع بواسطة: {receipt.uploaded_by_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <a
                            href={receipt.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason */}
              {expense.status === 'rejected' && expense.rejection_reason && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                      <XCircle className="h-5 w-5" />
                      سبب الرفض
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-800">{expense.rejection_reason}</p>
                  </CardContent>
                </Card>
              )}

              {/* Employee Information */}
              {expense.employee_id && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      معلومات الموظف
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        اسم الموظف المرتبط
                      </label>
                      <p className="text-base font-semibold">
                        {expense.employee_name || "-"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    معلومات النظام
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      أنشئ بواسطة
                    </label>
                    <p className="text-base font-semibold">
                      {expense.created_by_name || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      تاريخ الإنشاء
                    </label>
                    <p className="text-base font-semibold">
                      {formatDate(expense.created_at)}
                    </p>
                  </div>
                  {expense.verified_by_name && (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          {expense.status === 'verified' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          {expense.status === 'verified' ? 'تم التحقق بواسطة' : 'تم الرفض بواسطة'}
                        </label>
                        <p className="text-base font-semibold">
                          {expense.verified_by_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {expense.status === 'verified' ? 'تاريخ التحقق' : 'تاريخ الرفض'}
                        </label>
                        <p className="text-base font-semibold">
                          {formatDate(expense.verified_at)}
                        </p>
                      </div>
                    </>
                  )}
                  {expense.updated_by_name && (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          آخر تحديث بواسطة
                        </label>
                        <p className="text-base font-semibold">
                          {expense.updated_by_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          تاريخ التحديث
                        </label>
                        <p className="text-base font-semibold">
                          {formatDate(expense.updated_at)}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
          <div className="flex items-center gap-3">
            {expense && expense.status === 'pending' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(true)}
                  disabled={isApproving || isRejecting}
                >
                  <Upload className="ml-2 h-4 w-4" />
                  رفع إيصالات
                </Button>
                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="ml-2 h-4 w-4" />
                      تحقق والموافقة
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isApproving || isRejecting}
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  رفض
                </Button>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            إغلاق
          </Button>
        </div>

        {/* Upload Receipts Modal */}
        <UploadReceiptsModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          expenseId={expenseId}
          onSuccess={handleUploadSuccess}
        />

        {/* Reject Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">سبب رفض المصروف</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border rounded-lg p-3 min-h-[120px] mb-4"
                placeholder="الرجاء إدخال سبب الرفض..."
                disabled={isRejecting}
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason("");
                  }}
                  disabled={isRejecting}
                >
                  إلغاء
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting || !rejectionReason.trim()}
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الرفض...
                    </>
                  ) : (
                    "تأكيد الرفض"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
