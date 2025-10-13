'use client';

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSession } from '@/app/services/api/sessions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { uploadFiles } from '../../../../utils/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Save, Settings, FileText, Plus, CircleX, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

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
            console.error("File upload error:", uploadError);
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
          note: values.note.trim() || null,
          files: uploadedFiles,
        };

        const response = await createSession(sessionData);
        
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
        } else {
          toast.error(
            isRtl ? "فشل في إضافة الجلسة" : "Failed to add session",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        }
      } catch (error) {
        toast.error(
          isRtl ? "فشل في إضافة الجلسة" : "Failed to add session",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        console.error("Error creating session:", error);
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
                    <Input
                      id="session_date"
                      name="session_date"
                      type="date"
                      value={formik.values.session_date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`${isRtl ? "text-right" : "text-left"} focus:ring-2 focus:ring-blue-500 border-gray-300`}
                    />
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
                        onCheckedChange={(checked) => 
                          formik.setFieldValue("is_judgment_reserved", checked)
                        }
                      />
                    </div>
                  </div>
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
    </div>,
    document.body
  );
};

export default AddSessionModal;