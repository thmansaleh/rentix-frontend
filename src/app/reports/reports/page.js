"use client";

import React, { useState } from "react";
import { FileText, FileSpreadsheet, Loader2, BarChart2, TrendingUp, Car, Users, Receipt, Wallet, AlertTriangle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { getAllInvoices } from "@/app/services/api/invoices";
import { getPayments } from "@/app/services/api/payments";
import { getContracts } from "@/app/services/api/contracts";
import { getCustomers } from "@/app/services/api/customers";
import { getExpenses } from "@/app/services/api/expenses";
import { getCars } from "@/app/services/api/cars";
import { getAccidents } from "@/app/services/api/accidents";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

function getCurrentMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d) => d.toISOString().split("T")[0];
  return { from: fmt(firstDay), to: fmt(lastDay) };
}

const { from: defaultFrom, to: defaultTo } = getCurrentMonthRange();

// ─── Report config ───────────────────────────────────────────────────────────
const REPORT_CONFIGS = [
  {
    key: "invoices",
    icon: Receipt,
    color: "#2563eb",
    labelEn: "Invoices",
    labelAr: "الفواتير",
    descEn: "All invoices for the selected period",
    descAr: "تقرير جميع الفواتير للفترة المحددة",
    loadingXlKey: "loadingXl",
    loadingPdfKey: "loadingPdf",
    xlHandler: "handleInvoicesXL",
    pdfHandler: "handleInvoicesPDF",
  },
  {
    key: "payments",
    icon: Wallet,
    color: "#16a34a",
    labelEn: "Payments",
    labelAr: "المدفوعات",
    descEn: "All payments for the selected period",
    descAr: "تقرير جميع المدفوعات للفترة المحددة",
    loadingXlKey: "loadingPaymentsXl",
    loadingPdfKey: "loadingPaymentsPdf",
    xlHandler: "handlePaymentsXL",
    pdfHandler: "handlePaymentsPDF",
  },
  {
    key: "contracts",
    icon: FileCheck,
    color: "#7c3aed",
    labelEn: "Contracts",
    labelAr: "العقود",
    descEn: "All contracts for the selected period",
    descAr: "تقرير جميع العقود للفترة المحددة",
    loadingXlKey: "loadingContractsXl",
    loadingPdfKey: "loadingContractsPdf",
    xlHandler: "handleContractsXL",
    pdfHandler: "handleContractsPDF",
  },
  {
    key: "customers",
    icon: Users,
    color: "#dc2626",
    labelEn: "Customers",
    labelAr: "العملاء",
    descEn: "Customers added in the selected period",
    descAr: "تقرير العملاء المضافين للفترة المحددة",
    loadingXlKey: "loadingCustomersXl",
    loadingPdfKey: "loadingCustomersPdf",
    xlHandler: "handleCustomersXL",
    pdfHandler: "handleCustomersPDF",
  },
  {
    key: "expenses",
    icon: TrendingUp,
    color: "#ea580c",
    labelEn: "Expenses",
    labelAr: "المصروفات",
    descEn: "All expenses for the selected period",
    descAr: "تقرير جميع المصروفات للفترة المحددة",
    loadingXlKey: "loadingExpensesXl",
    loadingPdfKey: "loadingExpensesPdf",
    xlHandler: "handleExpensesXL",
    pdfHandler: "handleExpensesPDF",
  },
  {
    key: "cars",
    icon: Car,
    color: "#0284c7",
    labelEn: "Cars",
    labelAr: "السيارات",
    descEn: "Cars added in the selected period",
    descAr: "تقرير السيارات المضافة للفترة المحددة",
    loadingXlKey: "loadingCarsXl",
    loadingPdfKey: "loadingCarsPdf",
    xlHandler: "handleCarsXL",
    pdfHandler: "handleCarsPDF",
  },
  {
    key: "accidents",
    icon: AlertTriangle,
    color: "#be123c",
    labelEn: "Accidents",
    labelAr: "الحوادث",
    descEn: "All accidents for the selected period",
    descAr: "تقرير جميع الحوادث للفترة المحددة",
    loadingXlKey: "loadingAccidentsXl",
    loadingPdfKey: "loadingAccidentsPdf",
    xlHandler: "handleAccidentsXL",
    pdfHandler: "handleAccidentsPDF",
  },
];

