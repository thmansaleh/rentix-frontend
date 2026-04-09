import { formatAmount, formatDateShort } from "../invoices/utils/formatters";
import { getPaymentById } from "../../services/api/payments";
import { getTenantSettings } from "../../services/api/tenantSettings";

/**
 * Bilingual payment method labels.
 */
function getPaymentMethodBilingual(method) {
  const methods = {
    cash:          { en: "Cash",          ar: "نقداً"       },
    card:          { en: "Card",          ar: "بطاقة"       },
    bank_transfer: { en: "Bank Transfer", ar: "تحويل بنكي"  },
    online:        { en: "Online",        ar: "أونلاين"     },
    wallet:        { en: "Wallet",        ar: "محفظة"       },
    cheque:        { en: "Cheque",        ar: "شيك"         },
  };
  return methods[method] || { en: method, ar: method };
}

/**
 * Fetch data and open a new window to print a bilingual payment receipt.
 * Only requires the payment ID — fetches payment, invoice, and company info internally.
 *
 * @param {number|string} paymentId
 */
export async function printPaymentReceipt(paymentId) {
  const [paymentRes, settingsRes] = await Promise.all([
    getPaymentById(paymentId),
    getTenantSettings(),
  ]);

  const payment = paymentRes?.data;
  if (!payment) return;

  const companySettings = settingsRes?.data || null;

  // Build invoice summary from the enriched payment fields
  const invoice = {
    invoice_number:       payment.invoice_number,
    customer_name:        payment.customer_name,
    customer_phone:       payment.customer_phone,
    total_amount:         payment.invoice_total_amount,
    paid_amount:          payment.invoice_paid_amount,
    payment_due_amount:   payment.invoice_payment_due_amount,
  };

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  /* ── Company info ── */
  const companyNameAr   = companySettings?.company_name_ar   || "";
  const companyNameEn   = companySettings?.company_name_en   || "";
  const logoUrl         = companySettings?.logo_url          || "";
  const companyPhone    = companySettings?.phone             || "";
  const companyEmail    = companySettings?.email             || "";
  const companyAddressAr = companySettings?.address_ar       || "";
  const companyAddressEn = companySettings?.address_en       || "";
  const companyCR       = companySettings?.commercial_register || "";
  const companyVAT      = companySettings?.vat_number        || "";

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" class="logo" />`
    : "";

  const methodLabels = getPaymentMethodBilingual(payment.payment_method);
  const fmtAmount    = (val) => formatAmount(val, "en");
  const isDue        = parseFloat(invoice?.payment_due_amount || 0) > 0;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt #${payment.id}</title>
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Base ── */
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #000;
      background: #fff;
      font-size: 12px;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 560px;
      margin: 0 auto;
      padding: 32px 36px;
    }

    /* ── Outer border ── */
    .receipt-border {
      border: 2px solid #000;
      padding: 24px 28px;
    }

    /* ══ HEADER ══ */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 14px;
      border-bottom: 3px double #000;
      margin-bottom: 16px;
    }
    .logo {
      max-height: 52px;
      max-width: 140px;
      object-fit: contain;
      display: block;
      margin-bottom: 6px;
    }
    .co-name-en {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .co-name-ar {
      font-size: 15px;
      font-weight: 700;
      direction: rtl;
    }
    .co-sub {
      font-size: 9.5px;
      color: #444;
      margin-top: 3px;
      line-height: 1.7;
    }
    .header-right {
      text-align: right;
      direction: rtl;
    }

    /* ══ TITLE BAND ══ */
    .title-band {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 2px solid #000;
      padding: 9px 18px;
      margin-bottom: 16px;
      background: #000;        /* solid black — prints as solid black on B&W */
      color: #fff;
    }
    .title-en {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-family: 'Arial', sans-serif;
    }
    .title-ar {
      font-size: 17px;
      font-weight: 700;
      direction: rtl;
      font-family: 'Arial', sans-serif;
    }

    /* ══ META ROW (Receipt # / Date / Invoice) ══ */
    .meta-row {
      display: flex;
      justify-content: space-between;
      border: 1px solid #000;
      margin-bottom: 16px;
    }
    .meta-cell {
      flex: 1;
      padding: 8px 12px;
      border-right: 1px solid #000;
    }
    .meta-cell:last-child { border-right: none; }
    .meta-cell.center { text-align: center; }
    .meta-cell.right  { text-align: right; direction: rtl; }
    .meta-label {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #555;
      display: block;
      margin-bottom: 2px;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 700;
      color: #000;
    }

    /* ══ AMOUNT BOX ══ */
    .amount-box {
      border: 2px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      margin-bottom: 16px;
    }
    .amount-label-wrap {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .amount-label-en {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .amount-label-ar {
      font-size: 10.5px;
      font-weight: 700;
      direction: rtl;
    }
    .amount-value {
      font-size: 26px;
      font-weight: 700;
      font-family: 'Arial', 'Helvetica', sans-serif;
      letter-spacing: 0.5px;
      border-bottom: 3px solid #000;
      padding-bottom: 2px;
    }

    /* ══ DETAIL TABLE ══ */
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .detail-table tr {
      border-bottom: 1px solid #ccc;
    }
    .detail-table tr:last-child { border-bottom: none; }
    .detail-table tr:nth-child(even) td { background: #f5f5f5; }
    .detail-table td {
      padding: 8px 12px;
      vertical-align: middle;
    }
    .td-en {
      font-size: 11px;
      color: #333;
      font-weight: 600;
      width: 33%;
    }
    .td-val {
      font-size: 12px;
      font-weight: 700;
      color: #000;
      text-align: center;
      width: 34%;
    }
    .td-ar {
      font-size: 11px;
      color: #555;
      font-weight: 600;
      text-align: right;
      direction: rtl;
      width: 33%;
    }
    .detail-outer {
      border: 1px solid #000;
      margin-bottom: 16px;
    }

    /* ══ INVOICE SUMMARY ══ */
    .summary-wrap {
      margin-bottom: 16px;
    }
    .summary-title {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin-bottom: 0;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      border-top: none;
    }
    .summary-table td {
      padding: 7px 12px;
      font-size: 11.5px;
      vertical-align: middle;
    }
    .summary-table tr { border-bottom: 1px solid #ddd; }
    .summary-table tr:last-child { border-bottom: none; }
    .summary-table .s-en  { color: #333; font-weight: 600; }
    .summary-table .s-val {
      text-align: center;
      font-weight: 700;
      font-family: 'Arial', sans-serif;
      white-space: nowrap;
    }
    .summary-table .s-ar  {
      text-align: right;
      direction: rtl;
      color: #555;
      font-weight: 600;
    }
    /* Due row – hatched background via repeating gradient (prints B&W fine) */
    .row-due td {
      background: repeating-linear-gradient(
        45deg,
        #fff,
        #fff 4px,
        #eee 4px,
        #eee 8px
      );
      font-weight: 700;
    }
    /* Paid row – light grey */
    .row-paid td { background: #f0f0f0; font-weight: 700; }

    /* ══ NOTES ══ */
    .notes-box {
      border: 1px dashed #000;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 11px;
    }
    .notes-title {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      margin-bottom: 5px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }
    .notes-text { color: #222; }

    /* ══ SIGNATURE ══ */
    .sig-row {
      display: flex;
      justify-content: space-between;
      gap: 48px;
      margin: 28px 0 20px;
    }
    .sig-block {
      flex: 1;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #000;
      margin-top: 40px;
      padding-top: 5px;
      font-size: 10px;
      color: #444;
    }

    /* ══ TEAR LINE ══ */
    .tear-line {
      border: none;
      border-top: 1.5px dashed #999;
      margin: 20px 0 16px;
    }

    /* ══ FOOTER ══ */
    .footer {
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #444;
      line-height: 1.8;
    }
    .footer-right { text-align: right; direction: rtl; }
    .footer strong { color: #000; }
    .generated-note {
      text-align: center;
      font-size: 8.5px;
      color: #888;
      margin-top: 10px;
      letter-spacing: 0.4px;
    }

    /* ══ PRINT RULES ══ */
    @media print {
      body { padding: 0; }
      .page { padding: 0; max-width: 100%; }
    }
    @page {
      margin: 8mm;
      size: A5 portrait;
    }
  </style>
</head>
<body>
<div class="page">
<div class="receipt-border">

  <!-- ══ HEADER ══ -->
  <div class="header">
    <div class="header-left">
      ${logoHtml}
      ${companyNameEn ? `<div class="co-name-en">${companyNameEn}</div>` : ""}
      <div class="co-sub">
        ${companyPhone    ? `Tel: ${companyPhone}<br/>`  : ""}
        ${companyEmail    ? `${companyEmail}<br/>`       : ""}
        ${companyAddressEn ? `${companyAddressEn}`       : ""}
      </div>
    </div>
    <div class="header-right">
      ${companyNameAr ? `<div class="co-name-ar">${companyNameAr}</div>` : ""}
      <div class="co-sub" style="direction:rtl; text-align:right;">
        ${companyPhone     ? `هاتف: ${companyPhone}<br/>` : ""}
        ${companyEmail     ? `${companyEmail}<br/>`        : ""}
        ${companyAddressAr ? `${companyAddressAr}`         : ""}
      </div>
    </div>
  </div>

  <!-- ══ TITLE ══ -->
  <div class="title-band">
    <span class="title-en">Payment Receipt</span>
    <span class="title-ar">إيصال دفع</span>
  </div>

  <!-- ══ META ROW ══ -->
  <div class="meta-row">
    <div class="meta-cell">
      <span class="meta-label">Receipt No. / رقم الإيصال</span>
      <span class="meta-value">#${payment.id}</span>
    </div>
    <div class="meta-cell center">
      <span class="meta-label">Date / التاريخ</span>
      <span class="meta-value">${formatDateShort(payment.payment_date)}</span>
    </div>
    <div class="meta-cell right">
      <span class="meta-label">Invoice / الفاتورة</span>
      <span class="meta-value">${invoice?.invoice_number || "-"}</span>
    </div>
  </div>

  <!-- ══ AMOUNT HIGHLIGHT ══ -->
  <div class="amount-box">
    <div class="amount-label-wrap">
      <span class="amount-label-en">Amount Paid</span>
      <span class="amount-label-ar">المبلغ المدفوع</span>
    </div>
    <span class="amount-value">${fmtAmount(payment.amount)} AED</span>
  </div>

  <!-- ══ PAYMENT DETAILS ══ -->
  <div class="detail-outer">
    <table class="detail-table">
      <tr>
        <td class="td-en">Customer</td>
        <td class="td-val">${invoice?.customer_name || "-"}</td>
        <td class="td-ar">العميل</td>
      </tr>
      ${invoice?.customer_phone ? `
      <tr>
        <td class="td-en">Phone</td>
        <td class="td-val">${invoice.customer_phone}</td>
        <td class="td-ar">الهاتف</td>
      </tr>` : ""}
      <tr>
        <td class="td-en">Payment Method</td>
        <td class="td-val">${methodLabels.en} / ${methodLabels.ar}</td>
        <td class="td-ar">طريقة الدفع</td>
      </tr>
      ${payment.reference_number ? `
      <tr>
        <td class="td-en">Reference #</td>
        <td class="td-val">${payment.reference_number}</td>
        <td class="td-ar">رقم المرجع</td>
      </tr>` : ""}
      ${payment.account_bank_name ? `
      <tr>
        <td class="td-en">Bank Account</td>
        <td class="td-val">${payment.account_bank_name} - ${payment.account_name || ""} (${payment.account_number || ""})</td>
        <td class="td-ar">الحساب البنكي</td>
      </tr>` : ""}
      <tr>
        <td class="td-en">Received By</td>
        <td class="td-val">${payment.created_by_name || "-"}</td>
        <td class="td-ar">استلمها</td>
      </tr>
    </table>
  </div>

  <!-- ══ INVOICE SUMMARY ══ -->
  <div class="summary-wrap">
    <div class="summary-title">
      <span>Invoice Summary</span>
      <span style="direction:rtl;">ملخص الفاتورة</span>
    </div>
    <table class="summary-table">
      <tr>
        <td class="s-en">Total Invoice</td>
        <td class="s-val">${fmtAmount(invoice?.total_amount)} AED</td>
        <td class="s-ar">إجمالي الفاتورة</td>
      </tr>
      <tr>
        <td class="s-en">Total Paid</td>
        <td class="s-val">${fmtAmount(invoice?.paid_amount)} AED</td>
        <td class="s-ar">إجمالي المدفوع</td>
      </tr>
      ${isDue ? `
      <tr class="row-due">
        <td class="s-en">Balance Due</td>
        <td class="s-val">${fmtAmount(invoice.payment_due_amount)} AED</td>
        <td class="s-ar">المبلغ المتبقي</td>
      </tr>` : `
      <tr class="row-paid">
        <td class="s-en">✓ Fully Paid</td>
        <td class="s-val">—</td>
        <td class="s-ar">مدفوعة بالكامل ✓</td>
      </tr>`}
    </table>
  </div>

  ${payment.notes ? `
  <!-- ══ NOTES ══ -->
  <div class="notes-box">
    <div class="notes-title">
      <span>Notes</span>
      <span style="direction:rtl;">ملاحظات</span>
    </div>
    <div class="notes-text">${payment.notes}</div>
  </div>` : ""}

  <!-- ══ SIGNATURE ══ -->
  <div class="sig-row">
    <div class="sig-block">
      <div class="sig-line">Received by / المستلم</div>
    </div>
    <div class="sig-block">
      <div class="sig-line">Customer / العميل</div>
    </div>
  </div>

  <!-- ══ TEAR LINE ══ -->
  <hr class="tear-line" />

  <!-- ══ FOOTER ══ -->
  <div class="footer">
    <div class="footer-left">
      ${companyCR      ? `<div><strong>CR:</strong> ${companyCR}</div>`    : ""}
      ${companyVAT     ? `<div><strong>VAT:</strong> ${companyVAT}</div>`  : ""}
      ${companyNameEn  ? `<div>${companyNameEn}</div>`                     : ""}
    </div>
    <div class="footer-right">
      ${companyCR      ? `<div><strong>السجل التجاري:</strong> ${companyCR}</div>` : ""}
      ${companyVAT     ? `<div><strong>الرقم الضريبي:</strong> ${companyVAT}</div>` : ""}
      ${companyNameAr  ? `<div>${companyNameAr}</div>`                              : ""}
    </div>
  </div>
  <div class="generated-note">Electronically generated · تم إنشاؤها إلكترونياً</div>

</div><!-- /receipt-border -->
</div><!-- /page -->
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}