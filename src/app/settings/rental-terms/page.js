"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomModal, CustomModalBody, CustomModalFooter } from '@/components/ui/custom-modal';
import { Plus, ScrollText, Loader2, Edit, Trash2, ToggleLeft, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { getRentalTerms, createRentalTerm, updateRentalTerm, deleteRentalTerm, toggleRentalTermStatus } from '../../services/api/rentalTerms';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RentalTermsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    is_active: true,
  });

  const { data: termsData, error, isLoading, mutate } = useSWR('rental-terms', getRentalTerms, {
    revalidateOnFocus: false,
  });

  const terms = termsData?.data || [];
  const activeCount = terms.filter(t => t.is_active).length;
  const inactiveCount = terms.length - activeCount;

  const resetForm = () => {
    setFormData({ title_ar: '', title_en: '', content_ar: '', content_en: '', is_active: true });
  };

  const handleOpenAdd = () => { resetForm(); setIsAddModalOpen(true); };
  const handleOpenEdit = (term) => {
    setSelectedTerm(term);
    setFormData({
      title_ar: term.title_ar || '',
      title_en: term.title_en || '',
      content_ar: term.content_ar || '',
      content_en: term.content_en || '',
      is_active: term.is_active ? true : false,
    });
    setIsEditModalOpen(true);
  };
  const handleOpenDelete = (term) => { setSelectedTerm(term); setIsDeleteModalOpen(true); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.title_ar || !formData.title_en || !formData.content_ar || !formData.content_en) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await createRentalTerm(formData);
      toast.success(isRTL ? 'تم إضافة الشرط بنجاح' : 'Term added successfully');
      mutate(); setIsAddModalOpen(false); resetForm();
    } catch { toast.error(isRTL ? 'فشل في إضافة الشرط' : 'Failed to add term'); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = async () => {
    if (!formData.title_ar || !formData.title_en || !formData.content_ar || !formData.content_en) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateRentalTerm(selectedTerm.id, formData);
      toast.success(isRTL ? 'تم تحديث الشرط بنجاح' : 'Term updated successfully');
      mutate(); setIsEditModalOpen(false); setSelectedTerm(null); resetForm();
    } catch { toast.error(isRTL ? 'فشل في تحديث الشرط' : 'Failed to update term'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRentalTerm(selectedTerm.id);
      toast.success(isRTL ? 'تم حذف الشرط بنجاح' : 'Term deleted successfully');
      mutate(); setIsDeleteModalOpen(false); setSelectedTerm(null);
    } catch { toast.error(isRTL ? 'فشل في حذف الشرط' : 'Failed to delete term'); }
    finally { setIsSubmitting(false); }
  };

  const handleToggle = async (term) => {
    try {
      await toggleRentalTermStatus(term.id, !term.is_active);
      toast.success(
        isRTL
          ? `تم ${term.is_active ? 'تعطيل' : 'تفعيل'} الشرط بنجاح`
          : `Term ${term.is_active ? 'deactivated' : 'activated'} successfully`
      );
      mutate();
    } catch { toast.error(isRTL ? 'فشل في تغيير حالة الشرط' : 'Failed to toggle term status'); }
  };

  const FormFields = ({ prefix }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_title_ar`} className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'} *
          </Label>
          <Input
            id={`${prefix}_title_ar`}
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter Arabic title'}
            dir="rtl"
            className="border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}_title_en`} className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'} *
          </Label>
          <Input
            id={`${prefix}_title_en`}
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            placeholder="Enter English title"
            dir="ltr"
            className="border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}_content_ar`} className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'} *
        </Label>
        <Textarea
          id={`${prefix}_content_ar`}
          name="content_ar"
          value={formData.content_ar}
          onChange={handleChange}
          placeholder={isRTL ? 'أدخل المحتوى بالعربية' : 'Enter Arabic content'}
          dir="rtl"
          rows={4}
          className="border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}_content_en`} className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'} *
        </Label>
        <Textarea
          id={`${prefix}_content_en`}
          name="content_en"
          value={formData.content_en}
          onChange={handleChange}
          placeholder="Enter English content"
          dir="ltr"
          rows={4}
          className="border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg resize-none"
        />
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
        <Switch
          id={`${prefix}_is_active`}
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          className="data-[state=checked]:bg-amber-500"
        />
        <div>
          <Label htmlFor={`${prefix}_is_active`} className="text-sm font-medium cursor-pointer">
            {isRTL ? 'مفعّل' : 'Active'}
          </Label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isRTL
              ? (formData.is_active ? 'هذا الشرط مرئي وسيظهر في العقود' : 'هذا الشرط مخفي ولن يظهر في العقود')
              : (formData.is_active ? 'This term is visible and will appear in contracts' : 'This term is hidden and won\'t appear in contracts')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="container mx-auto py-8 px-4 max-w-6xl">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon badge */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
                  <ScrollText className="w-7 h-7   " />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-950" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                  {isRTL ? 'شروط وأحكام العقود' : 'Rental Terms & Conditions'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {isRTL ? 'إدارة الشروط والأحكام الخاصة بعقود التأجير' : 'Manage rental contract terms and conditions'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleOpenAdd}
              // className="     border-0 shadow-sm shadow-amber-200 dark:shadow-amber-900/20 rounded-xl px-5 font-medium transition-all hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'إضافة شرط' : 'Add Term'}
            </Button>
          </div>

          {/* ── Stats strip ── */}
          {!isLoading && !error && terms.length > 0 && (
            <div className="flex items-center gap-3 mt-5">
              <StatPill icon={<FileText className="w-3.5 h-3.5" />} label={isRTL ? 'المجموع' : 'Total'} value={terms.length} color="gray" />
              <StatPill icon={<CheckCircle2 className="w-3.5 h-3.5" />} label={isRTL ? 'مفعّل' : 'Active'} value={activeCount} color="emerald" />
              <StatPill icon={<XCircle className="w-3.5 h-3.5" />} label={isRTL ? 'معطّل' : 'Inactive'} value={inactiveCount} color="gray" />
            </div>
          )}
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
              <p className="text-sm text-gray-400">{isRTL ? 'جارٍ التحميل…' : 'Loading…'}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm text-red-500">{isRTL ? 'فشل تحميل البيانات' : 'Failed to load data'}</p>
            </div>
          ) : terms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  {isRTL ? 'لا توجد شروط وأحكام' : 'No terms yet'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {isRTL ? 'ابدأ بإضافة أول شرط' : 'Get started by adding your first term'}
                </p>
              </div>
              <Button
                onClick={handleOpenAdd}
                // className="mt-1      border-0 rounded-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة أول شرط' : 'Add First Term'}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-50/70">
                    <TableHead className="w-12 text-xs font-semibold uppercase tracking-wider text-gray-400 pl-6">#</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 w-28">
                      {isRTL ? 'الحالة' : 'Status'}
                    </TableHead>
                    <TableHead className={`text-xs font-semibold uppercase tracking-wider text-gray-400 w-32 pr-6 ${isRTL ? 'text-left' : 'text-right'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {terms.map((term, index) => (
                    <TableRow
                      key={term.id}
                      className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors group"
                    >
                      <TableCell className="pl-6">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[260px]">
                          <div className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate" dir="rtl">
                            {term.title_ar}
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed" dir="rtl">
                            {term.content_ar?.substring(0, 65)}…
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[260px]">
                          <div className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                            {term.title_en}
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed">
                            {term.content_en?.substring(0, 65)}…
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {term.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {isRTL ? 'مفعّل' : 'Active'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {isRTL ? 'معطّل' : 'Inactive'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className={`flex items-center gap-1 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                          {/* Toggle */}
                          <button
                            onClick={() => handleToggle(term)}
                            title={isRTL ? 'تغيير الحالة' : 'Toggle Status'}
                            className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                              term.is_active
                                ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <ToggleLeft className="w-4 h-4" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(term)}
                            title={isRTL ? 'تعديل' : 'Edit'}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleOpenDelete(term)}
                            title={isRTL ? 'حذف' : 'Delete'}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Modal ── */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title={isRTL ? 'إضافة شرط جديد' : 'Add New Term'}
        size="lg"
      >
        <CustomModalBody><FormFields prefix="add" /></CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }} disabled={isSubmitting} className="rounded-xl">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleAdd} disabled={isSubmitting} className="     border-0 rounded-xl">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isRTL ? 'إضافة' : 'Add Term'}
          </Button>
        </CustomModalFooter>
      </CustomModal>

      {/* ── Edit Modal ── */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedTerm(null); resetForm(); }}
        title={isRTL ? 'تعديل الشرط' : 'Edit Term'}
        size="lg"
      >
        <CustomModalBody><FormFields prefix="edit" /></CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedTerm(null); resetForm(); }} disabled={isSubmitting} className="rounded-xl">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleEdit} disabled={isSubmitting} className="     border-0 rounded-xl">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>
        </CustomModalFooter>
      </CustomModal>

      {/* ── Delete Modal ── */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedTerm(null); }}
        title={isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
        size="sm"
      >
        <CustomModalBody>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
              {isRTL ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL
                ? <>سيتم حذف <span className="font-medium text-gray-700 dark:text-gray-300">&quot;{selectedTerm?.title_ar}&quot;</span> نهائياً</>
                : <>Delete <span className="font-medium text-gray-700 dark:text-gray-300">&quot;{selectedTerm?.title_en}&quot;</span> permanently</>}
            </p>
            <p className="text-xs text-red-400 mt-3 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {isRTL ? '⚠ لا يمكن التراجع عن هذا الإجراء' : '⚠ This action cannot be undone'}
            </p>
          </div>
        </CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedTerm(null); }} disabled={isSubmitting} className="rounded-xl flex-1">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="rounded-xl flex-1">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
            {isRTL ? 'حذف' : 'Delete'}
          </Button>
        </CustomModalFooter>
      </CustomModal>
    </div>
  );
}

// ── Stat Pill ──
function StatPill({ icon, label, value, color }) {
  const colors = {
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {icon}
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}