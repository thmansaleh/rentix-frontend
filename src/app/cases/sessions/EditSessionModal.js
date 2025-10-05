"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSWR, { mutate } from "swr";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { getSession, updateSession, deleteSessionDocument } from "@/app/services/api/sessions";
import { uploadFiles } from "../../../../utils/fileUpload";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Save, Settings, FileText, Download, Trash2,Plus, CircleX } from "lucide-react";

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

const EditSessionModal = ({ 
  isOpen, 
  onClose, 
  sessionId 
}) => {
  const { language } = useLanguage();
  const t = useTranslations();
  const isRtl = language === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch session data using SWR - only when modal is open
  const { data: sessionData, error: sessionError, isLoading: sessionLoading, mutate: refreshSession } = useSWR(
    sessionId && isOpen ? `session-${sessionId}` : null,
    () => getSession(sessionId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Extract session object from API response
  const session = sessionData?.success ? sessionData.data : null;

  // Handle document deletion
  const handleDeleteDocument = async (documentId, documentName) => {
    const confirmMessage = isRtl 
      ? `هل أنت متأكد من حذف الوثيقة "${documentName}"؟`
      : `Are you sure you want to delete the document "${documentName}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeletingDocumentId(documentId);
    try {
      await deleteSessionDocument(sessionId, documentId);
      
      toast.success(
        isRtl ? "تم حذف الوثيقة بنجاح" : "Document deleted successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Refresh the documents list
      refreshSession();
    } catch (error) {
      toast.error(
        isRtl ? "فشل في حذف الوثيقة" : "Failed to delete document",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error("Error deleting document:", error);
    } finally {
      setDeletingDocumentId(null);
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
    decision: Yup.string().trim(),
    session_date: Yup.date()
      .required(isRtl ? "تاريخ الجلسة مطلوب" : "Session date is required"),
    session_time: Yup.string()
      .required(isRtl ? "وقت الجلسة مطلوب" : "Session time is required"),
    note: Yup.string().trim(),
    // link: Yup.string().url(isRtl ? "رابط غير صحيح" : "Invalid URL").trim(),
    is_expert_session: Yup.boolean(),
    is_judgment_reserved: Yup.boolean(),
    is_judgment_deferred: Yup.boolean(),
    status: Yup.boolean(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      decision: session?.decision || "",
      session_date: session?.session_date 
        ? new Date(session.session_date).toISOString().slice(0, 10)
        : "",
      session_time: session?.session_date 
        ? new Date(session.session_date).toTimeString().slice(0, 5)
        : "",
      note: session?.note || "",
      link: session?.link || "",
      is_expert_session: session?.is_expert_session || false,
      is_judgment_reserved: session?.is_judgment_reserved || false,
      is_judgment_deferred: session?.is_judgment_deferred || false,
      status: session?.status === 'active' || false,
    },
    validationSchema,
    enableReinitialize: true,
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

        // Transform data for API
        const updateData = {
          decision: values.decision.trim() || null,
          session_date: formatDateForMySQL(combinedDateTime),
          note: values.note.trim() || null,
          link: values.link.trim() || null,
          is_expert_session: values.is_expert_session,
          is_judgment_reserved: values.is_judgment_reserved,
          is_judgment_deferred: values.is_judgment_deferred,
          status: values.status ? 'active' : 'inactive',
          files: uploadedFiles, // Add uploaded files to the data
        };

        await updateSession(sessionId, updateData);
        
        toast.success(
          isRtl ? "تم تحديث الجلسة بنجاح" : "Session updated successfully",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Refresh the session data after successful update
        refreshSession();
        
        // Mutate home page data to refresh sessions with/without decisions
        // This will trigger re-fetch of both home page components
        mutate('sessions-with-decisions');
        mutate('sessions-no-decision');
        mutate('sessions-this-week');
        
        // Clear selected files
        setSelectedFiles([]);
        onClose();
      } catch (error) {
        toast.error(
          isRtl 
            ? "فشل في تحديث الجلسة" 
            : "Failed to update session",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        console.error("Error updating session:", error);
      } finally {
        setIsLoading(false);
        setIsUploading(false);
      }
    },
  });

  if (!isOpen) return null;

  // Show loading state while fetching session data
  if (sessionLoading) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {isRtl ? "جار تحميل بيانات الجلسة..." : "Loading session data..."}
            </span>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Show error state if session failed to load
  if (sessionError || !session) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Calendar className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isRtl ? "فشل في تحميل بيانات الجلسة" : "Failed to load session data"}
            </h3>
            <p className="text-gray-500 mb-6">
              {isRtl 
                ? "حدث خطأ أثناء تحميل بيانات الجلسة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading session data. Please try again."
              }
            </p>
            <Button onClick={onClose}>
              {isRtl ? "إغلاق" : "Close"}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

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
                  {isRtl ? "تعديل الجلسة" : "Edit Session"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isRtl 
                    ? "قم بتحديث معلومات الجلسة أدناه"
                    : "Update the session information below"}
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

                {/* Decision Field */}
                <div className="space-y-2">
                  <Label htmlFor="decision" className="text-sm font-medium text-gray-700">
                    {isRtl ? "القرار" : "Decision"}
                  </Label>
                  <Input
                    id="decision"
                    name="decision"
                    value={formik.values.decision}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={isRtl ? "أدخل القرار" : "Enter decision"}
                    className={`${isRtl ? "text-right" : "text-left"} focus:ring-2 focus:ring-blue-500 border-gray-300`}
                  />
                  {formik.touched.decision && formik.errors.decision && (
                    <p className="text-sm text-red-500">
                      {formik.errors.decision}
                    </p>
                  )}
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

                {/* Session Status Switch */}
                <div className="bg-gray-50 p-4 rounded-lg">
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
                      </p>
                    </div>
                    <Switch
                      id="status"
                      checked={formik.values.status}
                      onCheckedChange={(checked) => 
                        formik.setFieldValue("status", checked)
                      }
                    />
                  </div>
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
                        onCheckedChange={(checked) => {
                          formik.setFieldValue("is_judgment_reserved", checked);
                          // Reset is_judgment_deferred when is_judgment_reserved is unchecked
                          if (!checked) {
                            formik.setFieldValue("is_judgment_deferred", false);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Judgment Deferred Switch - Only show when Judgment Reserved is checked */}
                  {formik.values.is_judgment_reserved && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label 
                            htmlFor="is_judgment_deferred" 
                            className="text-sm font-medium text-gray-700"
                          >
                            {isRtl ? "تأجيل الحكم" : "Judgment Deferred"}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {formik.values.is_judgment_deferred 
                              ? (isRtl ? "الحكم مؤجل" : "Judgment is deferred")
                              : (isRtl ? "الحكم غير مؤجل" : "Judgment is not deferred")
                            }
                          </p>
                        </div>
                        <Switch
                          id="is_judgment_deferred"
                          checked={formik.values.is_judgment_deferred}
                          onCheckedChange={(checked) => 
                            formik.setFieldValue("is_judgment_deferred", checked)
                          }
                        />
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

              {/* Session Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <h3 className="text-md font-medium text-gray-900">
                    {isRtl ? "وثائق الجلسة" : "Session Documents"}
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  {sessionLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {isRtl ? "جار تحميل الوثائق..." : "Loading documents..."}
                      </span>
                    </div>
                  ) : sessionError ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-red-500">
                        {isRtl ? "فشل في تحميل الوثائق" : "Failed to load documents"}
                      </p>
                    </div>
                  ) : session?.documents && session.documents.length > 0 ? (
                    <div className="space-y-3">
                      {session.documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {document.document_name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {isRtl ? "تم الرفع في:" : "Uploaded on:"} {" "}
                                {new Date(document.created_at).toLocaleDateString(
                                  isRtl ? "ar" : "en"
                                )}
                              </p>
                              {document.uploaded_by && (
                                <p className="text-xs text-gray-400">
                                  {isRtl ? "بواسطة:" : "By:"} {document.uploaded_by}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(document.document_url, '_blank')}
                              className="flex items-center gap-2 hover:bg-blue-50 text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                              {isRtl ? "تحميل" : "Download"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(document.id, document.document_name)}
                              disabled={deletingDocumentId === document.id}
                              className="flex items-center gap-2 hover:bg-red-50 text-red-600"
                            >
                              {deletingDocumentId === document.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              {deletingDocumentId === document.id 
                                ? (isRtl ? "جار الحذف..." : "Deleting...")
                                : (isRtl ? "حذف" : "Delete")
                              }
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        {isRtl ? "لا توجد وثائق لهذه الجلسة" : "No documents found for this session"}
                      </p>
                    </div>
                  )}
                </div>
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
                      ? (isRtl ? "جار التحديث..." : "Updating...") 
                      : (isRtl ? "تحديث" : "Update")}
                </Button>
              </div>
            </div>
          </form>
      </div>
    </div>,
    document.body
  );
};

export default EditSessionModal;