// ─── Shared PDF helpers ───────────────────────────────────────────────────────
async function loadArabicFont(doc) {
  try {
    const fontRes = await fetch("https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf");
    const fontBuf = await fontRes.arrayBuffer();
    const fontBase64 = btoa(new Uint8Array(fontBuf).reduce((s, b) => s + String.fromCharCode(b), ""));
    doc.addFileToVFS("Amiri-Regular.ttf", fontBase64);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
    return "Amiri";
  } catch {
    return "helvetica";
  }
}

function setPdfHeader(doc, title, dateFrom, dateTo) {
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.width / 2, 14, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Period: ${dateFrom}  →  ${dateTo}`, doc.internal.pageSize.width / 2, 21, { align: "center" });
}

function addPageNumbers(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 8);
  }
}

export default function ReportsPage() {
  const { isRTL, language } = useLanguage();
  const t = useTranslations("common");
  const isAr = language === "ar";

  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXl, setLoadingXl] = useState(false);
  const [loadingPaymentsPdf, setLoadingPaymentsPdf] = useState(false);
  const [loadingPaymentsXl, setLoadingPaymentsXl] = useState(false);
  const [loadingContractsPdf, setLoadingContractsPdf] = useState(false);
  const [loadingContractsXl, setLoadingContractsXl] = useState(false);
  const [loadingCustomersPdf, setLoadingCustomersPdf] = useState(false);
  const [loadingCustomersXl, setLoadingCustomersXl] = useState(false);
  const [loadingExpensesPdf, setLoadingExpensesPdf] = useState(false);
  const [loadingExpensesXl, setLoadingExpensesXl] = useState(false);
  const [loadingCarsPdf, setLoadingCarsPdf] = useState(false);
  const [loadingCarsXl, setLoadingCarsXl] = useState(false);
  const [loadingAccidentsPdf, setLoadingAccidentsPdf] = useState(false);
  const [loadingAccidentsXl, setLoadingAccidentsXl] = useState(false);

  // ─── Fetchers ─────────────────────────────────────────────────────────────
  const fetchInvoicesForReport = async () => {
    const result = await getAllInvoices({ date_from: dateFrom, date_to: dateTo, limit: 10000, page: 1 });
    if (!result.success) throw new Error("Failed to fetch invoices");
    return result.data || [];
  };
  const fetchPaymentsForReport = async () => {
    const result = await getPayments({ startDate: dateFrom, endDate: dateTo, limit: 10000, page: 1 });
    if (!result.success) throw new Error("Failed to fetch payments");
    return result.data || [];
  };
  const fetchContractsForReport = async () => {
    const data = await getContracts({ date_from: dateFrom, date_to: dateTo });
    return Array.isArray(data) ? data : (data?.data || []);
  };
  const fetchCustomersForReport = async () => {
    const result = await getCustomers("", { date_from: dateFrom, date_to: dateTo });
    if (!result.success) throw new Error("Failed to fetch customers");
    return result.data || [];
  };
  const fetchExpensesForReport = async () => {
    const result = await getExpenses({ startDate: dateFrom, endDate: dateTo, limit: 10000, page: 1 });
    if (!result.success) throw new Error("Failed to fetch expenses");
    return result.data || [];
  };
  const fetchCarsForReport = async () => {
    const result = await getCars({ date_from: dateFrom, date_to: dateTo });
    if (!result.success) throw new Error("Failed to fetch cars");
    return result.data || [];
  };
  const fetchAccidentsForReport = async () => {
    const result = await getAccidents({ date_from: dateFrom, date_to: dateTo });
    if (!result.success) throw new Error("Failed to fetch accidents");
    return result.data || [];
  };

  // ─── Invoices ──────────────────────────────────────────────────────────────
  const handleInvoicesXL = async () => {
    setLoadingXl(true);
    try {
      const invoices = await fetchInvoicesForReport();
      if (!invoices.length) { toast.info(isAr ? "لا توجد فواتير" : "No invoices found"); return; }
      const headers = isAr ? ["رقم الفاتورة","العميل","تاريخ الإصدار","الإجمالي","المدفوع","المتبقي","الحالة"] : ["Invoice #","Customer","Issue Date","Total","Paid","Due","Status"];
      const rows = invoices.map((inv) => [inv.invoice_number||"",inv.customer_name||"",inv.issue_date?new Date(inv.issue_date).toLocaleDateString():"",inv.total_amount??"",inv.paid_amount??"",inv.payment_due_amount??"",inv.status||""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "الفواتير" : "Invoices");
      XLSX.writeFile(wb, `invoices_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingXl(false); }
  };
  const handleInvoicesPDF = async () => {
    setLoadingPdf(true);
    try {
      const invoices = await fetchInvoicesForReport();
      if (!invoices.length) { toast.info(isAr ? "لا توجد فواتير" : "No invoices found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Invoices Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Invoice #","Customer","Issue Date","Total","Paid","Due","Status"]], body: invoices.map((inv) => [inv.invoice_number||"",inv.customer_name||"",inv.issue_date?new Date(inv.issue_date).toLocaleDateString("en-US"):"",inv.total_amount??"",inv.paid_amount??"",inv.payment_due_amount??"",inv.status||""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [37,99,235], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`invoices_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingPdf(false); }
  };

  // ─── Payments ─────────────────────────────────────────────────────────────
  const handlePaymentsXL = async () => {
    setLoadingPaymentsXl(true);
    try {
      const payments = await fetchPaymentsForReport();
      if (!payments.length) { toast.info(isAr ? "لا توجد مدفوعات" : "No payments found"); return; }
      const headers = isAr ? ["رقم الدفعة","رقم الفاتورة","المبلغ","طريقة الدفع","تاريخ الدفع","المرجع","الفرع"] : ["Payment ID","Invoice #","Amount","Method","Payment Date","Reference","Branch"];
      const rows = payments.map((p) => [p.id||"",p.invoice_number||"",p.amount??"",p.payment_method||"",p.payment_date?new Date(p.payment_date).toLocaleDateString():"",p.reference_number||"",(isAr?p.branch_name_ar:p.branch_name_en)||""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "المدفوعات" : "Payments");
      XLSX.writeFile(wb, `payments_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingPaymentsXl(false); }
  };
  const handlePaymentsPDF = async () => {
    setLoadingPaymentsPdf(true);
    try {
      const payments = await fetchPaymentsForReport();
      if (!payments.length) { toast.info(isAr ? "لا توجد مدفوعات" : "No payments found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Payments Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Payment ID","Invoice #","Amount","Method","Payment Date","Reference","Branch"]], body: payments.map((p) => [p.id||"",p.invoice_number||"",p.amount??"",p.payment_method||"",p.payment_date?new Date(p.payment_date).toLocaleDateString("en-US"):"",p.reference_number||"",p.branch_name_en||""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [22,163,74], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`payments_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingPaymentsPdf(false); }
  };

  // ─── Contracts ────────────────────────────────────────────────────────────
  const handleContractsXL = async () => {
    setLoadingContractsXl(true);
    try {
      const contracts = await fetchContractsForReport();
      if (!contracts.length) { toast.info(isAr ? "لا توجد عقود" : "No contracts found"); return; }
      const headers = isAr ? ["رقم العقد","العميل","السيارة","لوحة","تاريخ البدء","تاريخ الانتهاء","الإجمالي","المدفوع","الحالة"] : ["Contract #","Customer","Car","Plate","Start Date","End Date","Total","Paid","Status"];
      const rows = contracts.map((c) => [c.contract_number||"",c.customer_name||"",c.car_details||"",c.plate_number||"",c.start_date?new Date(c.start_date).toLocaleDateString():"",c.end_date?new Date(c.end_date).toLocaleDateString():"",c.total_amount??"",c.paid_amount??"",c.status||""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "العقود" : "Contracts");
      XLSX.writeFile(wb, `contracts_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingContractsXl(false); }
  };
  const handleContractsPDF = async () => {
    setLoadingContractsPdf(true);
    try {
      const contracts = await fetchContractsForReport();
      if (!contracts.length) { toast.info(isAr ? "لا توجد عقود" : "No contracts found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Contracts Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Contract #","Customer","Car","Plate","Start Date","End Date","Total","Paid","Status"]], body: contracts.map((c) => [c.contract_number||"",c.customer_name||"",c.car_details||"",c.plate_number||"",c.start_date?new Date(c.start_date).toLocaleDateString("en-US"):"",c.end_date?new Date(c.end_date).toLocaleDateString("en-US"):"",c.total_amount??"",c.paid_amount??"",c.status||""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [124,58,237], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`contracts_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingContractsPdf(false); }
  };

  // ─── Customers ────────────────────────────────────────────────────────────
  const handleCustomersXL = async () => {
    setLoadingCustomersXl(true);
    try {
      const customers = await fetchCustomersForReport();
      if (!customers.length) { toast.info(isAr ? "لا يوجد عملاء" : "No customers found"); return; }
      const headers = isAr ? ["الاسم","الجوال","البريد","الجنسية","رقم الهوية","الجهة","تاريخ الإضافة"] : ["Full Name","Phone","Email","Nationality","Emirates ID","Branch","Created At"];
      const rows = customers.map((c) => [c.full_name||"",c.phone||"",c.email||"",(isAr?c.nationality_ar:c.nationality_en)||"",c.emirates_id||"",c.branch_name||"",c.created_at?new Date(c.created_at).toLocaleDateString():""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 22 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "العملاء" : "Customers");
      XLSX.writeFile(wb, `customers_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingCustomersXl(false); }
  };
  const handleCustomersPDF = async () => {
    setLoadingCustomersPdf(true);
    try {
      const customers = await fetchCustomersForReport();
      if (!customers.length) { toast.info(isAr ? "لا يوجد عملاء" : "No customers found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Customers Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Full Name","Phone","Email","Nationality","Emirates ID","Branch","Created At"]], body: customers.map((c) => [c.full_name||"",c.phone||"",c.email||"",c.nationality_en||"",c.emirates_id||"",c.branch_name||"",c.created_at?new Date(c.created_at).toLocaleDateString("en-US"):""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [220,38,38], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`customers_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingCustomersPdf(false); }
  };

  // ─── Expenses ─────────────────────────────────────────────────────────────
  const handleExpensesXL = async () => {
    setLoadingExpensesXl(true);
    try {
      const expenses = await fetchExpensesForReport();
      if (!expenses.length) { toast.info(isAr ? "لا توجد مصروفات" : "No expenses found"); return; }
      const headers = isAr ? ["الوصف","الفئة","المبلغ","طريقة الدفع","التاريخ","الفرع","ملاحظات"] : ["Description","Category","Amount","Payment Method","Date","Branch","Notes"];
      const rows = expenses.map((e) => [e.description||"",(isAr?e.category_name_ar:e.category_name_en)||"",e.amount??"",e.payment_method||"",e.expense_date?new Date(e.expense_date).toLocaleDateString():"",(isAr?e.branch_name_ar:e.branch_name_en)||"",e.notes||""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 22 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "المصروفات" : "Expenses");
      XLSX.writeFile(wb, `expenses_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingExpensesXl(false); }
  };
  const handleExpensesPDF = async () => {
    setLoadingExpensesPdf(true);
    try {
      const expenses = await fetchExpensesForReport();
      if (!expenses.length) { toast.info(isAr ? "لا توجد مصروفات" : "No expenses found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Expenses Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Description","Category","Amount","Payment Method","Date","Branch","Notes"]], body: expenses.map((e) => [e.description||"",e.category_name_en||"",e.amount??"",e.payment_method||"",e.expense_date?new Date(e.expense_date).toLocaleDateString("en-US"):"",e.branch_name_en||"",e.notes||""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [234,88,12], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`expenses_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingExpensesPdf(false); }
  };

  // ─── Cars ─────────────────────────────────────────────────────────────────
  const handleCarsXL = async () => {
    setLoadingCarsXl(true);
    try {
      const cars = await fetchCarsForReport();
      if (!cars.length) { toast.info(isAr ? "لا توجد سيارات" : "No cars found"); return; }
      const headers = isAr ? ["الماركة","الموديل","السنة","اللون","اللوحة","الحالة","السعر اليومي","تاريخ الإضافة"] : ["Brand","Model","Year","Color","Plate","Status","Daily Price","Added At"];
      const rows = cars.map((c) => [c.brand||"",c.model||"",c.year||"",c.color||"",c.plate_number||"",c.status||"",c.daily_price??"",c.created_at?new Date(c.created_at).toLocaleDateString():""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 20 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "السيارات" : "Cars");
      XLSX.writeFile(wb, `cars_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingCarsXl(false); }
  };
  const handleCarsPDF = async () => {
    setLoadingCarsPdf(true);
    try {
      const cars = await fetchCarsForReport();
      if (!cars.length) { toast.info(isAr ? "لا توجد سيارات" : "No cars found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Cars Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Brand","Model","Year","Color","Plate","Status","Daily Price","Added At"]], body: cars.map((c) => [c.brand||"",c.model||"",c.year||"",c.color||"",c.plate_number||"",c.status||"",c.daily_price??"",c.created_at?new Date(c.created_at).toLocaleDateString("en-US"):""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [2,132,199], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`cars_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingCarsPdf(false); }
  };

  // ─── Accidents ────────────────────────────────────────────────────────────
  const handleAccidentsXL = async () => {
    setLoadingAccidentsXl(true);
    try {
      const accidents = await fetchAccidentsForReport();
      if (!accidents.length) { toast.info(isAr ? "لا توجد حوادث" : "No accidents found"); return; }
      const headers = isAr ? ["السيارة","اللوحة","العميل","رقم العقد","التاريخ","الموقع","الوصف","التكلفة"] : ["Car","Plate","Customer","Contract #","Date","Location","Description","Cost"];
      const rows = accidents.map((a) => [`${a.car_brand||""} ${a.car_model||""}`.trim(),a.car_plate_number||"",a.customer_name||"",a.contract_number||"",a.accident_datetime?new Date(a.accident_datetime).toLocaleDateString():"",a.location||"",a.description||"",a.repair_cost??""]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = headers.map(() => ({ wch: 22 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, isAr ? "الحوادث" : "Accidents");
      XLSX.writeFile(wb, `accidents_${dateFrom}_${dateTo}.xlsx`);
      toast.success(isAr ? "تم تصدير ملف Excel" : "Excel exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingAccidentsXl(false); }
  };
  const handleAccidentsPDF = async () => {
    setLoadingAccidentsPdf(true);
    try {
      const accidents = await fetchAccidentsForReport();
      if (!accidents.length) { toast.info(isAr ? "لا توجد حوادث" : "No accidents found"); return; }
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const fontName = await loadArabicFont(doc);
      setPdfHeader(doc, "Accidents Report", dateFrom, dateTo);
      autoTable(doc, { head: [["Car","Plate","Customer","Contract #","Date","Location","Description","Cost"]], body: accidents.map((a) => [`${a.car_brand||""} ${a.car_model||""}`.trim(),a.car_plate_number||"",a.customer_name||"",a.contract_number||"",a.accident_datetime?new Date(a.accident_datetime).toLocaleDateString("en-US"):"",a.location||"",a.description||"",a.repair_cost??""]), startY: 27, styles: { font: fontName, fontSize: 8, cellPadding: 2 }, headStyles: { font: fontName, fillColor: [190,18,60], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [245,245,245] }, margin: { top:27,right:10,bottom:12,left:10 } });
      addPageNumbers(doc);
      doc.save(`accidents_${dateFrom}_${dateTo}.pdf`);
      toast.success(isAr ? "تم تصدير PDF" : "PDF exported");
    } catch { toast.error(isAr ? "حدث خطأ" : "Export failed"); }
    finally { setLoadingAccidentsPdf(false); }
  };

  const handlers = {
    handleInvoicesXL, handleInvoicesPDF,
    handlePaymentsXL, handlePaymentsPDF,
    handleContractsXL, handleContractsPDF,
    handleCustomersXL, handleCustomersPDF,
    handleExpensesXL, handleExpensesPDF,
    handleCarsXL, handleCarsPDF,
    handleAccidentsXL, handleAccidentsPDF,
  };

  const loadingState = {
    loadingXl, loadingPdf,
    loadingPaymentsXl, loadingPaymentsPdf,
    loadingContractsXl, loadingContractsPdf,
    loadingCustomersXl, loadingCustomersPdf,
    loadingExpensesXl, loadingExpensesPdf,
    loadingCarsXl, loadingCarsPdf,
    loadingAccidentsXl, loadingAccidentsPdf,
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        {/* Decorative ambient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 h-52 w-52 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />

        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {isAr ? "مركز التقارير" : "Reports Center"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAr
                  ? "تحميل تقارير النظام بصيغة Excel أو PDF حسب الفترة الزمنية"
                  : "Export system reports as Excel or PDF for any date range"}
              </p>
            </div>
          </div>

          {/* Date range controls */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {isAr ? "من" : "From"}
              </Label>
              <DatePicker
                date={dateFrom ? new Date(dateFrom + "T00:00:00") : undefined}
                onDateChange={(d) => d && setDateFrom(format(d, "yyyy-MM-dd"))}
                placeholder={isAr ? "اختر تاريخ" : "Pick a date"}
                className="h-9 w-44"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {isAr ? "إلى" : "To"}
              </Label>
              <DatePicker
                date={dateTo ? new Date(dateTo + "T00:00:00") : undefined}
                onDateChange={(d) => d && setDateTo(format(d, "yyyy-MM-dd"))}
                placeholder={isAr ? "اختر تاريخ" : "Pick a date"}
                className="h-9 w-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="flex items-center gap-2.5 px-0.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {isAr ? "التقارير المتاحة" : "Available Reports"}
        </span>
        <div className="h-px flex-1 bg-border/50" />
        <span
          className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          {REPORT_CONFIGS.length}
        </span>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {REPORT_CONFIGS.map((cfg) => {
          const Icon = cfg.icon;
          const isXlLoading = loadingState[cfg.loadingXlKey];
          const isPdfLoading = loadingState[cfg.loadingPdfKey];
          const isBusy = isXlLoading || isPdfLoading;

          return (
            <div
              key={cfg.key}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border"
            >
              {/* Colored top accent */}
              <div className="h-[3px] w-full" style={{ background: cfg.color }} />

              {/* Subtle tinted background on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${cfg.color}08 0%, transparent 60%)` }}
              />

              <div className="relative flex flex-1 flex-col gap-3.5 p-4">
                {/* Icon + title */}
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: `${cfg.color}15`,
                      border: `1px solid ${cfg.color}30`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold leading-tight">
                      {isAr ? cfg.labelAr : cfg.labelEn}
                    </h3>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {isAr ? cfg.descAr : cfg.descEn}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/40" />

                {/* Export buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlers[cfg.xlHandler]}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70"
                  >
                    {isXlLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <FileSpreadsheet className="h-3.5 w-3.5" />
                    }
                    <span>Excel</span>
                  </button>

                  <button
                    onClick={handlers[cfg.pdfHandler]}
                    disabled={isBusy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-all duration-150 hover:border-rose-300 hover:bg-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70"
                  >
                    {isPdfLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <FileText className="h-3.5 w-3.5" />
                    }
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}