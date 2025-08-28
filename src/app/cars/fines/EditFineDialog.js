import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

const emirates = [
  'أبوظبي',
  'دبي',
  'الشارقة',
  'عجمان',
  'أم القيوين',
  'رأس الخيمة',
  'الفجيرة'
];

const reasons = [
  'السرعة',
  'وقوف خاطئ',
  'عدم ربط الحزام',
  'استخدام الهاتف أثناء القيادة',
  'تجاوز الإشارة الحمراء',
  'انتهاء ملكية المركبة',
  'غيرها'
];

// مصادر لكل إمارة
const sourcesByEmirate = {
  'أبوظبي': [
    'شرطة أبوظبي',
    'دائرة البلديات والنقل',
    'مواقف',
    'درب',
    'غيرها'
  ],
  'دبي': [
    'شرطة دبي',
    'سالك',
    'هيئة الطرق والمواصلات',
    'بلدية دبي',
    'مواقف',
    'غيرها'
  ],
  'الشارقة': [
    'شرطة الشارقة',
    'بلدية الشارقة',
    'مواقف',
    'هيئة الطرق والمواصلات',
    'غيرها'
  ],
  'عجمان': [
    'شرطة عجمان',
    'بلدية عجمان',
    'مواقف',
    'غيرها'
  ],
  'أم القيوين': [
    'شرطة أم القيوين',
    'بلدية أم القيوين',
    'مواقف',
    'غيرها'
  ],
  'رأس الخيمة': [
    'شرطة رأس الخيمة',
    'بلدية رأس الخيمة',
    'مواقف',
    'غيرها'
  ],
  'الفجيرة': [
    'شرطة الفجيرة',
    'بلدية الفجيرة',
    'مواقف',
    'غيرها'
  ],
};

export default function EditFineDialog({ open, onOpenChange, fine, onSave }) {
  const [form, setForm] = useState({
    fineNumber: fine?.fineNumber || '', // <-- Add this line
    carPlate: fine?.carPlate || '',
    amount: fine?.amount || '',
    date: fine?.date ? new Date(fine.date) : null,
    reason: fine?.reason || '',
    emirate: fine?.emirate || '',
    source: fine?.source || '',
    status: fine?.status || 'unpaid',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Date change handler
  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handleEmirateChange = (value) => {
    setForm((prev) => ({
      ...prev,
      emirate: value,
      source: '', // reset source when emirate changes
    }));
  };

  const handleReasonChange = (value) => {
    setForm((prev) => ({ ...prev, reason: value }));
  };

  const handleSourceChange = (value) => {
    setForm((prev) => ({ ...prev, source: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      // Convert date to ISO string before saving
      onSave({ ...form, date: form.date ? form.date.toISOString().slice(0, 10) : "" });
    }
    onOpenChange(false);
  };

  if (!fine) return null;

  // مصادر الإمارة المختارة
  const emirateSources = sourcesByEmirate[form.emirate] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4  text-center border-b pb-2">تعديل المخالفة</DialogTitle>
        </DialogHeader>
      <form className="space-y-4 h-96 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 overflow-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">رقم المخالفة</label>
            <Input
              name="fineNumber"
              value={form.fineNumber}
              onChange={handleChange}
              placeholder="رقم المخالفة"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">رقم اللوحة</label>
            <Input
              name="carPlate"
              value={form.carPlate}
              onChange={handleChange}
              placeholder="رقم اللوحة"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">المبلغ</label>
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="المبلغ"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">التاريخ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-right"
                  type="button"
                >
                  {form.date ? format(form.date, "yyyy-MM-dd") : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={form.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">السبب</label>
            <Select dir="rtl" value={form.reason} onValueChange={handleReasonChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر السبب" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">الإمارة</label>
            <Select dir="rtl" value={form.emirate} onValueChange={handleEmirateChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الإمارة" />
              </SelectTrigger>
              <SelectContent>
                {emirates.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">المصدر</label>
            <Select dir="rtl" value={form.source} onValueChange={handleSourceChange} disabled={!form.emirate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={form.emirate ? "اختر المصدر" : "اختر الإمارة أولاً"} />
              </SelectTrigger>
              <SelectContent>
                {emirateSources.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">الحالة</label>
            <Select dir="rtl" value={form.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex col-span-2 flex-row-reverse gap-2 mt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}