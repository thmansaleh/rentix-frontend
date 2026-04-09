"use client";

import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  MapPin,
  Calendar,
  Clock,
  Car,
  Building2,
  AlertCircle,
  Hash,
  CreditCard,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ExternalLink,
  FileWarning,
  ShieldAlert,
  CalendarClock,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BENEFICIARY_AR = {
  "Dubai Police": "شرطة دبي",
  "DUBAI POLICE": "شرطة دبي",
  "Sharjah Transportation": "هيئة النقل بالشارقة",
  "Abu Dhabi Traffic": "شرطة أبوظبي",
  "Ajman Traffic": "شرطة عجمان",
  "RTA (Parking Fines)": "هيئة الطرق والمواصلات (مخالفات الوقوف)",
  "Sharjah Traffic": "شرطة الشارقة",
  "Ras Al Khaymah Traffic": "شرطة رأس الخيمة",
  "Um Al Quewain Traffic": "شرطة أم القيوين",
  "Sharjah Municipality": "بلدية الشارقة",
  "Fujairah Traffic": "شرطة الفجيرة",
};

const FINE_TYPE_AR = {
  'failure of a light vehicle to abid by lane discipline': 'عدم التزام المركبة الخفيفة  بانضباط المسار',
  'driving against traffic': 'القيادة عكس اتجاه السير',
  'using a hand held mobile phone while driving': 'استخدام الهاتف  أثناء القيادة',
  'Turning from undesignated areas': 'الدوران من أماكن غير مخصصة',
  'Jumping a red signal by light vehicles': 'تجاوز إشارة حمراء ',
  'Exceeding maximum speed limit by not more than 30 km h': 'تجاوز الحد الأقصى للسرعة بمقدار لا يزيد عن 30 كم/س',
  'Failure to abide by traffic signs and instructions': 'عدم الالتزام بإشارات وتعليمات المرور',
  'sudden swerving': 'الانحراف المفاجئ',
  'Exceeding maximum speed limit by not more than 40 km h': 'تجاوز الحد الأقصى للسرعة بمقدار لا يزيد عن 40 كم/س',
  'failure of driver to fasten seatbelt': 'عدم ربط حزام الأمان',
  'Exceeding maximum speed limit by not more than 20 km h': 'تجاوز الحد الأقصى للسرعة بمقدار لا يزيد عن 20 كم/س',
  'Parking in a wrong way': 'الوقوف بطريقة خاطئة',
  'Interrupting traffic in any other way not specified in this table.': 'التسبب في تعطيل حركة المرور  .',
  'Moving light vehicle from the road': 'ازاحة المركبة الخفيفة من الطريق',
  'Wrong overtaking': 'التجاوز الخاطئ',
  'heavy vehicle prohibited entry': 'دخول المركبة الثقيلة إلى منطقة ممنوعة',
  'Failure to use indicators when changing direction or turning': 'عدم استخدام الإشارات عند تغيير الاتجاه أو الانعطاف',
  'Overtaking on the hard shoulder': 'التجاوز بطريقة خاطئة',
  'Parking Fines': 'مخالفات الباركنات',
  'BusLane Fine / BusLane Fine': 'استخدام حارة الحافلات',
  'Sharjah Transportation Fine / Sharjah Transportation Fine': 'مخالفة هيئة الطرق والمواصلات بالشارقة',
  'Parking Fine': 'مخالفات الباركنات',
  'failure of driver to fasten seatbelt/ using a hand held mobile phone while driving': 'عدم ربط حزام الأمان / استخدام الهاتف  أثناء القيادة',
};

