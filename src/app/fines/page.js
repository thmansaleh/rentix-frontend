"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Loader2,
  Receipt,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Car,
  Search,
  SlidersHorizontal,
  ShieldAlert,
} from 'lucide-react';
import { getFines } from '../services/api/fines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ViewFineModal } from './ViewFineModal';
import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';

const BENEFICIARY_AR = {
  'Dubai Police': 'شرطة دبي',
  'DUBAI POLICE': 'شرطة دبي',
  'Sharjah Transportation': 'هيئة الطرق والمواصلات (الشارقة)',
  'Abu Dhabi Traffic': 'شرطة أبوظبي',
  'Ajman Traffic': 'شرطة عجمان',
  'RTA (Parking Fines)': 'هيئة الطرق والمواصلات (مخالفات الوقوف)',
  'Sharjah Traffic': 'شرطة الشارقة',
  'Ras Al Khaymah Traffic': 'شرطة رأس الخيمة',
  'Um Al Quewain Traffic': 'شرطة أم القيوين',
  'Sharjah Municipality': 'بلدية الشارقة',
  'Fujairah Traffic': 'شرطة الفجيرة',
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
  'failure to give priority to vehicles coming from behind or the left side': 'عدم إعطاء الأولوية للمركبات القادمة من الخلف أو الجانب الأيسر',
  'heavy vehicle not abiding by lane discipline': 'عدم التزام المركبة الثقيلة بانضباط المسار',


};

