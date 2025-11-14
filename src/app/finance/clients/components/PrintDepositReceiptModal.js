"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function PrintDepositReceiptModal({ isOpen, onClose, deposit, clientName }) {
  const printRef = useRef();

  // Get payment type label
  const getPaymentTypeLabel = (type) => {
    const types = {
      'cash': { ar: 'نقد', en: 'Cash' },
      'card': { ar: 'بطاقة', en: 'Card' },
      'check': { ar: 'شيك', en: 'Check' }
    };
    return types[type] || types['cash'];
  };

  // Convert number to Arabic words
  const numberToArabicWords = (num) => {
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
    
    if (num === 0) return 'صفر';
    
    const convertBelow1000 = (n) => {
      let str = '';
      const hasHundreds = n >= 100;
      
      if (hasHundreds) {
        str += hundreds[Math.floor(n / 100)];
        n = n % 100;
        if (n > 0) str += ' و ';
      }
      
      if (n >= 20) {
        str += tens[Math.floor(n / 10)];
        n = n % 10;
        if (n > 0) str += ' و ';
      } else if (n >= 10) {
        str += teens[n - 10];
        return str;
      }
      
      if (n > 0 && n < 10) {
        str += ones[n];
      }
      
      return str;
    };
    
    let result = '';
    let intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);
    
    // Millions
    if (intPart >= 1000000) {
      const millions = Math.floor(intPart / 1000000);
      if (millions === 1) result += 'مليون';
      else if (millions === 2) result += 'مليونان';
      else result += convertBelow1000(millions) + ' مليون';
      intPart = intPart % 1000000;
      if (intPart > 0) result += ' و ';
    }
    
    // Thousands
    if (intPart >= 1000) {
      const thousands = Math.floor(intPart / 1000);
      if (thousands === 1) result += 'ألف';
      else if (thousands === 2) result += 'ألفان';
      else if (thousands >= 3 && thousands <= 10) result += convertBelow1000(thousands) + ' آلاف';
      else result += convertBelow1000(thousands) + ' ألف';
      intPart = intPart % 1000;
      if (intPart > 0) result += ' و ';
    }
    
    // Below 1000
    if (intPart > 0) {
      result += convertBelow1000(intPart);
    }
    
    // Decimal part (fils)
    if (decPart > 0) {
      result += ' و ' + convertBelow1000(decPart) + ' فلس';
    }
    
    return result.trim();
  };

  // Convert number to English words
  const numberToEnglishWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    const convertHundreds = (n) => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n = n % 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n = n % 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result.trim();
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result.trim();
    };
    
    let result = '';
    const intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);
    
    if (intPart >= 1000000) {
      result += convertHundreds(Math.floor(intPart / 1000000)) + ' Million ';
      let remaining = intPart % 1000000;
      if (remaining >= 1000) {
        result += convertHundreds(Math.floor(remaining / 1000)) + ' Thousand ';
        remaining = remaining % 1000;
      }
      if (remaining > 0) {
        result += convertHundreds(remaining) + ' ';
      }
    } else if (intPart >= 1000) {
      result += convertHundreds(Math.floor(intPart / 1000)) + ' Thousand ';
      const remaining = intPart % 1000;
      if (remaining > 0) {
        result += convertHundreds(remaining) + ' ';
      }
    } else {
      result += convertHundreds(intPart) + ' ';
    }
    
    if (decPart > 0) {
      result += 'and ' + convertHundreds(decPart) + ' Fils';
    }
    
    return result.trim();
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print-area');
    if (!printContent) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>سند استلام - ${deposit?.id || ''}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              direction: rtl;
              padding: 0;
              background: white;
            }
            .receipt-container {
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              padding: 10mm;
            }
            .header-section {
              padding: 20px;
              margin-bottom: 30px;
              border-bottom: 3px double #000;
            }
            .company-info {
              text-align: center;
              margin-bottom: 15px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #000;
            }
            .receipt-title {
              color: #000;
              display: inline-block;
              padding: 10px 50px;
              font-size: 22px;
              font-weight: bold;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }
            .receipt-details {
              display: flex;
              justify-content: space-between;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #ccc;
            }
            .receipt-number {
              font-size: 14px;
              font-weight: bold;
              color: #000;
            }
            .main-content {
              padding: 30px 0;
              margin: 30px 0;
            }
            .info-row {
              display: grid;
              grid-template-columns: 1fr 2fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
              align-items: center;
            }
            .info-label-en {
              font-size: 12px;
              color: #6b7280;
              text-align: left;
              font-weight: 600;
            }
            .info-label-ar {
              font-size: 13px;
              color: #374151;
              text-align: right;
              font-weight: 600;
            }
            .info-value {
              font-size: 15px;
              color: #000;
              text-align: center;
              padding: 8px 15px;
              font-weight: 600;
              border-bottom: 2px dotted #ccc;
            }
            .amount-section {
              padding: 30px 0;
              margin: 30px 0;
              text-align: center;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }
            .amount-label {
              font-size: 14px;
              color: #374151;
              font-weight: 700;
              margin-bottom: 15px;
              display: flex;
              justify-content: center;
              gap: 20px;
              align-items: center;
            }
            .amount-value {
              font-size: 36px;
              color: #000;
              font-weight: bold;
              font-family: monospace;
              padding: 15px;
            }
            .amount-in-words {
              padding: 20px 0;
              margin: 30px 0;
            }
            .words-title {
              font-size: 13px;
              color: #374151;
              font-weight: 700;
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .words-ar {
              font-size: 15px;
              color: #1f2937;
              margin-bottom: 8px;
              font-weight: 500;
              line-height: 1.8;
              text-align: right;
            }
            .words-en {
              font-size: 13px;
              color: #6b7280;
              line-height: 1.6;
              text-align: left;
            }
            .description-section {
              padding: 20px 0;
              margin: 30px 0;
              border-top: 1px solid #e5e7eb;
            }
            .description-label {
              font-size: 13px;
              color: #374151;
              font-weight: 700;
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .description-value {
              font-size: 14px;
              color: #1f2937;
              line-height: 1.8;
              min-height: 60px;
              padding: 10px 0;
            }
            .footer-section {
              margin-top: 50px;
              padding-top: 30px;
              border-top: 1px solid #ccc;
            }
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
              margin-top: 60px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              padding-top: 8px;
              margin-top: 80px;
              font-size: 13px;
              color: #000;
              font-weight: 600;
            }
            .signature-sublabel {
              font-size: 10px;
              color: #6b7280;
              margin-top: 3px;
            }
            .footer-info {
              margin-top: 40px;
              padding: 15px 0;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
            @media print {
              body { padding: 0; }
              .receipt-container { padding: 5mm; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' درهم';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), "dd/MM/yyyy - hh:mm a", { locale: ar });
    } catch {
      return dateString;
    }
  };

  if (!isOpen || !deposit) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="طباعة سند الاستلام"
      size="lg"
    >
      <CustomModalBody>
        {/* Print Area */}
        <style jsx>{`
          .receipt-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 20px;
          }
          .header-section {
            padding: 20px;
            margin-bottom: 30px;
            border-bottom: 3px double #000;
          }
          .company-info {
            text-align: center;
            margin-bottom: 15px;
          }
          .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000;
          }
          .receipt-title {
            color: #000;
            display: inline-block;
            padding: 10px 50px;
            font-size: 20px;
            font-weight: bold;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
          }
          .receipt-details {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
          }
          .receipt-number {
            font-size: 13px;
            font-weight: bold;
            color: #000;
          }
          .main-content {
            padding: 30px 0;
            margin: 30px 0;
          }
          .info-row {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
            align-items: center;
          }
          .info-label-en {
            font-size: 12px;
            color: #6b7280;
            text-align: left;
            font-weight: 600;
          }
          .info-label-ar {
            font-size: 13px;
            color: #374151;
            text-align: right;
            font-weight: 600;
          }
          .info-value {
            font-size: 15px;
            color: #000;
            text-align: center;
            padding: 8px 15px;
            font-weight: 600;
            border-bottom: 2px dotted #ccc;
          }
          .amount-section {
            padding: 30px 0;
            margin: 30px 0;
            text-align: center;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
          }
          .amount-label {
            font-size: 14px;
            color: #374151;
            font-weight: 700;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            gap: 20px;
            align-items: center;
          }
          .amount-value {
            font-size: 32px;
            color: #000;
            font-weight: bold;
            font-family: monospace;
            padding: 15px;
          }
          .amount-in-words {
            padding: 20px 0;
            margin: 30px 0;
          }
          .words-title {
            font-size: 13px;
            color: #374151;
            font-weight: 700;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .words-ar {
            font-size: 15px;
            color: #1f2937;
            margin-bottom: 8px;
            font-weight: 500;
            line-height: 1.8;
            text-align: right;
          }
          .words-en {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.6;
            text-align: left;
          }
          .description-section {
            padding: 20px 0;
            margin: 30px 0;
            border-top: 1px solid #e5e7eb;
          }
          .description-label {
            font-size: 13px;
            color: #374151;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .description-value {
            font-size: 14px;
            color: #1f2937;
            line-height: 1.8;
            min-height: 60px;
            padding: 10px 0;
          }
          .footer-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #ccc;
          }
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-top: 60px;
          }
          .signature-box {
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #000;
            padding-top: 8px;
            margin-top: 80px;
            font-size: 13px;
            color: #000;
            font-weight: 600;
          }
          .signature-sublabel {
            font-size: 10px;
            color: #6b7280;
            margin-top: 3px;
          }
          .footer-info {
            margin-top: 40px;
            padding: 15px 0;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
        `}</style>

        <div id="receipt-print-area" ref={printRef} className="receipt-container">
          {/* Header Section */}
          <div className="header-section">
            <div className="company-info">
              <div className="company-name">مكتب محمد بني هاشم للمحاماة والاستشارات القانونية</div>
              <div style={{ fontSize: '12px', marginBottom: '15px' }}>
                Mohammed Bani Hashem Law Firm & Legal Consultations
              </div>
              <div className="receipt-title">
                سند استلام / RECEIPT VOUCHER
              </div>
            </div>
            <div className="receipt-details">
              <div>
                <div style={{ fontSize: '11px', marginBottom: '3px' }}>رقم السند / Receipt No.</div>
                <div className="receipt-number">#{deposit.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', marginBottom: '3px' }}>التاريخ / Date</div>
                <div className="receipt-number">{formatDate(deposit.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="info-row">
              <div className="info-label-en">Received From</div>
              <div className="info-value">{clientName || 'غير محدد'}</div>
              <div className="info-label-ar">استلمنا من</div>
            </div>
            <div className="info-row">
              <div className="info-label-en">Payment Method</div>
              <div className="info-value">
                {getPaymentTypeLabel(deposit.type || 'cash').en} / {getPaymentTypeLabel(deposit.type || 'cash').ar}
              </div>
              <div className="info-label-ar">طريقة الدفع</div>
            </div>
            {deposit.type === 'check' && (
              <>
                {deposit.check_number && (
                  <div className="info-row">
                    <div className="info-label-en">Check Number</div>
                    <div className="info-value">{deposit.check_number}</div>
                    <div className="info-label-ar">رقم الشيك</div>
                  </div>
                )}
                {deposit.bank_name && (
                  <div className="info-row">
                    <div className="info-label-en">Bank Name</div>
                    <div className="info-value">{deposit.bank_name}</div>
                    <div className="info-label-ar">اسم البنك</div>
                  </div>
                )}
                {deposit.check_date && (
                  <div className="info-row">
                    <div className="info-label-en">Check Date</div>
                    <div className="info-value">{formatDate(deposit.check_date)}</div>
                    <div className="info-label-ar">تاريخ الشيك</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Amount Section */}
          <div className="amount-section">
            <div className="amount-label">
              <span>Received Amount</span>
              <span>المبلغ المستلم</span>
            </div>
            <div className="amount-value">{formatCurrency(deposit.amount)}</div>
          </div>

          {/* Amount in Words */}
          <div className="amount-in-words">
            <div className="words-title">
              <span>Amount in Words</span>
              <span>المبلغ بالحروف</span>
            </div>
            <div className="words-ar">
              {numberToArabicWords(deposit.amount)} درهم إماراتي فقط لا غير
            </div>
            <div className="words-en">
              {numberToEnglishWords(deposit.amount)} UAE Dirhams Only
            </div>
          </div>

          {/* Description Section */}
          {deposit.description && (
            <div className="description-section">
              <div className="description-label">
                <span>Description</span>
                <span>الوصف</span>
              </div>
              <div className="description-value">{deposit.description}</div>
            </div>
          )}

          {/* Footer Section */}
          <div className="footer-section">
            <div className="footer-info">
              <div style={{ marginBottom: '8px' }}>
                <strong>أضيف بواسطة / Created By:</strong> {deposit.created_by_name || '-'}
              </div>
              <div>
                <strong>تاريخ ووقت الإصدار / Issue Date & Time:</strong> {formatDateTime(deposit.created_at)}
              </div>
            </div>

            {/* Signatures */}
            <div className="signatures">
              <div className="signature-box">
                <div className="signature-line">
                  <div>المستلِم</div>
                  <div className="signature-sublabel">Received By</div>
                </div>
              </div>
              <div className="signature-box">
                <div className="signature-line">
                  <div>المسلِّم</div>
                  <div className="signature-sublabel">Delivered By</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
        >
          إغلاق
        </Button>
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          طباعة
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
