'use client';

import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSession } from '@/app/services/api/sessions';
import { uploadFilesToFirebase } from '@/app/services/api/firebaseStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, X, Upload, File as FileIcon, FileText, Image, FileSpreadsheet, Trash2, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AddSessionModal = ({ isOpen, onClose, caseId, onSessionAdded }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Generate time options (every 15 minutes from 8:00 AM to 6:00 PM)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        times.push({
          value: timeString,
          display: displayTime
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  
  // Get file type for icon display
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <Image className="w-4 h-4" />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="w-4 h-4" />;
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return <FileSpreadsheet className="w-4 h-4" />;
    }
    return <FileIcon className="w-4 h-4" />;
  };

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  // Handle drag and drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validation schema
  const validationSchema = Yup.object({
    session_date: Yup.string()
      .required(t('validation.required')),
    session_time: Yup.string()
      .required(t('validation.required')),
    // link: Yup.string()
    //   .url(t('validation.invalidUrl')),
    note: Yup.string(),
    is_expert_session: Yup.boolean(),
    is_judgment_reserved: Yup.boolean()
  });

  // Initial values
  const initialValues = {
    session_date: '',
    session_time: '',
    link: '',
    note: '',
    is_expert_session: false,
    is_judgment_reserved: false
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSubmitting(true);
      
      // Upload files to Firebase if any are selected
      let filesUrls = [];
      if (selectedFiles.length > 0) {
        try {
          filesUrls = await uploadFilesToFirebase(selectedFiles);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          toast.error('Failed to upload files');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Combine date and time into a datetime string
      const sessionDateTime = values.session_date && values.session_time 
        ? `${values.session_date}T${values.session_time}`
        : null;
      
      const sessionData = {
        case_id: caseId,
        session_date: sessionDateTime,
        link: values.link,
        is_expert_session: values.is_expert_session,
        is_judgment_reserved: values.is_judgment_reserved,
        note: values.note,
        files: filesUrls
      };

      const response = await createSession(sessionData);
      
      if (response.success) {
        toast.success(t('sessions.addSuccess'));
        resetForm();
        setSelectedFiles([]); // Clear selected files
        onSessionAdded && onSessionAdded(response.data);
        onClose();
      } else {
        toast.error(t('sessions.addError'));
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error(t('sessions.addError'));
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          ></div>
          
          {/* Modal Content - Modern Card Design */}
          <div 
            className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`} 
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    {t('sessions.addSession')}
                  </h2>
                  <p className="text-blue-100 mt-1 text-sm">
                    {t('sessions.addSessionDescription')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body with better spacing */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-6">
                    {/* Form fields in a nice grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Session Date */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {t('sessions.sessionDate')} *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-12 justify-start text-left font-normal rounded-xl border-2 transition-all",
                                !values.session_date && "text-muted-foreground",
                                errors.session_date && touched.session_date 
                                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                                  : 'border-gray-200 hover:border-blue-400 focus:border-blue-400 focus:ring-blue-100'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {values.session_date ? (
                                format(new Date(values.session_date), "PPP")
                              ) : (
                                <span>{t('sessions.selectDate')}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={values.session_date ? new Date(values.session_date) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setFieldValue('session_date', format(date, 'yyyy-MM-dd'));
                                } else {
                                  setFieldValue('session_date', '');
                                }
                              }}
                              disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage name="session_date" component="div" className="text-red-500 text-xs font-medium" />
                      </div>

                      {/* Session Time */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {t('sessions.sessionTime')} *
                        </Label>
                        <Select
                          value={values.session_time}
                          onValueChange={(value) => setFieldValue('session_time', value)}
                        >
                          <SelectTrigger className={cn(
                            "w-full h-12 rounded-xl border-2 transition-all",
                            errors.session_time && touched.session_time 
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                              : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                          )}>
                            <SelectValue placeholder={t('sessions.selectTime')} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {timeOptions.map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {time.display}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="session_time" component="div" className="text-red-500 text-xs font-medium" />
                      </div>
                    </div>

                    {/* Link - Full width */}
                    <div className="space-y-3">
                      <Label htmlFor="link" className="text-sm font-semibold text-gray-700">
                        {t('sessions.link')}
                      </Label>
                      <Field
                        as={Input}
                        id="link"
                        name="link"
                        type="text"
                        placeholder="https://..."
                        className={`h-12 rounded-xl border-2 transition-all ${
                          errors.link && touched.link 
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                        }`}
                      />
                      <ErrorMessage name="link" component="div" className="text-red-500 text-xs font-medium" />
                    </div>
<div className='flex items-center gap-4'>

                    {/* Expert Session Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                      <Label htmlFor="is_expert_session" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        {language === 'ar' ? 'جلسة خبير' : 'Expert Session'}
                      </Label>
                      <Field name="is_expert_session">
                        {({ field }) => (
                          <Checkbox
                            id="is_expert_session"
                            checked={field.value}
                            onCheckedChange={(checked) => setFieldValue('is_expert_session', checked)}
                            className="h-5 w-5"
                          />
                        )}
                      </Field>
                    </div>

                    {/* Judgment Reserved Toggle */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <Label htmlFor="is_judgment_reserved" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        {language === 'ar' ? 'حجز للحكم' : 'Reserved for Judgment'}
                      </Label>
                      <Field name="is_judgment_reserved">
                        {({ field }) => (
                          <Checkbox
                            id="is_judgment_reserved"
                            checked={field.value}
                            onCheckedChange={(checked) => setFieldValue('is_judgment_reserved', checked)}
                            className="h-5 w-5"
                          />
                        )}
                      </Field>
                    </div>
</div>

                    {/* Note */}
                    <div className="space-y-3">
                      <Label htmlFor="note" className="text-sm font-semibold text-gray-700">
                        {t('common.note')}
                      </Label>
                      <Field
                        as={Textarea}
                        id="note"
                        name="note"
                        rows={3}
                        placeholder={t('common.noteOptional')}
                        className="rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-100 transition-all resize-none"
                      />
                    </div>

                    {/* Files Upload Section */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {language === 'ar' ? 'الملفات' : 'Files'}
                      </Label>
                      
                      {/* File Drop Zone */}
                      <div
                        className={cn(
                          "relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer",
                          isDragging 
                            ? "border-blue-400 bg-blue-50" 
                            : "border-gray-300 hover:border-gray-400 bg-gray-50"
                        )}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <input
                          id="fileInput"
                          type="file"
                          multiple
                          onChange={(e) => handleFileSelect(e.target.files)}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.xlsx,.xls,.csv"
                        />
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {language === 'ar' ? 'اسحب الملفات هنا أو انقر للتصفح' : 'Drop files here or click to browse'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {language === 'ar' ? 'PDF, DOC, صور، إكسل (حد أقصى 10 ميجابايت لكل ملف)' : 'PDF, DOC, Images, Excel (max 10MB each)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Selected Files List */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            {language === 'ar' ? `الملفات المحددة (${selectedFiles.length})` : `Selected Files (${selectedFiles.length})`}
                          </p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="flex-shrink-0 text-gray-500">
                                    {getFileIcon(file.name)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons with better styling */}
                    <div className={`flex gap-4 pt-6 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSubmitting 
                          ? t('common.saving')
                          : t('sessions.addSession')
                        }
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-semibold transition-all duration-200"
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSessionModal;