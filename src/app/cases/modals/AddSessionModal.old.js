'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { createSession } from '@/app/services/api/sessions';
import { getLegalPeriods } from '@/app/services/api/legalPeriods';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { uploadFiles } from '../../../../utils/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Save, Settings, FileText, Plus, CircleX, Clock, CalendarIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import AddLegalPeriodModal from '@/app/cases/add-case/sessions/AddLegalPeriodModal';

// Helper function to format date for MySQL
const formatDateForMySQL = (dateString) => {
  const date = new Date(dateString);
  // Format as YYYY-MM-DD HH:MM:SS
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const AddSessionModal = ({ isOpen, onClose, caseId, onSessionAdded }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const isRtl = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [legalPeriods, setLegalPeriods] = useState([]);
  const [isAddLegalPeriodOpen, setIsAddLegalPeriodOpen] = useState(false);
  
  // Fetch legal periods when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLegalPeriods();
    }
  }, [isOpen]);

  const fetchLegalPeriods = async () => {
    try {
      const data = await getLegalPeriods();
      if (data.success) {
        setLegalPeriods(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching legal periods:', error);
    }
  };
  
  // File handling functions
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      toast.error(
        isRtl ? `الملف "${file.name}" كبير جداً. الحد الأقصى 10MB` : `File "${file.name}" is too large. Maximum size is 10MB`,
        { position: "top-right", autoClose: 3000 }
      );
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        isRtl ? `نوع الملف "${file.name}" غير مدعوم` : `File type of "${file.name}" is not supported`,
        { position: "top-right", autoClose: 3000 }
      );
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(validateFile);
    setSelectedFiles(prev => [...prev, ...validFiles]);
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(validateFile);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  // Validation schema
  const validationSchema = Yup.object({
    session_date: Yup.date()
      .required(isRtl ? "تاريخ الجلسة مطلوب" : "Session date is required"),
    session_time: Yup.string()
      .required(isRtl ? "وقت الجلسة مطلوب" : "Session time is required"),
    note: Yup.string().trim(),
    // link: Yup.string().url(isRtl ? "رابط غير صحيح" : "Invalid URL").trim(),
    is_expert_session: Yup.boolean(),
    is_judgment_reserved: Yup.boolean(),
    status: Yup.boolean(),
    has_ruling: Yup.boolean(),
    ruling: Yup.string().when('has_ruling', {
      is: true,
      then: (schema) => schema.required(isRtl ? "منطوق الحكم مطلوب" : "Ruling text is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    ruling_date: Yup.date().when('has_ruling', {
      is: true,
      then: (schema) => schema.required(isRtl ? "تاريخ صدور الحكم مطلوب" : "Ruling date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    legal_period_id: Yup.string().when('has_ruling', {
      is: true,
      then: (schema) => schema.required(isRtl ? "المدة القانونية مطلوبة" : "Legal period is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      session_date: '',
      session_time: '',
      note: '',
      link: '',
      is_expert_session: false,
      is_judgment_reserved: false,
      status: true,
      has_ruling: false,
      ruling: '',
      ruling_date: '',
      legal_period_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Upload files first if any are selected
        let uploadedFiles = [];
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          try {
            uploadedFiles = await uploadFiles(selectedFiles, 'sessions');
            toast.success(
              isRtl ? `تم رفع ${uploadedFiles.length} ملف بنجاح` : `Successfully uploaded ${uploadedFiles.length} files`,
              { position: "top-right", autoClose: 2000 }
            );
          } catch (uploadError) {
            toast.error(
              isRtl ? "فشل في رفع الملفات" : "Failed to upload files",
              { position: "top-right", autoClose: 3000 }
            );

            // Continue with form submission even if file upload fails
            uploadedFiles = [];
          }
        }

        // Combine date and time for API
        const combinedDateTime = `${values.session_date}T${values.session_time}:00`;

        const sessionData = {
          case_id: caseId,
          session_date: formatDateForMySQL(combinedDateTime),
          link: values.link.trim() || null,
          is_expert_session: values.is_expert_session,
          is_judgment_reserved: values.is_judgment_reserved,
          status: values.status ? 'active' : 'inactive',
          note: values.note.trim() || null,
          has_ruling: values.has_ruling,
          ruling: values.ruling.trim() || null,
          ruling_date: values.ruling_date || null,
          legal_period_id: values.legal_period_id || null,
          files: uploadedFiles,
        };

        const response = await createSession(sessionData);
        
        if (response?.success === false) {
          toast.error(
            response?.message || (isRtl ? "فشل في إضافة الجلسة" : "Failed to add session"),
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
          return;
        }
        
        if (response.success) {
          toast.success(
            isRtl ? "تم إضافة الجلسة بنجاح" : "Session added successfully",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          
          // Clear selected files
          setSelectedFiles([]);
          formik.resetForm();
          onSessionAdded && onSessionAdded(response.data);
          onClose();
        }
      } catch (error) {
        // Check if it's a permission error (403)
        const isPermissionError = error?.response?.status === 403;
        const errorMessage = isPermissionError 
          ? (error?.response?.data?.message || (isRtl ? "ليس لديك صلاحية لإضافة جلسة" : "You do not have permission to add a session"))
          : (error?.response?.data?.message || (isRtl ? "فشل في إضافة الجلسة" : "Failed to add session"));
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
        setIsUploading(false);
      }
    },
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 h-[90vh] flex flex-col bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className={`pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-6 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isRtl ? "إضافة جلسة" : "Add Session"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isRtl 
                    ? "أدخل معلومات الجلسة الجديدة أدناه"
                    : "Enter the new session information below"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
            >
              <CircleX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form wrapper */}
        <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-6">
            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="text-md font-medium text-gray-900">
                    {isRtl ? "المعلومات الأساسية" : "Basic Information"}
                  </h3>
                </div>

                {/* Session Date and Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Session Date Field */}
                  <div className="space-y-2">
                    <Label htmlFor="session_date" className="text-sm font-medium text-gray-700">
                      {isRtl ? "تاريخ الجلسة" : "Session Date"} *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start font-normal",
                            !formik.values.session_date && "text-muted-foreground",
                            isRtl ? "text-right" : "text-left",
                            formik.touched.session_date && formik.errors.session_date && "border-red-500"
                          )}
                        >
                          <CalendarIcon className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                          {formik.values.session_date ? (
                            format(new Date(formik.values.session_date), "PPP", { locale: isRtl ? ar : undefined })
                          ) : (
                            <span>{isRtl ? "اختر تاريخ الجلسة" : "Pick session date"}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formik.values.session_date ? new Date(formik.values.session_date) : null}
                          onSelect={(date) => formik.setFieldValue('session_date', date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.session_date && formik.errors.session_date && (
                      <p className="text-sm text-red-500">
                        {formik.errors.session_date}
                      </p>
                    )}
                  </div>

                  {/* Session Time Field */}
                  <div className="space-y-2">
                    <Label htmlFor="session_time" className="text-sm font-medium text-gray-700">
                      {isRtl ? "وقت الجلسة" : "Session Time"} *
                    </Label>
                    <Input
                      id="session_time"
                      name="session_time"
                      type="time"
                      value={formik.values.session_time}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`${isRtl ? "text-right" : "text-left"} focus:ring-2 focus:ring-blue-500 border-gray-300`}
                    />
                    {formik.touched.session_time && formik.errors.session_time && (
                      <p className="text-sm text-red-500">
                        {formik.errors.session_time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Note Field */}
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                    {isRtl ? "ملاحظات" : "Notes"}
                  </Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formik.values.note}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={isRtl ? "أدخل الملاحظات" : "Enter notes"}
                    className={`min-h-[100px] resize-none ${isRtl ? "text-right" : "text-left"} focus:ring-2 focus:ring-blue-500 border-gray-300`}
                  />
                  {formik.touched.note && formik.errors.note && (
                    <p className="text-sm text-red-500">
                      {formik.errors.note}
                    </p>
                  )}
                </div>

                {/* Link Field */}
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium text-gray-700">
                    {isRtl ? "الرابط" : "Link"}
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    type="text"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={isRtl ? "أدخل الرابط" : "Enter link"}
                    className={`${isRtl ? "text-right" : "text-left"} focus:ring-2 focus:ring-blue-500 border-gray-300`}
                  />
                  {formik.touched.link && formik.errors.link && (
                    <p className="text-sm text-red-500">
                      {formik.errors.link}
                    </p>
                  )}
                </div>
              </div>

              {/* Session Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <h3 className="text-md font-medium text-gray-900">
                    {isRtl ? "إعدادات الجلسة" : "Session Settings"}
                  </h3>
                </div>

                {/* Session Options - Using Switches */}
                <div className="space-y-3">
                  {/* Session Status Switch */}
                  <div className={cn(
                    "p-4 rounded-lg",
                    formik.values.is_judgment_reserved ? "bg-red-50 border-2 border-red-200" : "bg-gray-50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label 
                          htmlFor="status" 
                          className="text-sm font-medium text-gray-700"
                        >
                          {isRtl ? "حالة الجلسة" : "Session Status"}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {formik.values.status 
                            ? (isRtl ? "الجلسة نشطة" : "Session is active")
                            : (isRtl ? "الجلسة غير نشطة" : "Session is inactive")
                          }
                          {formik.values.is_judgment_reserved && (
                            <span className="block text-red-600 font-medium mt-1">
                              {isRtl ? "تم تعطيل الجلسة تلقائياً بسبب حجز الحكم" : "Session auto-disabled due to judgment reserved"}
                            </span>
                          )}
                        </p>
                      </div>
                      <Switch
                        id="status"
                        checked={formik.values.status}
                        onCheckedChange={(checked) => 
                          formik.setFieldValue("status", checked)
                        }
                        disabled={formik.values.is_judgment_reserved}
                      />
                    </div>
                  </div>

                  {/* Expert Session Switch */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label 
                          htmlFor="is_expert_session" 
                          className="text-sm font-medium text-gray-700"
                        >
                          {isRtl ? "جلسة خبير" : "Expert Session"}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {formik.values.is_expert_session 
                            ? (isRtl ? "هذه جلسة خبير" : "This is an expert session")
                            : (isRtl ? "ليست جلسة خبير" : "Not an expert session")
                          }
                        </p>
                      </div>
                      <Switch
                        id="is_expert_session"
                        checked={formik.values.is_expert_session}
                        onCheckedChange={(checked) => 
                          formik.setFieldValue("is_expert_session", checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Judgment Reserved Switch */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label 
                          htmlFor="is_judgment_reserved" 
                          className="text-sm font-medium text-gray-700"
                        >
                          {isRtl ? "حجز للحكم" : "Judgment Reserved"}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {formik.values.is_judgment_reserved 
                            ? (isRtl ? "الحكم محجوز" : "Judgment is reserved")
                            : (isRtl ? "الحكم غير محجوز" : "Judgment is not reserved")
                          }
                        </p>
                      </div>
                      <Switch
                        id="is_judgment_reserved"
                        checked={formik.values.is_judgment_reserved}
                        onCheckedChange={(checked) => {
                          formik.setFieldValue("is_judgment_reserved", checked);
                          // If judgment is reserved, set status to inactive
                          if (checked) {
                            formik.setFieldValue("status", false);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Has Ruling Switch */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label 
                          htmlFor="has_ruling" 
                          className="text-sm font-medium text-gray-700"
                        >
                          {isRtl ? "حكم صادر" : "Has Ruling"}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {formik.values.has_ruling 
                            ? (isRtl ? "يوجد حكم صادر" : "Ruling has been issued")
                            : (isRtl ? "لا يوجد حكم" : "No ruling issued")
                          }
                        </p>
                      </div>
                      <Switch
                        id="has_ruling"
                        checked={formik.values.has_ruling}
                        onCheckedChange={(checked) => 
                          formik.setFieldValue("has_ruling", checked)
                        }
                      />
                    </div>
                  </div>
                  
                  {/* Ruling Text and Legal Period - Show when has_ruling is true */}
                  {formik.values.has_ruling && (
                    <div className="space-y-4 pl-4 border-l-4 border-blue-200">
                      {/* Ruling Textarea */}
                      <div className="space-y-2">
                        <Label htmlFor="ruling" className="text-sm font-medium text-gray-700">
                          {isRtl ? "منطوق الحكم" : "Ruling Text"} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="ruling"
                          name="ruling"
                          value={formik.values.ruling}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={isRtl ? "أدخل منطوق الحكم" : "Enter ruling text"}
                          rows={3}
                          className={cn(
                            isRtl ? "text-right" : "text-left",
                            "resize-none",
                            formik.touched.ruling && formik.errors.ruling && "border-red-500"
                          )}
                        />
                        {formik.touched.ruling && formik.errors.ruling && (
                          <p className="text-sm text-red-500">{formik.errors.ruling}</p>
                        )}
                      </div>

                      {/* Ruling Date */}
                      <div className="space-y-2">
                        <Label htmlFor="ruling_date" className="text-sm font-medium text-gray-700">
                          {isRtl ? "تاريخ صدور الحكم" : "Ruling Date"} <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start font-normal",
                                !formik.values.ruling_date && "text-muted-foreground",
                                isRtl ? "text-right" : "text-left",
                                formik.touched.ruling_date && formik.errors.ruling_date && "border-red-500"
                              )}
                            >
                              <CalendarIcon className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                              {formik.values.ruling_date ? (
                                format(new Date(formik.values.ruling_date), "PPP", { locale: isRtl ? ar : undefined })
                              ) : (
                                <span>{isRtl ? "اختر تاريخ صدور الحكم" : "Pick ruling date"}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={formik.values.ruling_date ? new Date(formik.values.ruling_date) : null}
                              onSelect={(date) => formik.setFieldValue('ruling_date', date ? format(date, 'yyyy-MM-dd') : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {formik.touched.ruling_date && formik.errors.ruling_date && (
                          <p className="text-sm text-red-500">{formik.errors.ruling_date}</p>
                        )}
                      </div>

                      {/* Legal Period Select */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="legal_period_id" className="text-sm font-medium text-gray-700">
                            {isRtl ? "المدة القانونية" : "Legal Period"} <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setIsAddLegalPeriodOpen(true)}
                            className="h-7 gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span className="text-xs">{isRtl ? "إضافة" : "Add"}</span>
                          </Button>
                        </div>
                        <Select
                          value={formik.values.legal_period_id?.toString()}
                          onValueChange={(value) => formik.setFieldValue('legal_period_id', value)}
                        >
                          <SelectTrigger className={cn(
                            formik.touched.legal_period_id && formik.errors.legal_period_id && "border-red-500"
                          )}>
                            <SelectValue placeholder={isRtl ? "اختر المدة القانونية" : "Select Legal Period"} />
                          </SelectTrigger>
                          <SelectContent className="z-[10001]">
                            {legalPeriods.map((period) => (
                              <SelectItem key={period.id} value={period.id.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{period.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {[
                                      period.objection_days && `${isRtl ? 'التظلم' : 'Objection'}: ${period.objection_days} ${isRtl ? 'يوم' : 'days'}`,
                                      period.appeal_days && `${isRtl ? 'الاستئناف' : 'Appeal'}: ${period.appeal_days} ${isRtl ? 'يوم' : 'days'}`,
                                      period.cassation_days && `${isRtl ? 'الطعن' : 'Cassation'}: ${period.cassation_days} ${isRtl ? 'يوم' : 'days'}`
                                    ].filter(Boolean).join(' - ')}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formik.touched.legal_period_id && formik.errors.legal_period_id && (
                          <p className="text-sm text-red-500">{formik.errors.legal_period_id}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Plus className="h-4 w-4 text-gray-500" />
                  <h3 className="text-md font-medium text-gray-900">
                    {isRtl ? "رفع الملفات" : "Upload Files"}
                  </h3>
                </div>

                {/* File Drop Zone */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isRtl 
                        ? "انقر لاختيار الملفات أو اسحبها هنا"
                        : "Click to select files or drag and drop here"
                      }
                    </p>
                    <p className="text-xs text-gray-400">
                      {isRtl 
                        ? "PDF, DOC, TXT أو صور"
                        : "PDF, DOC, TXT, or images"
                      }
                    </p>
                  </div>
                </div>

                {/* Selected Files Display */}
                {selectedFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {isRtl ? "الملفات المحددة" : "Selected Files"} ({selectedFiles.length})
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFiles}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {isRtl ? "مسح الكل" : "Clear All"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelectedFile(index)}
                            className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <CircleX className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-100 p-6 bg-white rounded-b-lg">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex items-center gap-2 px-6"
              >
                <CircleX className="h-4 w-4" />
                {isRtl ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isUploading
                  ? (isRtl ? "جار رفع الملفات..." : "Uploading files...")
                  : isLoading 
                    ? (isRtl ? "جار الإضافة..." : "Adding...") 
                    : (isRtl ? "إضافة" : "Add")}
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Add Legal Period Modal */}
      <AddLegalPeriodModal
        open={isAddLegalPeriodOpen}
        onOpenChange={setIsAddLegalPeriodOpen}
        onSuccess={() => {
          fetchLegalPeriods();
          setIsAddLegalPeriodOpen(false);
        }}
      />
    </div>,
    document.body
  );
};

export default AddSessionModal;