import { formatAmount, formatDateShort } from "../utils/formatters";
import { getStatusLabel, getInvoiceBranchName } from "../utils/helpers";

/**
 * Get status color configuration for the invoice badge.
 */
function getStatusColors(status) {
  switch (status) {
    case "paid":
      return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" };
    case "partial":
      return { bg: "#fffbeb", color: "#92400e", border: "#fde68a" };
    case "unpaid":
      return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
    default:
      return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
  }
}

/**
 * Get bilingual status labels.
 */
function getBilingualStatus(status) {
  const labels = {
    unpaid: { ar: "غير مدفوعة", en: "Unpaid" },
    partial: { ar: "مدفوعة جزئياً", en: "Partial" },
    paid: { ar: "مدفوعة", en: "Paid" },
  };
  return labels[status] || { ar: status, en: status };
}

/**
 * Open a new window and print a bilingual (Arabic + English) invoice.
 */
export function printInvoice(invoice, { isRTL, language, t, companySettings }) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Company names in both languages
  const companyNameAr = companySettings?.company_name_ar || "";
  const companyNameEn = companySettings?.company_name_en || "";
  const logoUrl = companySettings?.logo_url || "";
  const companyPhone = companySettings?.phone || "";
  const companyEmail = companySettings?.email || "";
  const companyAddressAr = companySettings?.address_ar || "";
  const companyAddressEn = companySettings?.address_en || "";
  const companyCR = companySettings?.commercial_register || "";
  const companyVAT = companySettings?.vat_number || "";
  const companyTRN = companySettings?.trn_number || "";

  const statusColors = getStatusColors(invoice.status);
  const bilingualStatus = getBilingualStatus(invoice.status);

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" style="max-height: 72px; max-width: 180px; object-fit: contain;" />`
    : "";

  // Branch names in both languages
  const branchNameAr = invoice.branch_name || "-";
  const branchNameEn = invoice.branch_name_en || invoice.branch_name || "-";

  const amountEN = (val) => formatAmount(val, "en");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Invoice / فاتورة - ${invoice.invoice_number}</title>
      <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          background: #fff;
          padding: 0;
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          max-width: 800px;
          margin: 0 auto;
          padding: 36px 44px;
        }

        /* ── Header ── */
        .header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 3px solid #111827;
          margin-bottom: 24px;
        }
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .header-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .header-right {
          text-align: right;
          direction: rtl;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .company-name-en {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }
        .company-name-ar {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          font-family: 'Segoe UI', Tahoma, 'Arial', sans-serif;
        }
        .company-sub {
          font-size: 10.5px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* ── Invoice Title Band ── */
        .title-band {
          background: #111827;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .title-band-en {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .title-band-ar {
          font-size: 22px;
          font-weight: 800;
          direction: rtl;
          font-family: 'Segoe UI', Tahoma, 'Arial', sans-serif;
        }

        /* ── Invoice Meta Row ── */
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #9ca3af;
        }
        .meta-label-ar {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          direction: rtl;
        }
        .meta-value {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 18px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: ${statusColors.bg};
          color: ${statusColors.color};
          border: 1.5px solid ${statusColors.border};
        }

        /* ── Info Cards ── */
        .cards-row {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }
        .info-card {
          flex: 1;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 18px 20px;
          min-width: 0;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .card-title-en {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: #6b7280;
        }
        .card-title-ar {
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          direction: rtl;
        }
        .card-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 5px 0;
          gap: 8px;
        }
        .card-row-label {
          font-size: 11.5px;
          color: #6b7280;
          white-space: nowrap;
        }
        .card-row-value {
          font-size: 12px;
          color: #111827;
          font-weight: 600;
          text-align: right;
        }
        .card-row-label-ar {
          font-size: 11.5px;
          color: #9ca3af;
          direction: rtl;
          white-space: nowrap;
        }
        .bilingual-label {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Divider ── */
        .divider {
          border: none;
          border-top: 1px dashed #d1d5db;
          margin: 4px 0 22px 0;
        }

        /* ── Summary Table ── */
        .summary-title {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e5e7eb;
        }
        .summary-title-en {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }
        .summary-title-ar {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          direction: rtl;
        }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        .summary-table td {
          padding: 10px 16px;
          font-size: 13px;
          vertical-align: middle;
        }
        .summary-table tr:nth-child(odd):not(.row-grand):not(.row-paid):not(.row-due) {
          background: #f9fafb;
        }
        .summary-table .label-en {
          color: #374151;
          font-weight: 500;
        }
        .summary-table .label-ar {
          color: #9ca3af;
          font-size: 12px;
          direction: rtl;
          text-align: right;
        }
        .summary-table .val-cell {
          text-align: center;
          color: #111827;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          width: 180px;
        }
        .summary-table .row-grand td {
          background: #111827;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 16px;
        }
        .summary-table .row-grand .label-en,
        .summary-table .row-grand .label-ar {
          color: #d1d5db;
        }
        .summary-table .row-grand .val-cell {
          color: #fff;
          font-size: 16px;
        }
        .summary-table .row-paid .label-en,
        .summary-table .row-paid .label-ar,
        .summary-table .row-paid .val-cell {
          color: #059669;
        }
        .summary-table .row-due .label-en,
        .summary-table .row-due .label-ar,
        .summary-table .row-due .val-cell {
          color: #dc2626;
          font-weight: 700;
        }

        /* ── Notes ── */
        .notes-box {
          margin-top: 22px;
          padding: 14px 18px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          font-size: 12px;
          color: #92400e;
        }
        .notes-box .notes-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 6px;
        }

        /* ── Footer ── */
        .footer {
          margin-top: 36px;
          padding-top: 16px;
          border-top: 1.5px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 10.5px;
          color: #9ca3af;
          line-height: 1.7;
        }
        .footer-left { text-align: left; }
        .footer-right { text-align: right; direction: rtl; }
        .footer strong { color: #6b7280; }
        .footer-center {
          text-align: center;
          font-size: 9.5px;
          color: #d1d5db;
          margin-top: 12px;
        }

        /* ── Print ── */
        @media print {
          body { padding: 0; }
          .page { padding: 20px 28px; max-width: 100%; }
          .no-print { display: none !important; }
        }
        @page {
          margin: 10mm 8mm;
          size: A4;
        }
      </style>
    </head>
    <body>
      <div class="page">

        <!-- ══ Header ══ -->
        <div class="header">
          <div class="header-left">
            ${companyNameEn ? `<div class="company-name-en">${companyNameEn}</div>` : ""}
            <div class="company-sub">
              ${companyPhone ? `Tel: ${companyPhone}<br/>` : ""}
              ${companyEmail ? `${companyEmail}<br/>` : ""}
              ${companyAddressEn ? `${companyAddressEn}<br/>` : ""}
              ${companyTRN ? `TRN: ${companyTRN}` : ""}
            </div>
          </div>
          <div class="header-center">
            ${logoHtml}
          </div>
          <div class="header-right">
            ${companyNameAr ? `<div class="company-name-ar">${companyNameAr}</div>` : ""}
            <div class="company-sub" style="direction:rtl; text-align:right;">
              ${companyPhone ? `هاتف: ${companyPhone}<br/>` : ""}
              ${companyEmail ? `${companyEmail}<br/>` : ""}
              ${companyAddressAr ? `${companyAddressAr}<br/>` : ""}
              ${companyTRN ? `الرقم الضريبي: ${companyTRN}` : ""}
            </div>
          </div>
        </div>

        <!-- ══ Title Band ══ -->
        <div class="title-band">
          <span class="title-band-en">INVOICE</span>
          <span class="title-band-ar">فاتورة</span>
        </div>

        <!-- ══ Invoice Meta ══ -->
        <div class="meta-row">
          <div class="meta-item">
            <span class="meta-label">Invoice No. / رقم الفاتورة</span>
            <span class="meta-value">${invoice.invoice_number}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Issue Date / تاريخ الإصدار</span>
            <span class="meta-value">${formatDateShort(invoice.issue_date)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Due Date / تاريخ الاستحقاق</span>
            <span class="meta-value">${formatDateShort(invoice.due_date)}</span>
          </div>
          <div class="meta-item">
            <span class="status-badge">${bilingualStatus.en} / ${bilingualStatus.ar}</span>
          </div>
        </div>

        <!-- ══ Info Cards ══ -->
        <div class="cards-row">
          <!-- Invoice Details -->
          <div class="info-card">
            <div class="card-header">
              <span class="card-title-en">Invoice Details</span>
              <span class="card-title-ar">تفاصيل الفاتورة</span>
            </div>
            <div class="card-row">
              <div class="bilingual-label">
                <span class="card-row-label">Branch</span>
                <span class="card-row-label-ar">الفرع</span>
              </div>
              <div style="text-align:right;">
                <div class="card-row-value">${branchNameEn}</div>
                ${branchNameAr !== branchNameEn ? `<div class="card-row-value" style="color:#6b7280; font-weight:500; direction:rtl;">${branchNameAr}</div>` : ""}
              </div>
            </div>
          </div>

          <!-- Bill To -->
          <div class="info-card">
            <div class="card-header">
              <span class="card-title-en">Bill To</span>
              <span class="card-title-ar">بيانات العميل</span>
            </div>
            <div class="card-row">
              <div class="bilingual-label">
                <span class="card-row-label">Customer</span>
                <span class="card-row-label-ar">العميل</span>
              </div>
              <span class="card-row-value">${invoice.customer_name || "-"}</span>
            </div>
            ${invoice.customer_phone ? `
            <div class="card-row">
              <div class="bilingual-label">
                <span class="card-row-label">Phone</span>
                <span class="card-row-label-ar">الهاتف</span>
              </div>
              <span class="card-row-value">${invoice.customer_phone}</span>
            </div>` : ""}
            ${invoice.customer_id_number ? `
            <div class="card-row">
              <div class="bilingual-label">
                <span class="card-row-label">ID Number</span>
                <span class="card-row-label-ar">رقم الهوية</span>
              </div>
              <span class="card-row-value">${invoice.customer_id_number}</span>
            </div>` : ""}
          </div>
        </div>

        <hr class="divider" />

        <!-- ══ Financial Summary ══ -->
        <div class="summary-title">
          <span class="summary-title-en">Financial Summary</span>
          <span class="summary-title-ar">الملخص المالي</span>
        </div>

        <table class="summary-table">
          <tr>
            <td class="label-en">Subtotal</td>
            <td class="val-cell">${amountEN(invoice.sub_total)} AED</td>
            <td class="label-ar">المجموع الفرعي</td>
          </tr>
          ${parseFloat(invoice.tax_amount || 0) > 0 ? `
          <tr>
            <td class="label-en">VAT / Tax</td>
            <td class="val-cell">+ ${amountEN(invoice.tax_amount)} AED</td>
            <td class="label-ar">ضريبة القيمة المضافة</td>
          </tr>` : ""}
          ${parseFloat(invoice.discount_amount || 0) > 0 ? `
          <tr>
            <td class="label-en">Discount</td>
            <td class="val-cell">- ${amountEN(invoice.discount_amount)} AED</td>
            <td class="label-ar">الخصم</td>
          </tr>` : ""}
          <tr class="row-grand">
            <td class="label-en">Total</td>
            <td class="val-cell">${amountEN(invoice.total_amount)} AED</td>
            <td class="label-ar">الإجمالي</td>
          </tr>
          <tr class="row-paid">
            <td class="label-en">Amount Paid</td>
            <td class="val-cell">${amountEN(invoice.paid_amount)} AED</td>
            <td class="label-ar">المبلغ المدفوع</td>
          </tr>
          ${parseFloat(invoice.payment_due_amount || 0) > 0 ? `
          <tr class="row-due">
            <td class="label-en">Balance Due</td>
            <td class="val-cell">${amountEN(invoice.payment_due_amount)} AED</td>
            <td class="label-ar">المبلغ المتبقي</td>
          </tr>` : ""}
        </table>

        ${invoice.notes ? `
        <div class="notes-box">
          <div class="notes-header">
            <span>Notes</span>
            <span style="direction:rtl;">ملاحظات</span>
          </div>
          ${invoice.notes}
        </div>` : ""}

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
