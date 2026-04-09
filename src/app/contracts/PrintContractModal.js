"use client";

import { useEffect, useState, useRef } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, X } from "lucide-react";
import { getContractById } from "../services/api/contracts";
import { getActiveRentalTerms } from "../services/api/rentalTerms";
import { getTenantSettings } from "../services/api/tenantSettings";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function PrintContractModal({ isOpen, onClose, contractId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [contract, setContract] = useState(null);
  const [rentalTerms, setRentalTerms] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (contractId && isOpen) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const contractData = await getContractById(contractId);
          setContract(contractData);
        } catch (error) {
          console.error("Error loading contract:", error);
        }
        try {
          const termsData = await getActiveRentalTerms();
          setRentalTerms(termsData?.data || []);
          console.log(termsData)
        } catch (error) {
          console.error("Error loading rental terms:", error);
          setRentalTerms([]);
        }
        try {
          const settingsData = await getTenantSettings();
          setCompanyInfo(settingsData?.data || null);
        } catch (error) {
          console.error("Error loading company settings:", error);
          setCompanyInfo(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [contractId, isOpen]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Contract</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
              font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
              font-size: 11px;
              color: #1a1a1a;
              background: white;
              line-height: 1.4;
            }

            @media print {
              @page { margin: 6mm; size: A4; }
              html, body { height: auto !important; overflow: visible !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }

            .contract-page { max-width: 210mm; margin: 0 auto; padding: 6mm; }

            /* Header */
            .header-band {
              background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
              color: white;
              padding: 14px 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-radius: 6px 6px 0 0;
            }
            .header-band .logo-area { display: flex; align-items: center; gap: 14px; }
            .header-band .logo-area img { height: 52px; object-fit: contain; background: white; border-radius: 6px; padding: 4px; }
            .header-band .company-names h1 { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; line-height: 1.2; }
            .header-band .company-names h2 { font-size: 16px; font-weight: 700; line-height: 1.2; }
            .header-band .contract-badge {
              text-align: center;
              background: rgba(255,255,255,0.15);
              border: 1px solid rgba(255,255,255,0.3);
              border-radius: 6px;
              padding: 6px 16px;
            }
            .header-band .contract-badge .label { font-size: 10px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px; }
            .header-band .contract-badge .number { font-size: 20px; font-weight: 800; }

            /* Sub-header info bar */
            .info-bar {
              background: #f0f4f8;
              border: 1px solid #d1dce6;
              border-top: none;
              padding: 8px 20px;
              display: flex;
              justify-content: space-between;
              font-size: 10.5px;
              border-radius: 0 0 6px 6px;
              margin-bottom: 10px;
            }
            .info-bar span { color: #4a5568; }
            .info-bar strong { color: #1a202c; }

            /* Section style */
            .section {
              border: 1px solid #d1dce6;
              border-radius: 6px;
              margin-bottom: 8px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .section-title {
              background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
              color: white;
              padding: 6px 14px;
              font-size: 11.5px;
              font-weight: 700;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .section-title .ar { font-size: 12px; }
            .section-body { padding: 10px 14px; }

            /* Data grid - 2 columns */
            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1px;
              background: #e8edf2;
            }
            .data-cell {
              background: white;
              padding: 5px 10px;
              display: flex;
              flex-direction: column;
            }
            .data-cell.full { grid-column: 1 / -1; }
            .data-label {
              font-size: 9px;
              color: #718096;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 1px;
            }
            .data-value { font-size: 11.5px; font-weight: 600; color: #1a202c; }

            /* Payment table */
            .pay-table { width: 100%; border-collapse: collapse; }
            .pay-table td { padding: 5px 10px; border-bottom: 1px solid #e8edf2; font-size: 11px; }
            .pay-table .label-cell { color: #4a5568; width: 55%; }
            .pay-table .value-cell { text-align: right; font-weight: 600; color: #1a202c; }
            .pay-table .total-row td {
              border-top: 2px solid #1e3a5f;
              border-bottom: 2px solid #1e3a5f;
              font-size: 13px;
              font-weight: 800;
              padding: 7px 10px;
              color: #1e3a5f;
            }
            .pay-table .balance-row td {
              background: #1e3a5f;
              color: white;
              font-size: 13px;
              font-weight: 800;
              padding: 8px 10px;
              border: none;
            }

            /* Side-by-side layout */
            .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

            /* Vehicle condition bar */
            .condition-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 1px;
              background: #e8edf2;
            }
            .condition-cell {
              background: white;
              padding: 8px;
              text-align: center;
            }
            .condition-cell .cell-icon { font-size: 18px; margin-bottom: 2px; }
            .condition-cell .cell-label { font-size: 8.5px; color: #718096; text-transform: uppercase; }
            .condition-cell .cell-value { font-size: 13px; font-weight: 700; color: #1e3a5f; }

            /* Terms */
            .terms-list { padding: 0; margin: 0; list-style: none; }
            .terms-list li {
              padding: 4px 0;
              border-bottom: 1px dashed #e2e8f0;
              font-size: 9.5px;
              line-height: 1.5;
            }
            .terms-list li:last-child { border-bottom: none; }
            .term-title { font-weight: 700; font-size: 10px; color: #1a202c; }
            .term-content { color: #4a5568; }
            .term-ar { direction: rtl; text-align: right; color: #4a5568; font-size: 9.5px; }

            /* Signatures */
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-top: 14px;
              padding-top: 10px;
            }
            .sig-box { text-align: center; }
            .sig-line {
              border-bottom: 2px solid #1e3a5f;
              margin: 28px auto 6px;
              width: 85%;
            }
            .sig-label { font-size: 10px; font-weight: 700; color: #1e3a5f; }
            .sig-label-ar { font-size: 10px; font-weight: 700; color: #718096; }

            /* Footer */
            .footer {
              text-align: center;
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px solid #d1dce6;
              font-size: 8.5px;
              color: #a0aec0;
            }

            /* Notes */
            .notes-text {
              font-size: 10.5px;
              color: #4a5568;
              white-space: pre-wrap;
              line-height: 1.5;
              padding: 6px 0;
            }

            /* Fuel gauge */
            .fuel-bar { display: flex; align-items: center; gap: 6px; }
            .fuel-track {
              flex: 1;
              height: 10px;
              background: #e2e8f0;
              border-radius: 5px;
              overflow: hidden;
            }
            .fuel-fill {
              height: 100%;
              border-radius: 5px;
              transition: width 0.3s;
            }
            .fuel-fill.low { background: #e53e3e; }
            .fuel-fill.mid { background: #dd6b20; }
            .fuel-fill.high { background: #38a169; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return "-";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getFuelLevel = (level) => {
    const num = parseInt(level) || 0;
    if (num <= 25) return 'low';
    if (num <= 50) return 'mid';
    return 'high';
  };

  const calculateDays = () => {
    if (!contract?.start_date || !contract?.end_date) return "-";
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : "-";
  };

  if (!isOpen) return null;

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={t('contracts.print.title') || "Print Contract"}
        size="xl"
      >
        <CustomModalBody className="h-[70vh] overflow-y-auto print:h-auto print:overflow-visible print:max-h-none bg-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contract ? (
            <div ref={printRef} className="print:p-0">
              <div className="contract-page" style={{ maxWidth: '210mm', margin: '0 auto', padding: '6mm', fontFamily: "'Cairo', 'Segoe UI', Arial, sans-serif", fontSize: '11px', color: '#1a1a1a', background: 'white', lineHeight: '1.4' }}>
                
                {/* ═══════════ HEADER ═══════════ */}
                <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px 6px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {companyInfo?.logo_url && (
                      <img src={companyInfo.logo_url} alt="Logo" style={{ height: '52px', objectFit: 'contain', background: 'white', borderRadius: '6px', padding: '4px' }} />
                    )}
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1.2 }}>
                        {companyInfo?.company_name_en || 'CAR RENTAL COMPANY'}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2, opacity: 0.9 }}>
                        {companyInfo?.company_name_ar || 'شركة تأجير السيارات'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '6px 16px' }}>
                    <div style={{ fontSize: '9px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px' }}>RENTAL CONTRACT / عقد إيجار</div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{contract.contract_number || `#${contract.id}`}</div>
                  </div>
                </div>

                {/* ═══════════ INFO BAR ═══════════ */}
                <div style={{ background: '#f0f4f8', border: '1px solid #d1dce6', borderTop: 'none', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', borderRadius: '0 0 6px 6px', marginBottom: '10px' }}>
                  <span style={{ color: '#4a5568' }}>Date / التاريخ: <strong style={{ color: '#1a202c' }}>{formatDate(new Date())}</strong></span>
                  <span style={{ color: '#4a5568' }}>Status / الحالة: <strong style={{ color: '#1a202c' }}>{contract.status?.toUpperCase()}</strong></span>
                  <span style={{ color: '#4a5568' }}>Branch / الفرع: <strong style={{ color: '#1a202c' }}>{contract.branch_name || contract.branch_name_en || '-'}</strong></span>
                  <span style={{ color: '#4a5568' }}>Prepared By / بواسطة: <strong style={{ color: '#1a202c' }}>{contract.created_by_name || '-'}</strong></span>
                </div>

                {/* ═══════════ TWO COLUMN: CUSTOMER + VEHICLE ═══════════ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>

                  {/* Customer Info */}
                  <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', pageBreakInside: 'avoid' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>RENTER DETAILS</span>
                      <span style={{ fontSize: '12px' }}>بيانات المستأجر</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e8edf2' }}>
                      <div style={{ background: 'white', padding: '5px 10px', gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Full Name / الاسم الكامل</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a202c' }}>{contract.customer_name || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Phone / الهاتف</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.customer_phone || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Email / البريد</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.customer_email || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Emirates ID / الهوية</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.customer_emirates_id || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>ID Expiry / انتهاء الهوية</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{formatDate(contract.customer_emirates_id_expiry)}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>License No. / رقم الرخصة</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.customer_license_no || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>License Expiry / انتهاء الرخصة</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{formatDate(contract.customer_license_expiry)}</div>
                      </div>
                      {contract.customer_address && (
                        <div style={{ background: 'white', padding: '5px 10px', gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Address / العنوان</div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.customer_address}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', pageBreakInside: 'avoid' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>VEHICLE DETAILS</span>
                      <span style={{ fontSize: '12px' }}>بيانات المركبة</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e8edf2' }}>
                      <div style={{ background: 'white', padding: '5px 10px', gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Vehicle / المركبة</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a202c' }}>{contract.car_details || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Plate No. / رقم اللوحة</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e3a5f', letterSpacing: '1px' }}>{contract.plate_number || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Color / اللون</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.car_color || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Year / السنة</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.car_year || "-"}</div>
                      </div>
                      <div style={{ background: 'white', padding: '5px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1px' }}>Registration / التسجيل</div>
                        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a202c' }}>{contract.car_registration_number || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════ RENTAL PERIOD ═══════════ */}
                <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', marginTop: '8px', pageBreakInside: 'avoid' }}>
                  <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>RENTAL PERIOD</span>
                    <span style={{ fontSize: '12px' }}>فترة الإيجار</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#e8edf2' }}>
                    <div style={{ background: 'white', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Pick-up Date & Time / تاريخ ووقت الاستلام</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>{formatDate(contract.start_date)}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568' }}>{contract.start_time || '--:--'}</div>
                    </div>
                    <div style={{ background: 'white', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Return Date & Time / تاريخ ووقت الإرجاع</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>{formatDate(contract.end_date)}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568' }}>{contract.end_time || '--:--'}</div>
                    </div>
                    <div style={{ background: '#f7fafc', padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Duration / المدة</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a5f' }}>{calculateDays()}</div>
                      <div style={{ fontSize: '9px', color: '#718096' }}>DAYS / أيام</div>
                    </div>
                  </div>
                </div>

                {/* ═══════════ VEHICLE CONDITION ═══════════ */}
                <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', marginTop: '8px', pageBreakInside: 'avoid' }}>
                  <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>VEHICLE CONDITION AT HANDOVER</span>
                    <span style={{ fontSize: '12px' }}>حالة المركبة عند التسليم</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#e8edf2' }}>
                    <div style={{ background: 'white', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', marginBottom: '2px' }}>📏</div>
                      <div style={{ fontSize: '8.5px', color: '#718096', textTransform: 'uppercase' }}>KM Allowed / المسموح</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>{contract.km_allowed ? `${contract.km_allowed.toLocaleString()} km` : '-'}</div>
                    </div>
                    <div style={{ background: 'white', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', marginBottom: '2px' }}>🚗</div>
                      <div style={{ fontSize: '8.5px', color: '#718096', textTransform: 'uppercase' }}>KM Out / عند الاستلام</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>{contract.km_taken_start ? `${contract.km_taken_start.toLocaleString()} km` : '-'}</div>
                    </div>
                    <div style={{ background: 'white', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', marginBottom: '2px' }}>🔙</div>
                      <div style={{ fontSize: '8.5px', color: '#718096', textTransform: 'uppercase' }}>KM In / عند الإرجاع</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>{contract.km_return_end ? `${contract.km_return_end.toLocaleString()} km` : '-'}</div>
                    </div>
                    <div style={{ background: 'white', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', marginBottom: '2px' }}>⛽</div>
                      <div style={{ fontSize: '8.5px', color: '#718096', textTransform: 'uppercase' }}>Fuel Level / الوقود</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '2px' }}>
                        <div style={{ flex: 1, maxWidth: '60px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${parseInt(contract.petrol_at_take) || 0}%`,
                            borderRadius: '4px',
                            background: parseInt(contract.petrol_at_take) <= 25 ? '#e53e3e' : parseInt(contract.petrol_at_take) <= 50 ? '#dd6b20' : '#38a169'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a5f' }}>{contract.petrol_at_take || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════ PAYMENT DETAILS ═══════════ */}
                <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', marginTop: '8px', pageBreakInside: 'avoid' }}>
                  <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>PAYMENT SUMMARY</span>
                    <span style={{ fontSize: '12px' }}>ملخص الدفع</span>
                  </div>
                  <div style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', color: '#4a5568', width: '55%' }}>
                            Daily Rate / السعر اليومي
                          </td>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', textAlign: 'right', fontWeight: 600, color: '#1a202c' }}>
                            {formatCurrency(contract.daily_price)} <span style={{ fontSize: '9px', color: '#718096' }}>× {calculateDays()} days</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', color: '#4a5568' }}>
                            Insurance / التأمين
                          </td>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', textAlign: 'right', fontWeight: 600, color: '#1a202c' }}>
                            {formatCurrency(contract.insurance_amount)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 14px', borderTop: '2px solid #1e3a5f', borderBottom: '2px solid #1e3a5f', fontSize: '13px', fontWeight: 800, color: '#1e3a5f' }}>
                            TOTAL AMOUNT / المبلغ الإجمالي
                          </td>
                          <td style={{ padding: '8px 14px', borderTop: '2px solid #1e3a5f', borderBottom: '2px solid #1e3a5f', fontSize: '13px', fontWeight: 800, color: '#1e3a5f', textAlign: 'right' }}>
                            {formatCurrency(contract.total_amount)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', color: '#4a5568' }}>
                            Amount Paid / المبلغ المدفوع
                          </td>
                          <td style={{ padding: '6px 14px', borderBottom: '1px solid #e8edf2', fontSize: '11px', textAlign: 'right', fontWeight: 600, color: '#38a169' }}>
                            {formatCurrency(contract.paid_amount)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 14px', background: '#1e3a5f', color: 'white', fontSize: '13px', fontWeight: 800, borderRadius: '0 0 0 5px' }}>
                            BALANCE DUE / المبلغ المتبقي
                          </td>
                          <td style={{ padding: '10px 14px', background: '#1e3a5f', color: 'white', fontSize: '14px', fontWeight: 800, textAlign: 'right', borderRadius: '0 0 5px 0' }}>
                            {formatCurrency((contract.total_amount || 0) - (contract.paid_amount || 0))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ═══════════ NOTES ═══════════ */}
                {contract.notes && (
                  <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', marginTop: '8px', pageBreakInside: 'avoid' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>NOTES</span>
                      <span style={{ fontSize: '12px' }}>ملاحظات</span>
                    </div>
                    <div style={{ padding: '8px 14px' }}>
                      <p style={{ fontSize: '10.5px', color: '#4a5568', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>{contract.notes}</p>
                    </div>
                  </div>
                )}

                {/* ═══════════ TERMS & CONDITIONS ═══════════ */}
                {rentalTerms.length > 0 && (
                  <div style={{ border: '1px solid #d1dce6', borderRadius: '6px', overflow: 'hidden', marginTop: '8px', pageBreakInside: 'avoid' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', color: 'white', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>TERMS & CONDITIONS</span>
                      <span style={{ fontSize: '12px' }}>الشروط والأحكام</span>
                    </div>
                    <div style={{ padding: '8px 14px' }}>
                      <ol style={{ margin: 0, paddingLeft: '16px' }}>
                        {rentalTerms.map((term, idx) => (
                          <li key={term.id} style={{ padding: '3px 0', borderBottom: idx < rentalTerms.length - 1 ? '1px dashed #e2e8f0' : 'none', fontSize: '9.5px', lineHeight: 1.5 }}>
                            <span style={{ fontWeight: 700, fontSize: '10px', color: '#1a202c' }}>{term.title_en}</span>
                            {term.title_ar && <span style={{ fontWeight: 700, fontSize: '10px', color: '#4a5568' }}> / {term.title_ar}</span>}
                            {term.content_en && <p style={{ margin: '1px 0 0 0', color: '#4a5568', fontSize: '9.5px' }}>{term.content_en}</p>}
                            {term.content_ar && <p style={{ margin: '1px 0 0 0', direction: 'rtl', textAlign: 'right', color: '#4a5568', fontSize: '9.5px' }}>{term.content_ar}</p>}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* ═══════════ SIGNATURES ═══════════ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '18px', paddingTop: '10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '2px solid #1e3a5f', margin: '32px auto 6px', width: '85%' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a5f' }}>RENTER SIGNATURE</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#718096' }}>توقيع المستأجر</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '2px solid #1e3a5f', margin: '32px auto 6px', width: '85%' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a5f' }}>COMPANY REPRESENTATIVE</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#718096' }}>ممثل الشركة</div>
                  </div>
                </div>

                {/* ═══════════ FOOTER ═══════════ */}
                <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #d1dce6', fontSize: '8.5px', color: '#a0aec0' }}>
                  <p style={{ margin: 0 }}>This is a computer-generated document and does not require a stamp / هذا مستند إلكتروني ولا يحتاج إلى ختم</p>
                  <p style={{ margin: '2px 0 0 0' }}>{companyInfo?.company_name_en || ''} — Contract #{contract.contract_number || contract.id}</p>
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {t('contracts.errorLoading')}
            </div>
          )}
        </CustomModalBody>

        <CustomModalFooter className="print:hidden">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            {t('contracts.viewModal.close')}
          </Button>
          <Button onClick={handlePrint} disabled={isLoading || !contract}>
            <Printer className="mr-2 h-4 w-4" />
            {t('contracts.print.printButton') || "Print"}
          </Button>
        </CustomModalFooter>
      </CustomModal>
    </>
  );
}
