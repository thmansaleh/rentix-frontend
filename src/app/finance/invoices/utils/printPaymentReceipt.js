import { formatAmount, formatDateShort } from "../utils/formatters";

/**
 * Bilingual payment method labels.
 */
function getPaymentMethodBilingual(method) {
  const methods = {
    cash: { en: "Cash", ar: "نقداً" },
    card: { en: "Card", ar: "بطاقة" },
    bank_transfer: { en: "Bank Transfer", ar: "تحويل بنكي" },
    online: { en: "Online", ar: "أونلاين" },
    wallet: { en: "Wallet", ar: "محفظة" },
    cheque: { en: "Cheque", ar: "شيك" },
  };
  return methods[method] || { en: method, ar: method };
}

/**
 * Open a new window and print a bilingual (Arabic + English) payment receipt.
 *
 * @param {Object} payment   – payment row (id, amount, payment_method, payment_date, reference_number, notes, created_by_name)
 * @param {Object} invoice   – parent invoice (invoice_number, customer_name, customer_phone, total_amount, paid_amount, payment_due_amount)
 * @param {Object} options   – { companySettings }
 */
export function printPaymentReceipt(payment, invoice, { companySettings }) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Company info
  const companyNameAr = companySettings?.company_name_ar || "";
  const companyNameEn = companySettings?.company_name_en || "";
  const logoUrl = companySettings?.logo_url || "";
  const companyPhone = companySettings?.phone || "";
  const companyEmail = companySettings?.email || "";
  const companyAddressAr = companySettings?.address_ar || "";
  const companyAddressEn = companySettings?.address_en || "";
  const companyCR = companySettings?.commercial_register || "";
  const companyVAT = companySettings?.vat_number || "";

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; max-width: 160px; object-fit: contain;" />`
    : "";

  const methodLabels = getPaymentMethodBilingual(payment.payment_method);
  const fmtAmount = (val) => formatAmount(val, "en");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Payment Receipt / إيصال دفع - #${payment.id}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          background: #fff;
          font-size: 13px;
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .receipt {
          max-width: 600px;
          margin: 0 auto;
          padding: 36px 40px;
        }

        /* ── Header ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 3px solid #111827;
          margin-bottom: 20px;
        }
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .header-right {
          text-align: right;
          direction: rtl;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
        }
        .co-name {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        .co-sub {
          font-size: 10px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* ── Title Band ── */
        .title-band {
          background: #059669;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 22px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .title-en {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .title-ar {
          font-size: 20px;
          font-weight: 800;
          direction: rtl;
        }

        /* ── Receipt # row ── */
        .receipt-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 10px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .meta-block {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .meta-label {
          font-size: 9.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #9ca3af;
        }
        .meta-value {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        /* ── Detail Rows ── */
        .details {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          align-items: center;
          padding: 11px 18px;
          border-bottom: 1px solid #f3f4f6;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-row:nth-child(even) { background: #f9fafb; }
        .detail-label-en {
          flex: 1;
          font-size: 12px;
          color: #4b5563;
          font-weight: 500;
        }
        .detail-value {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }
        .detail-label-ar {
          flex: 1;
          text-align: right;
          direction: rtl;
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* ── Amount Highlight ── */
        .amount-band {
          background: #059669;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 22px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .amount-label {
          font-size: 14px;
          font-weight: 600;
        }
        .amount-value {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        /* ── Invoice Context ── */
        .invoice-context {
          margin-bottom: 20px;
        }
        .context-title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 12px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1.5px solid #e5e7eb;
        }
        .context-table {
          width: 100%;
          border-collapse: collapse;
        }
        .context-table td {
          padding: 7px 14px;
          font-size: 12px;
          vertical-align: middle;
        }
        .context-table tr:nth-child(odd) { background: #f9fafb; }
        .context-table .c-en { color: #374151; font-weight: 500; }
        .context-table .c-val {
          text-align: center;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
        }
        .context-table .c-ar {
          text-align: right;
          direction: rtl;
          color: #9ca3af;
          font-weight: 500;
        }
        .context-table .c-due .c-en,
        .context-table .c-due .c-ar,
        .context-table .c-due .c-val {
          color: #dc2626;
          font-weight: 700;
        }

        /* ── Notes ── */
        .notes-box {
          padding: 12px 16px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          font-size: 11.5px;
          color: #92400e;
          margin-bottom: 20px;
        }
        .notes-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 4px;
        }

        /* ── Signature ── */
        .sig-row {
          display: flex;
          justify-content: space-between;
          margin: 30px 0 20px 0;
          gap: 40px;
        }
        .sig-block {
          flex: 1;
          text-align: center;
        }
        .sig-line {
          border-top: 1px solid #d1d5db;
          margin-top: 40px;
          padding-top: 6px;
          font-size: 11px;
          color: #6b7280;
        }

        /* ── Footer ── */
        .footer {
          margin-top: 24px;
          padding-top: 14px;
          border-top: 1.5px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #9ca3af;
          line-height: 1.7;
        }
        .footer-left { text-align: left; }
        .footer-right { text-align: right; direction: rtl; }
        .footer strong { color: #6b7280; }
        .footer-center {
          text-align: center;
          font-size: 9px;
          color: #d1d5db;
          margin-top: 8px;
        }

        @media print {
          body { padding: 0; }
          .receipt { padding: 20px 28px; max-width: 100%; }
        }
        @page {
          margin: 10mm;
          size: A5 portrait;
        }
      </style>
    </head>
    <body>
      <div class="receipt">

        <!-- ══ Header ══ -->
        <div class="header">
          <div class="header-left">
            ${logoHtml}
            ${companyNameEn ? `<div class="co-name">${companyNameEn}</div>` : ""}
            <div class="co-sub">
              ${companyPhone ? `Tel: ${companyPhone}<br/>` : ""}
              ${companyEmail ? `${companyEmail}<br/>` : ""}
              ${companyAddressEn ? `${companyAddressEn}` : ""}
            </div>
          </div>
          <div class="header-right">
            ${companyNameAr ? `<div class="co-name">${companyNameAr}</div>` : ""}
            <div class="co-sub" style="direction:rtl; text-align:right;">
              ${companyPhone ? `هاتف: ${companyPhone}<br/>` : ""}
              ${companyEmail ? `${companyEmail}<br/>` : ""}
              ${companyAddressAr ? `${companyAddressAr}` : ""}
            </div>
          </div>
        </div>

        <!-- ══ Title ══ -->
        <div class="title-band">
          <span class="title-en">Payment Receipt</span>
          <span class="title-ar">إيصال دفع</span>
        </div>

        <!-- ══ Receipt Meta ══ -->
        <div class="receipt-meta">
          <div class="meta-block">
            <span class="meta-label">Receipt No. / رقم الإيصال</span>
            <span class="meta-value">#${payment.id}</span>
          </div>
          <div class="meta-block" style="text-align:center;">
            <span class="meta-label">Date / التاريخ</span>
            <span class="meta-value">${formatDateShort(payment.payment_date)}</span>
          </div>
          <div class="meta-block" style="text-align:right;">
            <span class="meta-label">Invoice / الفاتورة</span>
            <span class="meta-value">${invoice?.invoice_number || "-"}</span>
          </div>
        </div>

        <!-- ══ Amount Highlight ══ -->
        <div class="amount-band">
          <span class="amount-label">Amount Paid / المبلغ المدفوع</span>
          <span class="amount-value">${fmtAmount(payment.amount)} AED</span>
        </div>

        <!-- ══ Payment Details ══ -->
        <div class="details">
          <div class="detail-row">
            <span class="detail-label-en">Customer</span>
            <span class="detail-value">${invoice?.customer_name || "-"}</span>
            <span class="detail-label-ar">العميل</span>
          </div>
          ${invoice?.customer_phone ? `
          <div class="detail-row">
            <span class="detail-label-en">Phone</span>
            <span class="detail-value">${invoice.customer_phone}</span>
            <span class="detail-label-ar">الهاتف</span>
          </div>` : ""}
          <div class="detail-row">
            <span class="detail-label-en">Payment Method</span>
            <span class="detail-value">${methodLabels.en} / ${methodLabels.ar}</span>
            <span class="detail-label-ar">طريقة الدفع</span>
          </div>
          ${payment.reference_number ? `
          <div class="detail-row">
            <span class="detail-label-en">Reference #</span>
            <span class="detail-value">${payment.reference_number}</span>
            <span class="detail-label-ar">رقم المرجع</span>
          </div>` : ""}
          <div class="detail-row">
            <span class="detail-label-en">Received By</span>
            <span class="detail-value">${payment.created_by_name || "-"}</span>
            <span class="detail-label-ar">استلمها</span>
          </div>
        </div>

        <!-- ══ Invoice Context ══ -->
        <div class="invoice-context">
          <div class="context-title">
            <span>Invoice Summary</span>
            <span style="direction:rtl;">ملخص الفاتورة</span>
          </div>
          <table class="context-table">
            <tr>
              <td class="c-en">Total Invoice</td>
              <td class="c-val">${fmtAmount(invoice?.total_amount)} AED</td>
              <td class="c-ar">إجمالي الفاتورة</td>
            </tr>
            <tr>
              <td class="c-en" style="color:#059669;">Total Paid</td>
              <td class="c-val" style="color:#059669;">${fmtAmount(invoice?.paid_amount)} AED</td>
              <td class="c-ar" style="color:#059669;">إجمالي المدفوع</td>
            </tr>
            ${parseFloat(invoice?.payment_due_amount || 0) > 0 ? `
            <tr class="c-due">
              <td class="c-en">Balance Due</td>
              <td class="c-val">${fmtAmount(invoice.payment_due_amount)} AED</td>
              <td class="c-ar">المبلغ المتبقي</td>
            </tr>` : `
            <tr>
              <td class="c-en" style="color:#059669; font-weight:700;">Fully Paid</td>
              <td class="c-val" style="color:#059669;">✓</td>
              <td class="c-ar" style="color:#059669; font-weight:700;">مدفوعة بالكامل</td>
            </tr>`}
          </table>
        </div>

        ${payment.notes ? `
        <div class="notes-box">
          <div class="notes-header">
            <span>Notes</span>
            <span style="direction:rtl;">ملاحظات</span>
          </div>
          ${payment.notes}
        </div>` : ""}

        <!-- ══ Signature ══ -->
        <div class="sig-row">
          <div class="sig-block">
            <div class="sig-line">Received by / المستلم</div>
          </div>
          <div class="sig-block">
            <div class="sig-line">Customer / العميل</div>
          </div>
        </div>

        <!-- ══ Footer ══ -->
        <div class="footer">
          <div class="footer-left">
            ${companyCR ? `<div><strong>CR:</strong> ${companyCR}</div>` : ""}
            ${companyVAT ? `<div><strong>VAT:</strong> ${companyVAT}</div>` : ""}
            ${companyNameEn ? `<div>${companyNameEn}</div>` : ""}
          </div>
          <div class="footer-right">
            ${companyCR ? `<div><strong>السجل التجاري:</strong> ${companyCR}</div>` : ""}
            ${companyVAT ? `<div><strong>الرقم الضريبي:</strong> ${companyVAT}</div>` : ""}
            ${companyNameAr ? `<div>${companyNameAr}</div>` : ""}
          </div>
        </div>
        <div class="footer-center">Electronically generated / تم إنشاؤها إلكترونياً</div>

      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}
