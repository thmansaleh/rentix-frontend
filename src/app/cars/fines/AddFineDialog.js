import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

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

// Add this array at the top (replace with your actual plate numbers)
const plateNumbers = [
  'A12345',
  'B67890',
  'C54321',
  'D98765',
  'E11223',
  // ... add more as needed
];

export default function AddFineDialog({ open, onOpenChange, onAdd, isPlate = false, plateValue = '' }) {
  const [form, setForm] = useState({
    carPlate: isPlate ? plateValue : '',
    amount: '',
    date: null,
    reason: '',
    emirate: '',
    source: '',
    status: 'unpaid',
    fineNumber: '',
  });

  // Update carPlate if isPlate or plateValue changes
  React.useEffect(() => {
    if (isPlate && plateValue) {
      setForm((prev) => ({ ...prev, carPlate: plateValue }));
    }
  }, [isPlate, plateValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handleEmirateChange = (value) => {
    setForm((prev) => ({
      ...prev,
      emirate: value,
      source: '',
    }));
  };

  const handleReasonChange = (value) => {
    setForm((prev) => ({ ...prev, reason: value }));
  };

  const handleSourceChange = (value) => {
    setForm((prev) => ({ ...prev, source: value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handlePlateChange = (value) => {
    setForm((prev) => ({ ...prev, carPlate: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) {
      const formatted = {
        ...form,
        date: form.date ? format(form.date, 'yyyy-MM-dd') : '',
      };
      onAdd(formatted);
    }
    onOpenChange(false);
    setForm({
      carPlate: '',
      amount: '',
      date: null,
      reason: '',
      emirate: '',
      source: '',
      status: 'unpaid',
      fineNumber: '', // Reset fine number
    });
  };

  const emirateSources = sourcesByEmirate[form.emirate] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4 text-black border-b text-center pb-2">إضافة مخالفة جديدة</DialogTitle>
        </DialogHeader>
        <form className=" grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 h-96 overflow-auto" onSubmit={handleSubmit}>
          {/* Fine Number Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">رقم المخالفة</label>
            <Input
              name="fineNumber"
              type="text"
              value={form.fineNumber}
              onChange={handleChange}
              placeholder="رقم المخالفة"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">رقم اللوحة</label>
            <Select
              value={form.carPlate}
              onValueChange={handlePlateChange}
              disabled={isPlate} // <-- Disable if isPlate is true
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر رقم اللوحة" />
              </SelectTrigger>
              <SelectContent>
                {plateNumbers.map((plate) => (
                  <SelectItem key={plate} value={plate}>{plate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">المبلغ</label>
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="المبلغ"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">التاريخ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                  type="button"
                >
                  {form.date ? format(form.date, 'yyyy-MM-dd') : 'اختر التاريخ'}
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0" dir="rtl">
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
            <Select dir="rtl"  value={form.emirate} onValueChange={handleEmirateChange}>
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
            <Button variant="outline" className='cursor-pointer' type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" className='cursor-pointer'>إضافة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}