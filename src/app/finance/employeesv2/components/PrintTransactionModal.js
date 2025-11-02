'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { Printer, X } from 'lucide-react';
import { getEmployeeCashTransactionById } from '@/app/services/api/employeeCashTransactions';
import { toast } from 'react-toastify';

const PrintTransactionModal = ({ isOpen, onClose, transactionId }) => {
  const { isRTL } = useLanguage();
  const t = useTranslations('employeeFinance.printModal');
  const printRef = useRef();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !isOpen) return;
      
      setLoading(true);
      try {
        const response = await getEmployeeCashTransactionById(transactionId);
        if (response.success) {
          setTransaction(response.data);
        } else {
          toast.error('حدث خطأ في تحميل بيانات العهدة');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        toast.error('حدث خطأ في تحميل بيانات العهدة');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=800,height=600');
    
    windowPrint.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>سند استلام عهدة</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', 'Segoe UI', Tahoma, sans-serif;
            padding: 40px;
            background: white;
            direction: rtl;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 30px;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          
          .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-top: 15px;
            text-decoration: underline;
          }
          
          .document-number {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
          
          .content {
            margin: 30px 0;
            line-height: 2;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-right: 4px solid #2563eb;
          }
          
          .info-label {
            font-weight: bold;
            color: #333;
            min-width: 150px;
          }
          
          .info-value {
            color: #000;
            flex: 1;
            text-align: right;
          }
          
          .amount-box {
            text-align: center;
            padding: 25px;
            background: #f0f9ff;
            border: 3px solid #2563eb;
            border-radius: 10px;
            margin: 30px 0;
          }
          
          .amount-label {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .amount-value {
            font-size: 36px;
            font-weight: bold;
            color: #16a34a;
          }
          
          .description-box {
            margin: 25px 0;
            padding: 20px;
            border: 2px dashed #ccc;
            background: #fafafa;
            min-height: 100px;
          }
          
          .description-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          
          .description-text {
            color: #555;
            white-space: pre-wrap;
            line-height: 1.8;
          }
          
          .signatures {
            margin-top: 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          
          .signature-block {
            border-top: 2px solid #000;
            padding-top: 80px;
            text-align: center;
          }
          
          .signature-label {
            font-weight: bold;
            font-size: 16px;
            color: #000;
          }
          
          .signature-date {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #000;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .notes {
            margin-top: 30px;
            padding: 15px;
            background: #fff3cd;
            border-right: 4px solid #ffc107;
            font-size: 13px;
            color: #856404;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            .container {
              border: none;
            }
            
            @page {
              margin: 20mm;
            }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    
    windowPrint.document.close();
    windowPrint.focus();
    
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-800" dir="rtl">{t('title')}</h2>
            <div className="flex gap-3">
              <Button 
                onClick={handlePrint} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="h-4 w-4" />
                {t('print')}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('close')}
              </Button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <span className="mr-3 text-lg">{t('loading')}</span>
              </div>
            ) : transaction ? (
              <div ref={printRef} className="bg-white shadow-lg" dir="rtl">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid #000', padding: '30px' }}>
            {/* Header */}
            <div className="header" style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '20px', marginBottom: '30px' }}>
              <div className="company-name" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '10px' }}>
                مكتب محمد بن هاشم للمحاماة والاستشارات القانونية
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Law Office - Legal Services & Consultations
              </div>
              <div className="document-title" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '15px', textDecoration: 'underline' }}>
                سند استلام عهدة
              </div>
              <div className="document-number" style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                رقم السند: #{transaction.id}
              </div>
            </div>

            {/* Content */}
            <div className="content" style={{ margin: '30px 0', lineHeight: '2' }}>
              {/* Employee Info */}
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRight: '4px solid #2563eb' }}>
                <span className="info-label" style={{ fontWeight: 'bold', color: '#333', minWidth: '150px' }}>اسم الموظف:</span>
                <span className="info-value" style={{ color: '#000', flex: '1', textAlign: 'right' }}>{transaction.employee_name || '-'}</span>
              </div>

              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRight: '4px solid #2563eb' }}>
                <span className="info-label" style={{ fontWeight: 'bold', color: '#333', minWidth: '150px' }}>رقم الهاتف:</span>
                <span className="info-value" style={{ color: '#000', flex: '1', textAlign: 'right' }}>{transaction.employee_phone || '-'}</span>
              </div>

              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRight: '4px solid #2563eb' }}>
                <span className="info-label" style={{ fontWeight: 'bold', color: '#333', minWidth: '150px' }}>التاريخ:</span>
                <span className="info-value" style={{ color: '#000', flex: '1', textAlign: 'right' }}>{formatDate(transaction.created_at)}</span>
              </div>

              {/* Amount Box */}
              <div className="amount-box" style={{ textAlign: 'center', padding: '25px', background: '#f0f9ff', border: '3px solid #2563eb', borderRadius: '10px', margin: '30px 0' }}>
                <div className="amount-label" style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                  المبلغ المستلم
                </div>
                <div className="amount-value" style={{ fontSize: '36px', fontWeight: 'bold', color: '#16a34a' }}>
                  {formatCurrency(transaction.amount)}
                </div>
              </div>

              {/* Description */}
              {transaction.description && (
                <div className="description-box" style={{ margin: '25px 0', padding: '20px', border: '2px dashed #ccc', background: '#fafafa', minHeight: '100px' }}>
                  <div className="description-label" style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                    الوصف / الغرض من العهدة:
                  </div>
                  <div className="description-text" style={{ color: '#555', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                    {transaction.description}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="notes" style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRight: '4px solid #ffc107', fontSize: '13px', color: '#856404' }}>
                <strong>ملاحظة:</strong> أقر أنا الموقع أدناه بأنني استلمت المبلغ المذكور أعلاه بالكامل وأتعهد بإعادته أو تبرير استخدامه حسب الأنظمة واللوائح المعمول بها في المكتب.
              </div>

              {/* Signatures */}
              <div className="signatures" style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div className="signature-block" style={{ borderTop: '2px solid #000', paddingTop: '80px', textAlign: 'center' }}>
                  <div className="signature-label" style={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                    توقيع المستلم
                  </div>
                  <div className="signature-date" style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    التاريخ: _______________
                  </div>
                </div>
                <div className="signature-block" style={{ borderTop: '2px solid #000', paddingTop: '80px', textAlign: 'center' }}>
                  <div className="signature-label" style={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                    توقيع المسؤول
                  </div>
                  <div className="signature-date" style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    الاسم: {transaction.created_by_name || '_______________'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer" style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2px solid #000', textAlign: 'center', color: '#666', fontSize: '12px' }}>
              <div>هذا المستند صادر إلكترونياً من نظام إدارة المكتب</div>
              <div style={{ marginTop: '5px' }}>تم الإنشاء بتاريخ: {formatDate(new Date().toISOString())}</div>
              </div>
            </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {t('noData')}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintTransactionModal;
