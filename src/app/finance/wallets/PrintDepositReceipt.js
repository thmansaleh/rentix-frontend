/**
 * Print Deposit Receipt (سند قبض)
 * Generates a printable receipt for wallet deposits
 */

export function printDepositReceipt(deposit, walletInfo) {
  const printWindow = window.open('', '', 'width=800,height=600');
  
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cash: 'نقدي / Cash',
      bank_transfer: 'تحويل بنكي / Bank Transfer',
      card: 'بطاقة / Card',
      cheque: 'شيك / Cheque',
      other: 'أخرى / Other'
    };
    return methods[method] || methods.cash;
  };

  const receiptHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>سند قبض - ${deposit.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          padding: 40px;
          background: white;
        }
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #000;
          padding: 30px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header h2 {
          font-size: 20px;
          color: #666;
        }
        .receipt-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
        .amount-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          text-align: center;
        }
        .amount-section .label {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .amount-section .amount {
          font-size: 36px;
          font-weight: bold;
          color: #2d5c2d;
        }
        .details-section {
          margin: 30px 0;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }
        .footer {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #000;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
        }
        .signature-box {
          text-align: center;
        }
        .signature-line {
          width: 200px;
          border-top: 1px solid #000;
          margin-top: 50px;
          padding-top: 10px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>سند قبض</h1>
          <h2>Receipt Voucher</h2>
        </div>

        <div class="receipt-info">
          <div>
            <div class="info-item">
              <span class="info-label">رقم السند:</span>
              <span>#${deposit.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">التاريخ:</span>
              <span>${formatDate(deposit.created_at)}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">اسم العميل:</span>
              <span>${walletInfo?.client_name || '-'}</span>
            </div>
            ${deposit.case_number ? `
            <div class="info-item">
              <span class="info-label">رقم القضية:</span>
              <span>${deposit.case_number}</span>
            </div>
            ` : ''}
            ${deposit.file_number ? `
            <div class="info-item">
              <span class="info-label">رقم الملف:</span>
              <span>${deposit.file_number}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="amount-section">
          <div class="label">المبلغ المستلم / Amount Received</div>
          <div class="amount">${formatAmount(deposit.amount, walletInfo?.currency)}</div>
        </div>

        <div class="details-section">
          <div class="details-row">
            <span><strong>طريقة الدفع:</strong></span>
            <span>${getPaymentMethodText(deposit.method)}</span>
          </div>
          ${deposit.bank_account_id ? `
          <div class="details-row">
            <span><strong>الحساب البنكي:</strong></span>
            <span>${deposit.bank_name} - ${deposit.account_number}</span>
          </div>
          ` : ''}
          ${deposit.reference_number ? `
          <div class="details-row">
            <span><strong>رقم المرجع:</strong></span>
            <span>${deposit.reference_number}</span>
          </div>
          ` : ''}
          ${deposit.notes ? `
          <div class="details-row">
            <span><strong>ملاحظات:</strong></span>
            <span>${deposit.notes}</span>
          </div>
          ` : ''}
          <div class="details-row">
            <span><strong>استلمه:</strong></span>
            <span>${deposit.created_by_name || '-'}</span>
          </div>
        </div>

        <div class="footer">
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">توقيع المستلم</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">توقيع العميل</div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 30px; font-size: 16px; cursor: pointer;">طباعة</button>
        <button onclick="window.close()" style="padding: 10px 30px; font-size: 16px; cursor: pointer; margin-right: 10px;">إغلاق</button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
  printWindow.focus();
}
