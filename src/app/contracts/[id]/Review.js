import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, Car, User, Calendar, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

function CompactRentalContract({
  client = {
    name: "أحمد محمد علي",
    phone: "0501234567",
    idNumber: "1234567890"
  },
  vehicle = {
    type: "تويوتا كامري",
    model: "2022",
    plateNumber: "Dubai 1234"
  },
  rental = {
    startDate: "2025-07-28",
    endDate: "2025-08-05",
    duration: "8 أيام"
  },
  payment = {
    insurance: 1000,
    total: 2500,
    paid: 1500,
    remaining: 1000
  },
  contract = {
    number: "CN20250728001"
  }
}) {
  const contractRef = useRef(null);

  const handlePrint = () => {
    const printContent = contractRef.current;
    const printWindow = window.open('', '_blank');
    
    const printStyles = `
      <style>
        @page {
          margin: 0.4in;
          size: A4;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 10px;
          line-height: 1.2;
          color: #333;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 3px;
        }
        .contract-title {
          font-size: 14px;
          font-weight: bold;
          margin: 8px 0;
        }
        .section {
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 11px;
          font-weight: bold;
          color: #1e40af;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 2px;
          margin-bottom: 6px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          padding: 2px 0;
        }
        .label { font-weight: 600; color: #4b5563; }
        .value { font-weight: bold; color: #111827; }
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 6px;
          margin: 8px 0;
        }
        .payment-box {
          background: #f9fafb;
          padding: 6px;
          border-radius: 4px;
          text-align: center;
          border: 1px solid #e5e7eb;
        }
        .payment-label {
          font-size: 8px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .payment-value {
          font-size: 10px;
          font-weight: bold;
        }
        .paid { color: #059669; }
        .pending { color: #dc2626; }
        .terms {
          background: #f9fafb;
          padding: 8px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .terms ul {
          margin: 4px 0;
          padding-right: 12px;
        }
        .terms li {
          margin-bottom: 2px;
          font-size: 8px;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .signature {
          text-align: center;
          width: 120px;
        }
        .signature-line {
          border-top: 1px solid #374151;
          margin-bottom: 4px;
          padding-top: 15px;
        }
        .signature-text {
          font-size: 9px;
          font-weight: bold;
        }
        .footer {
          margin-top: 15px;
          text-align: center;
          font-size: 7px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
        }
        .rental-period {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          padding: 8px;
          border-radius: 6px;
          margin: 8px 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          text-align: center;
        }
        .date-box {
          background: white;
          padding: 4px;
          border-radius: 4px;
          border: 1px solid #93c5fd;
        }
        .date-label {
          font-size: 7px;
          color: #1e40af;
          margin-bottom: 1px;
        }
        .date-value {
          font-size: 9px;
          font-weight: bold;
          color: #1e40af;
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>عقد تأجير - ${contract.number}</title>
          ${printStyles}
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Print Button */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold">شركة الملا لتأجير السيارات</h1>
                <p className="text-sm text-gray-500">دولة الإمارات العربية المتحدة - دبي</p>
              </div>
            </div>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              طباعة
            </Button>
          </div>
        </div>

        {/* A4 Contract */}
        <Card className="shadow-lg border-0 overflow-hidden" style={{ width: '210mm', minHeight: '297mm' }}>
          <div ref={contractRef} className="p-6 bg-white" style={{ fontSize: '12px' }}>
            
            {/* Header */}
            <div className="header text-center border-b-2 border-blue-600 pb-3 mb-4">
              <div className="company-name text-2xl font-bold text-blue-800 mb-1">شركة الملا لتأجير السيارات</div>
              <p className="text-xs text-gray-600 mb-2">دولة الإمارات العربية المتحدة - دبي</p>
              <div className="contract-title bg-blue-50 inline-block px-4 py-1 rounded text-blue-800">
                عقد تأجير رقم: {contract.number}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div>
                {/* Client Info */}
                <div className="section">
                  <div className="section-title flex items-center gap-1">
                    <User className="w-3 h-3" />
                    معلومات العميل
                  </div>
                  <div className="space-y-1">
                    <div className="info-item">
                      <span className="label">الاسم:</span>
                      <span className="value">{client.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">الجوال:</span>
                      <span className="value">{client.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">الهوية:</span>
                      <span className="value">{client.idNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="section">
                  <div className="section-title flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    معلومات المركبة
                  </div>
                  <div className="space-y-1">
                    <div className="info-item">
                      <span className="label">النوع:</span>
                      <span className="value">{vehicle.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">الموديل:</span>
                      <span className="value">{vehicle.model}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">اللوحة:</span>
                      <span className="value bg-blue-50 px-2 py-1 rounded text-xs">{vehicle.plateNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Rental Period */}
                <div className="section">
                  <div className="section-title flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    فترة التأجير
                  </div>
                  <div className="rental-period bg-blue-50 p-3 rounded-lg grid grid-cols-3 gap-2 text-center">
                    <div className="date-box bg-white p-2 rounded border border-blue-200">
                      <div className="date-label text-xs text-blue-600">البداية</div>
                      <div className="date-value text-sm font-bold text-blue-800">{rental.startDate}</div>
                    </div>
                    <div className="date-box bg-white p-2 rounded border border-blue-200">
                      <div className="date-label text-xs text-blue-600">النهاية</div>
                      <div className="date-value text-sm font-bold text-blue-800">{rental.endDate}</div>
                    </div>
                    <div className="date-box bg-white p-2 rounded border border-green-200">
                      <div className="date-label text-xs text-green-600">المدة</div>
                      <div className="date-value text-sm font-bold text-green-600">{rental.duration}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="section">
                  <div className="section-title flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    البيانات المالية
                  </div>
                  <div className="payment-grid grid grid-cols-2 gap-3">
                    <div className="payment-box bg-blue-50 p-3 rounded text-center border border-blue-200">
                      <div className="payment-label text-xs text-blue-600">التأمين</div>
                      <div className="payment-value text-sm font-bold text-blue-800">{payment.insurance.toLocaleString()}</div>
                    </div>
                    <div className="payment-box bg-gray-50 p-3 rounded text-center border">
                      <div className="payment-label text-xs text-gray-600">الإجمالي</div>
                      <div className="payment-value text-sm font-bold">{payment.total.toLocaleString()}</div>
                    </div>
                    <div className="payment-box bg-green-50 p-3 rounded text-center border border-green-200">
                      <div className="payment-label text-xs text-green-600">مدفوع</div>
                      <div className="payment-value text-sm font-bold text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {payment.paid.toLocaleString()}
                      </div>
                    </div>
                    <div className="payment-box bg-red-50 p-3 rounded text-center border border-red-200">
                      <div className="payment-label text-xs text-red-600">متبقي</div>
                      <div className="payment-value text-sm font-bold text-red-600 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {payment.remaining.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms - Full Width */}
            <div className="terms bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-sm mb-2 text-gray-800">الشروط والأحكام:</h4>
              <div className="grid grid-cols-2 gap-4">
                <ul className="list-disc pr-4 space-y-1 text-xs text-gray-700">
                  <li>إعادة المركبة بحالتها الأصلية في الموعد المحدد</li>
                  <li>خصم التلفيات من مبلغ التأمين</li>
                  <li>غرامة التأخير 200 ريال/يوم</li>
                  <li>منع التدخين - غرامة 500 ريال</li>
                </ul>
                <ul className="list-disc pr-4 space-y-1 text-xs text-gray-700">
                  <li>إرجاع المركبة بنفس مستوى الوقود</li>
                  <li>عدم التأجير لطرف ثالث</li>
                  <li>الاتصال فوراً عند التعطل</li>
                  <li>الالتزام بأنظمة المرور الإماراتية</li>
                </ul>
              </div>
            </div>

            {/* Signatures */}
            <div className="signatures flex justify-between mt-6">
              <div className="signature text-center">
                <div className="signature-line w-32 border-t border-gray-400 mb-2" style={{ height: '40px' }}></div>
                <div className="signature-text text-xs font-bold">توقيع العميل</div>
                <div className="text-xs text-gray-500">{client.name}</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  {/* ختم الشركة */}
<img src="/4635-11670.png" alt="ختم الشركة" className="w-16 h-16" />                </div>
              </div>
              
              <div className="signature text-center">
                <div className="signature-line w-32 border-t border-gray-400 mb-2" style={{ height: '40px' }}></div>
                <div className="signature-text text-xs font-bold">توقيع المسؤول</div>
                <div className="text-xs text-gray-500">شركة الملا</div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer text-center text-xs text-gray-500 border-t border-gray-200 pt-3 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</div>
                <div>الهاتف: 04-1234567</div>
                <div>البريد: info@almulla-rental.ae</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CompactRentalContract;