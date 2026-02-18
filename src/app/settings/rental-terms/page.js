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
import { Plus, ScrollText, Loader2, Edit, Trash2, ToggleLeft } from 'lucide-react';
import { getRentalTerms, createRentalTerm, updateRentalTerm, deleteRentalTerm, toggleRentalTermStatus } from '../../services/api/rentalTerms';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RentalTermsPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    is_active: true,
  });

  // Fetch rental terms
  const { data: termsData, error, isLoading, mutate } = useSWR('rental-terms', getRentalTerms, {
    revalidateOnFocus: false,
  });

  const terms = termsData?.data || [];

  // Reset form
  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      is_active: true,
    });
  };

  // Open add modal
  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open edit modal
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

  // Open delete modal
  const handleOpenDelete = (term) => {
    setSelectedTerm(term);
    setIsDeleteModalOpen(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add submit
  const handleAdd = async () => {
    if (!formData.title_ar || !formData.title_en || !formData.content_ar || !formData.content_en) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await createRentalTerm(formData);
      toast.success(isRTL ? 'تم إضافة الشرط بنجاح' : 'Term added successfully');
      mutate();
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(isRTL ? 'فشل في إضافة الشرط' : 'Failed to add term');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit submit
  const handleEdit = async () => {
    if (!formData.title_ar || !formData.title_en || !formData.content_ar || !formData.content_en) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateRentalTerm(selectedTerm.id, formData);
      toast.success(isRTL ? 'تم تحديث الشرط بنجاح' : 'Term updated successfully');
      mutate();
      setIsEditModalOpen(false);
      setSelectedTerm(null);
      resetForm();
    } catch (err) {
      toast.error(isRTL ? 'فشل في تحديث الشرط' : 'Failed to update term');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRentalTerm(selectedTerm.id);
      toast.success(isRTL ? 'تم حذف الشرط بنجاح' : 'Term deleted successfully');
      mutate();
      setIsDeleteModalOpen(false);
      setSelectedTerm(null);
    } catch (err) {
      toast.error(isRTL ? 'فشل في حذف الشرط' : 'Failed to delete term');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle status
  const handleToggle = async (term) => {
    try {
      await toggleRentalTermStatus(term.id, !term.is_active);
      toast.success(
        isRTL
          ? `تم ${term.is_active ? 'تعطيل' : 'تفعيل'} الشرط بنجاح`
          : `Term ${term.is_active ? 'deactivated' : 'activated'} successfully`
      );
      mutate();
    } catch (err) {
      toast.error(isRTL ? 'فشل في تغيير حالة الشرط' : 'Failed to toggle term status');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <ScrollText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isRTL ? 'شروط وأحكام العقود' : 'Rental Terms & Conditions'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? 'إدارة الشروط والأحكام الخاصة بعقود التأجير' : 'Manage rental contract terms and conditions'}
            </p>
          </div>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isRTL ? 'إضافة شرط' : 'Add Term'}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              {isRTL ? 'فشل تحميل البيانات' : 'Failed to load data'}
            </p>
          </div>
        ) : terms.length === 0 ? (
          <div className="text-center py-12">
            <ScrollText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isRTL ? 'لا توجد شروط وأحكام' : 'No terms and conditions found'}
            </p>
            <Button onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'إضافة أول شرط' : 'Add First Term'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}</TableHead>
                  <TableHead>{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}</TableHead>
                  <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className={isRTL ? "text-left" : "text-right"}>
                    {isRTL ? 'الإجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term, index) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="font-medium truncate" dir="rtl">{term.title_ar}</div>
                        <div className="text-xs text-gray-500 truncate mt-1" dir="rtl">
                          {term.content_ar?.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="font-medium truncate">{term.title_en}</div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {term.content_en?.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={term.is_active ? 'default' : 'secondary'}>
                        {term.is_active
                          ? (isRTL ? 'مفعّل' : 'Active')
                          : (isRTL ? 'معطّل' : 'Inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggle(term)}
                          title={isRTL ? 'تغيير الحالة' : 'Toggle Status'}
                        >
                          <ToggleLeft className={`w-4 h-4 ${term.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(term)}
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(term)}
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title={isRTL ? 'إضافة شرط جديد' : 'Add New Term'}
        size="lg"
      >
        <CustomModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_title_ar">{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'} *</Label>
                <Input
                  id="add_title_ar"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter Arabic title'}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_title_en">{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'} *</Label>
                <Input
                  id="add_title_en"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter English title'}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_content_ar">{isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'} *</Label>
              <Textarea
                id="add_content_ar"
                name="content_ar"
                value={formData.content_ar}
                onChange={handleChange}
                placeholder={isRTL ? 'أدخل المحتوى بالعربية' : 'Enter Arabic content'}
                dir="rtl"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_content_en">{isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'} *</Label>
              <Textarea
                id="add_content_en"
                name="content_en"
                value={formData.content_en}
                onChange={handleChange}
                placeholder={isRTL ? 'أدخل المحتوى بالإنجليزية' : 'Enter English content'}
                dir="ltr"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="add_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="add_is_active">{isRTL ? 'مفعّل' : 'Active'}</Label>
            </div>
          </div>
        </CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }} disabled={isSubmitting}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleAdd} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isRTL ? 'إضافة' : 'Add'}
          </Button>
        </CustomModalFooter>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedTerm(null); resetForm(); }}
        title={isRTL ? 'تعديل الشرط' : 'Edit Term'}
        size="lg"
      >
        <CustomModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_title_ar">{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'} *</Label>
                <Input
                  id="edit_title_ar"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter Arabic title'}
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_title_en">{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'} *</Label>
                <Input
                  id="edit_title_en"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter English title'}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_content_ar">{isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'} *</Label>
              <Textarea
                id="edit_content_ar"
                name="content_ar"
                value={formData.content_ar}
                onChange={handleChange}
                placeholder={isRTL ? 'أدخل المحتوى بالعربية' : 'Enter Arabic content'}
                dir="rtl"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_content_en">{isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'} *</Label>
              <Textarea
                id="edit_content_en"
                name="content_en"
                value={formData.content_en}
                onChange={handleChange}
                placeholder={isRTL ? 'أدخل المحتوى بالإنجليزية' : 'Enter English content'}
                dir="ltr"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit_is_active">{isRTL ? 'مفعّل' : 'Active'}</Label>
            </div>
          </div>
        </CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedTerm(null); resetForm(); }} disabled={isSubmitting}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleEdit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>
        </CustomModalFooter>
      </CustomModal>

      {/* Delete Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedTerm(null); }}
        title={isRTL ? 'حذف الشرط' : 'Delete Term'}
        size="sm"
      >
        <CustomModalBody>
          <div className="text-center py-4">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300">
              {isRTL
                ? `هل أنت متأكد من حذف "${selectedTerm?.title_ar}"؟`
                : `Are you sure you want to delete "${selectedTerm?.title_en}"?`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {isRTL ? 'لا يمكن التراجع عن هذا الإجراء' : 'This action cannot be undone'}
            </p>
          </div>
        </CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedTerm(null); }} disabled={isSubmitting}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
            {isRTL ? 'حذف' : 'Delete'}
          </Button>
        </CustomModalFooter>
      </CustomModal>
    </div>
  );
}
