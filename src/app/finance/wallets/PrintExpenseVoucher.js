/**
 * Print Expense Voucher (سند صرف)
 * Generates a printable voucher for wallet expenses
 */

export function printExpenseVoucher(expense, walletInfo) {
  const printWindow = window.open('', '', 'width=800,height=600');
  
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getExpenseTypeText = (type) => {
    const types = {
      court_fees: 'رسوم محكمة / Court Fees',
      travel: 'سفر / Travel',
      consultation: 'استشارة / Consultation',
      documentation: 'توثيق / Documentation',
      translation: 'ترجمة / Translation',
      expert_fees: 'أتعاب خبير / Expert Fees',
      other: 'أخرى / Other'
    };
    return types[type] || types.other;
  };

  const voucherHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>سند صرف - ${expense.id}</title>
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
        .voucher {
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
        .voucher-info {
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
          background: #fff5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          text-align: center;
          border: 2px solid #fee;
        }
        .amount-section .label {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .amount-section .amount {
          font-size: 36px;
          font-weight: bold;
          color: #c53030;
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
        .employee-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .employee-section h3 {
          margin-bottom: 15px;
          color: #1f2937;
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
      <div class="voucher">
        <div class="header">
          <h1>سند صرف</h1>
          <h2>Payment Voucher</h2>
        </div>

        <div class="voucher-info">
          <div>
            <div class="info-item">
              <span class="info-label">رقم السند:</span>
              <span>#${expense.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">التاريخ:</span>
              <span>${formatDate(expense.created_at)}</span>
            </div>
            ${expense.invoice_number ? `
            <div class="info-item">
              <span class="info-label">رقم الفاتورة:</span>
              <span>${expense.invoice_number}</span>
            </div>
            ` : ''}
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">اسم العميل:</span>
              <span>${walletInfo?.client_name || '-'}</span>
            </div>
            ${expense.file_number ? `
            <div class="info-item">
              <span class="info-label">رقم الملف:</span>
              <span>${expense.file_number}</span>
            </div>
            ` : ''}
            ${expense.invoice_date ? `
            <div class="info-item">
              <span class="info-label">تاريخ الفاتورة:</span>
              <span>${formatDate(expense.invoice_date)}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="employee-section">
          <h3>معلومات الموظف المستلم / Employee Information</h3>
          <div class="info-item">
            <span class="info-label">اسم الموظف:</span>
            <span style="font-size: 18px; font-weight: bold;">${expense.employee_name || '-'}</span>
          </div>
        </div>

        <div class="amount-section">
          <div class="label">المبلغ المصروف / Amount Paid</div>
          <div class="amount">${formatAmount(expense.amount, walletInfo?.currency)}</div>
        </div>

        <div class="details-section">
          <div class="details-row">
            <span><strong>نوع المصروف:</strong></span>
            <span>${getExpenseTypeText(expense.expense_type)}</span>
          </div>
          ${expense.description ? `
          <div class="details-row">
            <span><strong>الوصف:</strong></span>
            <span>${expense.description}</span>
          </div>
          ` : ''}
          ${expense.notes ? `
          <div class="details-row">
            <span><strong>ملاحظات:</strong></span>
            <span>${expense.notes}</span>
          </div>
          ` : ''}
          <div class="details-row">
            <span><strong>أنشئ بواسطة:</strong></span>
            <span>${expense.created_by_name || '-'}</span>
          </div>
        </div>

        <div class="footer">
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">توقيع المحاسب</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">توقيع الموظف المستلم</div>
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
  
  printWindow.document.write(voucherHtml);
  printWindow.document.close();
  printWindow.focus();
}