export default function FinesPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const { data, error, isLoading } = useSWR('fines', () => getFines(), {
    revalidateOnFocus: false,
  });

  const allTickets = data?.data?.results?.tickets || [];
  const confiscatedList = data?.data?.results?.confisticated || [];
  const confiscatedTicketNos = new Set(
    confiscatedList.flatMap(c => (c.violations || []).map(v => String(v.ticketNo)))
  );

  const tickets = allTickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      String(t.ticketNo ?? '').toLowerCase().includes(q) ||
      String(t.plateNo ?? '').toLowerCase().includes(q) ||
      String(t.plateCode ?? '').toLowerCase().includes(q) ||
      String(t.beneficiary ?? '').toLowerCase().includes(q) ||
      String(t.ticketViolation ?? '').toLowerCase().includes(q) ||
      String(t.location ?? '').toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'payable' && t.isPayable === 2) ||
      (statusFilter === 'not_payable' && t.isPayable === 1) ||
      (statusFilter === 'wanted' && confiscatedTicketNos.has(String(t.ticketNo)));
    return matchesSearch && matchesStatus;
  });

  const totalFine = tickets.reduce((sum, t) => sum + (t.ticketTotalFine || 0), 0);
  const payableCount = tickets.filter((t) => t.isPayable === 2).length;
  const notPayableCount = tickets.filter((t) => t.isPayable === 1).length;

  const getPayableConfig = (isPayable) => {
    if (isPayable === 2)
      return {
        label: isRTL ? 'قابل للدفع' : 'Payable',
        dot: 'bg-emerald-500',
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
      };
    if (isPayable === 1)
      return {
        label: isRTL ? 'غير قابل للدفع' : 'Not Payable',
        dot: 'bg-red-500',
        className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
      };
    return {
      label: '-',
      dot: 'bg-gray-400',
      className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700',
    };
  };

  const getBeneficiary = (name) => {
    if (!name) return '-';
    if (isRTL) return BENEFICIARY_AR[name] || name;
    return name;
  };

  const getFineType = (violation) => {
    if (!violation) return '-';
    if (isRTL) return FINE_TYPE_AR[violation] || violation;
    return violation;
  };

  return (
    <div className="">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden  ">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full  " />
          <div className="absolute top-0 right-0 w-full h-full"
          />
        </div>

        <div className="relative container mx-auto px-6 py-7">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isRTL ? 'المخالفات المرورية' : 'Traffic Fines'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {isRTL ? 'عرض وإدارة مخالفات المركبات' : 'Monitor and manage vehicle fines'}
                </p>
              </div>
            </div>

            {/* Live summary badge */}
            {!isLoading && !error && tickets.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/40">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {tickets.length} {isRTL ? 'مخالفة' : 'fines'} &nbsp;·&nbsp; AED {totalFine.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-5">

        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                label: isRTL ? 'إجمالي الغرامات' : 'Total Amount',
                value: `AED ${totalFine.toLocaleString()}`,
                icon: TrendingUp,
                accent: 'orange',
              },
              {
                label: isRTL ? 'عدد المخالفات' : 'Total Tickets',
                value: tickets.length,
                icon: Receipt,
                accent: 'blue',
              },
              {
                label: isRTL ? 'قابلة للدفع' : 'Payable',
                value: payableCount,
                icon: CheckCircle2,
                accent: 'emerald',
              },
              {
                label: isRTL ? 'غير قابلة للدفع' : 'Not Payable',
                value: notPayableCount,
                icon: XCircle,
                accent: 'red',
              },
              {
                label: isRTL ? 'المركبات المطلوبة للحجز' : 'Wanted for Impound',
                value: confiscatedList.length,
                icon: ShieldAlert,
                accent: 'crimson',
              },
            ].map((card) => {
              const styles = {
                orange: {
                  card: 'border-orange-100 dark:border-orange-900/40',
                  icon: 'bg-orange-500 shadow-orange-200 dark:shadow-orange-900/30',
                  value: 'text-orange-600 dark:text-orange-400',
                },
                blue: {
                  card: 'border-blue-100 dark:border-blue-900/40',
                  icon: 'bg-blue-500 shadow-blue-200 dark:shadow-blue-900/30',
                  value: 'text-blue-600 dark:text-blue-400',
                },
                emerald: {
                  card: 'border-emerald-100 dark:border-emerald-900/40',
                  icon: 'bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/30',
                  value: 'text-emerald-600 dark:text-emerald-400',
                },
                red: {
                  card: 'border-red-100 dark:border-red-900/40',
                  icon: 'bg-red-500 shadow-red-200 dark:shadow-red-900/30',
                  value: 'text-red-600 dark:text-red-400',
                },
                crimson: {
                  card: 'border-rose-200 dark:border-rose-900/40',
                  icon: 'bg-rose-600 shadow-rose-200 dark:shadow-rose-900/30',
                  value: 'text-rose-600 dark:text-rose-400',
                },
              }[card.accent];

              return (
                <div
                  key={card.label}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border ${styles.card} p-4 flex items-center gap-4 shadow-sm`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 shadow-lg ${styles.icon}`}>
                    <card.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 truncate">{card.label}</p>
                    <p className={`text-base font-bold truncate ${styles.value}`}>{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Search & Filter ─────────────────────────────────────────── */}
        {!isLoading && !error && (
          <div className="  rounded-2xl shadow-sm p-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4  pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'البحث برقم المخالفة، اللوحة، الجهة...' : 'Search by ticket no., plate, authority…'}
                className={`${isRTL ? 'pr-9 text-right' : 'pl-9'} h-9   rounded-xl`}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 " />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9    rounded-xl focus:ring-1  text-sm">
                  <SelectValue placeholder={isRTL ? 'تصفية' : 'Filter'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'الكل' : 'All Fines'}</SelectItem>
                  <SelectItem value="payable">{isRTL ? 'قابل للدفع' : 'Payable'}</SelectItem>
                  <SelectItem value="not_payable">{isRTL ? 'غير قابل للدفع' : 'Not Payable'}</SelectItem>
                  <SelectItem value="wanted">{isRTL ? 'مطلوبة للحجز' : 'Wanted for Impound'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* ── Table Card ──────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-400">{isRTL ? 'جارٍ التحميل...' : 'Loading fines…'}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {isRTL ? 'تعذّر تحميل البيانات' : 'Failed to load fines'}
              </p>
              <p className="text-sm text-gray-400">{isRTL ? 'يرجى المحاولة مجدداً' : 'Please try again later'}</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {searchQuery || statusFilter !== 'all'
                  ? isRTL ? 'لا توجد نتائج' : 'No matching results'
                  : isRTL ? 'لا توجد مخالفات' : 'No fines found'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery || statusFilter !== 'all'
                  ? isRTL ? 'جرّب تعديل معايير البحث' : 'Try adjusting your search or filter'
                  : isRTL ? 'لم يتم تسجيل أي مخالفات' : 'No traffic fines have been recorded'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b font-semibold border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-50/70">
                    {[
                      isRTL ? 'رقم المخالفة' : 'Ticket No.',
                      isRTL ? 'التاريخ' : 'Date & Time',
                      isRTL ? 'اللوحة' : 'Plate',
                      isRTL ? 'الجهة' : 'Authority',
                      isRTL ? 'المخالفة' : 'Violation',
                      isRTL ? 'الموقع' : 'Location',
                      isRTL ? 'النقاط السوداء' : 'Black Points',
                      isRTL ? 'الغرامة' : 'Fine (AED)',
                      isRTL ? 'الحالة' : 'Status',
                      '',
                    ].map((h, i) => (
                      <TableHead
                        key={i}
                        className="text-12 font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap py-3"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const isConfiscated = confiscatedTicketNos.has(String(ticket.ticketNo));
                    const payable = getPayableConfig(ticket.isPayable);
                    return (
                      <TableRow
                        key={ticket.ticketId}
                        className={`border-b border-gray-50 dark:border-gray-800/60 transition-colors group ${isConfiscated ? 'bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-50/80 dark:hover:bg-rose-900/20' : 'hover:bg-orange-50/40 dark:hover:bg-orange-900/10'}`}
                      >
                        {/* Ticket No. */}
                        <TableCell className="py-3.5">
                          <span className="font-mono text-[13px] font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                            {ticket.ticketNo}
                          </span>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell className="py-3.5">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                            {ticket.ticketDate}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {ticket.ticketTime}
                          </div>
                        </TableCell>

                        {/* UAE Plate */}
                        <TableCell className="py-3.5">
                          <div className="inline-flex items-center rounded-lg border-2 border-gray-800 dark:border-gray-600 bg-white shadow overflow-hidden text-gray-900 leading-none"
                            style={{ fontFamily: 'Arial, sans-serif' }}>
                            <div className="px-2.5 py-1.5 text-lg font-black tracking-widest border-r-2 border-gray-800 dark:border-gray-600">
                              {ticket.plateNo || '—'}
                            </div>
                            <div className="px-2 py-1.5 text-[10px] font-extrabold uppercase text-center leading-tight">
                              {ticket.pltSrcE || 'UAE'}
                            </div>
                            <div className="px-2.5 py-1.5 text-lg font-black border-l-2 border-gray-800 dark:border-gray-600">
                              {ticket.plateCode || '—'}
                            </div>
                          </div>
                        </TableCell>

                        {/* Authority */}
                        <TableCell className="py-3.5">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {getBeneficiary(ticket.beneficiary)}
                          </span>
                        </TableCell>

                        {/* Violation */}
                        <TableCell className="py-3.5 max-w-[220px]">
                          <span
                            className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug"
                            title={ticket.ticketViolation}
                          >
                            {getFineType(ticket.ticketViolation)}
                          </span>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="py-3.5 max-w-[160px]">
                          <span
                            className="text-sm text-gray-400 dark:text-gray-500 truncate block"
                            title={ticket.location}
                          >
                            {ticket.location || '—'}
                          </span>
                        </TableCell>

                        {/* Black Points */}
                        <TableCell className="py-3.5">
                          {ticket.offenseBlackPionts ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-900 dark:bg-gray-700 text-white tabular-nums">
                              {ticket.offenseBlackPionts}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </TableCell>

                        {/* Fine */}
                        <TableCell className="py-3.5">
                          <span className="text-base font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                            {(ticket.ticketTotalFine || ticket.ticketFine || 0).toLocaleString()}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${payable.className}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${payable.dot}`} />
                              {payable.label}
                            </span>
                            {isConfiscated && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800">
                                <ShieldAlert className="w-3 h-3" />
                                {isRTL ? 'مطلوب للحجز' : 'Wanted'}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(ticket)}
                            title={isRTL ? 'عرض التفاصيل' : 'View Details'}
                            className="w-8 h-8 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Footer count */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {isRTL
                    ? `${tickets.length} مخالفة`
                    : `${tickets.length} fine${tickets.length !== 1 ? 's' : ''}`}
                  {(searchQuery || statusFilter !== 'all') && (
                    <span className="ml-1 text-orange-500">
                      {isRTL ? '(مصفّاة)' : '(filtered)'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      <ViewFineModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        confiscatedInfo={confiscatedList.find(
          (c) => (c.violations || []).some(v => String(v.ticketNo) === String(selectedTicket?.ticketNo))
        )}
      />
    </div>
  );
}