export function ViewFineModal({ isOpen, onClose, ticket, confiscatedInfo }) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const getBeneficiary = (name) => {
    if (!name) return "-";
    if (isRTL) return BENEFICIARY_AR[name] || name;
    return name;
  };

  const getFineType = (violation) => {
    if (!violation) return "-";
    if (isRTL) return FINE_TYPE_AR[violation] || violation;
    return violation;
  };

  if (!ticket) return null;

  const isPayable = ticket.isPayable === 2;
  const isNotPayable = ticket.isPayable === 1;

  const totalFine = (ticket.ticketTotalFine || ticket.ticketFine || 0).toLocaleString();

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
            <Receipt className="w-4 h-4 text-orange-500" />
          </div>
          <span className="font-semibold tracking-tight">
            {isRTL ? "تفاصيل المخالفة" : "Fine Details"}
          </span>
        </div>
      }
      size="lg"
    >
      <CustomModalBody className="p-0">

        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-6 pt-5 pb-6 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600">
          {/* Decorative ring */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/10" />

          <div className="relative flex items-end justify-between gap-4">
            <div>
              <p className="text-orange-100 text-xs font-medium uppercase tracking-widest mb-1">
                {isRTL ? "إجمالي الغرامة" : "Total Fine"}
              </p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">
                AED {totalFine}
              </p>
              <p className="mt-1.5 text-orange-100/80 text-xs">
                {isRTL ? "رقم المخالفة" : "Ticket"}{" "}
                <span className="font-semibold text-white">#{ticket.ticketNo}</span>
              </p>
            </div>

            {/* Status pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
                isPayable
                  ? "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/30"
                  : isNotPayable
                  ? "bg-red-400/20 text-red-100 ring-1 ring-red-300/30"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {isPayable ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              {isPayable
                ? isRTL ? "قابل للدفع" : "Payable"
                : isNotPayable
                ? isRTL ? "غير قابل للدفع" : "Not Payable"
                : "-"}
            </div>
          </div>

          {/* Mini fee breakdown strip */}
          <div className="mt-4 flex gap-4 text-xs text-orange-100/70">
            <span>
              {isRTL ? "الغرامة الأساسية" : "Base"}{" "}
              <span className="font-semibold text-white">
                AED {ticket.ticketFine?.toLocaleString() ?? 0}
              </span>
            </span>
            <span className="opacity-40">+</span>
            <span>
              {isRTL ? "رسوم المعرفة" : "Knowledge Fee"}{" "}
              <span className="font-semibold text-white">
                AED {ticket.knowledgeFee ?? 0}
              </span>
            </span>
          </div>
        </div>

        {/* ── Wanted for Impound Banner ───────────────────────────── */}
        {confiscatedInfo && (
          <div className="mx-6 mt-4 flex flex-wrap items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/50 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-500 dark:text-rose-400 mb-1">
                {isRTL ? 'مطلوبة للحجز' : 'Wanted for Impound'}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    {confiscatedInfo.bookingPeriod}{' '}
                    {isRTL ? 'يوم' : 'days'}
                  </span>
                  <span className="text-xs text-rose-400">
                    {isRTL ? '(مدة الحجز)' : '(impound period)'}
                  </span>
                </div>
                {confiscatedInfo.vehicleHeldDate && (
                  <span className="text-xs text-rose-600 dark:text-rose-400">
                    {isRTL ? 'تاريخ الضبط: ' : 'Held: '}
                    <span className="font-semibold">{confiscatedInfo.vehicleHeldDate}</span>
                  </span>
                )}
                {confiscatedInfo.vehicleReleaseDate && (
                  <span className="text-xs text-rose-600 dark:text-rose-400">
                    {isRTL ? 'الإفراج: ' : 'Release: '}
                    <span className="font-semibold">{confiscatedInfo.vehicleReleaseDate}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 space-y-5">

          {/* Violation card */}
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg shrink-0">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400 mb-1">
                  {isRTL ? "وصف المخالفة" : "Violation"}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {getFineType(ticket.ticketViolation)}
                </p>
              </div>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard
              icon={Calendar}
              label={isRTL ? "التاريخ" : "Date"}
              value={ticket.ticketDate}
            />
            <InfoCard
              icon={Clock}
              label={isRTL ? "الوقت" : "Time"}
              value={ticket.ticketTime}
            />
            <InfoCard
              icon={Building2}
              label={isRTL ? "المصدر" : "Authority"}
              value={getBeneficiary(ticket.beneficiary)}
            />
            <InfoCard
              icon={Car}
              label={isRTL ? "رقم اللوحة" : "Plate No."}
              value={`${ticket.plateNo} ${ticket.plateCode}`}
            />
            <InfoCard
              icon={Car}
              label={isRTL ? "فئة اللوحة" : "Plate Category"}
              value={ticket.plateCategoryEn}
            />
            <InfoCard
              icon={Car}
              label={isRTL ? "مصدر اللوحة" : "Plate Source"}
              value={ticket.pltSrcE}
            />
            {ticket.offenseBlackPionts != null && (
              <InfoCard
                icon={Shield}
                label={isRTL ? "النقاط السوداء" : "Black Points"}
                value={String(ticket.offenseBlackPionts)}
                // highlight
              />
            )}
          </div>

          {/* Must Present License */}
          {ticket.mustPresentLicenseViolation != null && (
            <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${
              ticket.mustPresentLicenseViolation === 1
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'
            }`}>
              <div className={`p-1.5 rounded-lg shrink-0 ${
                ticket.mustPresentLicenseViolation === 1
                  ? 'bg-amber-100 dark:bg-amber-900/50'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <FileWarning className={`w-4 h-4 ${
                  ticket.mustPresentLicenseViolation === 1 ? 'text-amber-500' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${
                  ticket.mustPresentLicenseViolation === 1 ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {isRTL ? "تقديم الرخصة مطلوب" : "Must Present License"}
                </p>
                <p className={`text-sm font-semibold ${
                  ticket.mustPresentLicenseViolation === 1
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {ticket.mustPresentLicenseViolation === 1
                    ? isRTL ? 'نعم — يجب تقديم الرخصة' : 'Yes — License must be presented'
                    : isRTL ? 'لا' : 'No'}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {ticket.location && (
            <div className="flex gap-3 items-start p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  {isRTL ? "الموقع" : "Location"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                  {ticket.location}
                </p>
              </div>
            </div>
          )}

          {/* GPS Map Link */}
          {ticket.gpsLocationLatitude && ticket.gpsLocationLongitude && (
            <a
              href={`https://www.google.com/maps?q=${ticket.gpsLocationLatitude},${ticket.gpsLocationLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors group"
            >
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-0.5">
                  {isRTL ? "موقع GPS" : "GPS Location"}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium tabular-nums">
                  {parseFloat(ticket.gpsLocationLatitude).toFixed(6)}, {parseFloat(ticket.gpsLocationLongitude).toFixed(6)}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 shrink-0 transition-colors" />
            </a>
          )}

        </div>
      </CustomModalBody>

      <CustomModalFooter className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <Button variant="outline" onClick={onClose} className="min-w-[90px]">
          {isRTL ? "إغلاق" : "Close"}
        </Button>
        {/* {isPayable && (
          <Button className="min-w-[90px] bg-orange-500 hover:bg-orange-600 text-white">
            {isRTL ? "ادفع الآن" : "Pay Now"}
          </Button>
        )} */}
      </CustomModalFooter>
    </CustomModal>
  );
}

/* ── Reusable info card ──────────────────────────────────────────── */
function InfoCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${highlight ? 'bg-gray-900 dark:bg-gray-950 border-gray-700 dark:border-gray-600' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/60'}`}>
      <div className={`p-1.5 rounded-lg shrink-0 ${highlight ? 'bg-white/10' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
        <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-white' : 'text-orange-500'}`} />
      </div>
      <div className="min-w-0">
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
          {label}
        </p>
        <p className={`text-sm font-bold truncate ${highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}