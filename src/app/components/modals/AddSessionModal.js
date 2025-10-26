'use client';

import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSession } from '@/app/services/api/sessions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AddSessionModal = ({ isOpen, onClose, caseId, onSessionAdded }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    session_date: Yup.date()
      .required(t('validation.required')),
    session_time: Yup.string()
      .required(t('validation.required')),
    link: Yup.string()
      .url(t('validation.invalidUrl'))
      .required(t('validation.required')),
    decision: Yup.string()
      .required(t('validation.required')),
    note: Yup.string(),
    is_expert_session: Yup.boolean()
  });

  // Initial values
  const initialValues = {
    session_date: undefined,
    session_time: '',
    link: '',
    decision: '',
    note: '',
    is_expert_session: false
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSubmitting(true);
      
      // Upload files to Google Storage first
      let filesUrls = [];
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadFilesToGoogleStorage(selectedFiles);
        if (uploadResult.success) {
          filesUrls = uploadResult.urls;
        } else {
          toast.error(uploadResult.error || t('files.uploadError'));
          return;
        }
      }
      
      // Combine date and time into a datetime string
      const sessionDateTime = values.session_date && values.session_time 
        ? `${format(values.session_date, 'yyyy-MM-dd')}T${values.session_time}`
        : null;
      
      const sessionData = {
        case_id: caseId,
        decision: values.decision,
        session_date: sessionDateTime,
        link: values.link,
        is_expert_session: values.is_expert_session,
        note: values.note,
        filesUrls: filesUrls
      };

      const response = await createSession(sessionData);
      
      if (response.success) {
        toast.success(t('sessions.addSuccess'));
        resetForm();
        setSelectedFiles([]);
        onSessionAdded && onSessionAdded(response.data);
        onClose();
      } else {
        toast.error(t('sessions.addError'));
      }
    } catch (error) {

      toast.error(t('sessions.addError'));
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('sessions.addSession')}
          </DialogTitle>
          <DialogDescription>
            {t('sessions.addSessionDescription')}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="space-y-6">
              {/* Session Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t('sessions.sessionDate')} *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !values.session_date && "text-muted-foreground",
                        errors.session_date && touched.session_date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.session_date ? format(values.session_date, "yyyy-MM-dd") : t('sessions.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values.session_date}
                      onSelect={(date) => setFieldValue('session_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <ErrorMessage name="session_date" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Session Time */}
              <div className="space-y-2">
                <Label htmlFor="session_time" className="text-sm font-medium">
                  {t('sessions.sessionTime')} *
                </Label>
                <Field
                  as={Input}
                  id="session_time"
                  name="session_time"
                  type="time"
                  className={errors.session_time && touched.session_time ? 'border-red-500' : ''}
                />
                <ErrorMessage name="session_time" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="link" className="text-sm font-medium">
                  {t('sessions.link')} *
                </Label>
                <Field
                  as={Input}
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://..."
                  className={errors.link && touched.link ? 'border-red-500' : ''}
                />
                <ErrorMessage name="link" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Decision (القرار) */}
              <div className="space-y-2">
                <Label htmlFor="decision" className="text-sm font-medium">
                  {language === 'ar' ? 'القرار' : 'Decision'} *
                </Label>
                <Field
                  as={Textarea}
                  id="decision"
                  name="decision"
                  rows={3}
                  placeholder={language === 'ar' ? 'أدخل القرار...' : 'Enter decision...'}
                  className={errors.decision && touched.decision ? 'border-red-500' : ''}
                />
                <ErrorMessage name="decision" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Expert Session Checkbox (جلسة خبير) */}
              <div className="flex items-center space-x-2">
                <Field name="is_expert_session">
                  {({ field }) => (
                    <Checkbox
                      id="is_expert_session"
                      checked={field.value}
                      onCheckedChange={(checked) => setFieldValue('is_expert_session', checked)}
                    />
                  )}
                </Field>
                <Label htmlFor="is_expert_session" className="text-sm font-medium cursor-pointer">
                  {language === 'ar' ? 'جلسة خبير' : 'Expert Session'}
                </Label>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  {t('common.note')}
                </Label>
                <Field
                  as={Textarea}
                  id="note"
                  name="note"
                  rows={3}
                  placeholder={t('common.noteOptional')}
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {language === 'ar' ? 'المرفقات' : 'Attachments'}
                </Label>
                
                {/* File Upload Area */}
                <div 
                  className={cn(
                    "relative transition-colors duration-200",
                    isDragOver && "ring-2 ring-blue-500"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xls,.xlsx"
                  />
                  <div className={cn(
                    "flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                    isDragOver 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  )}>
                    <div className="flex flex-col items-center space-y-2 text-gray-500">
                      <Plus className="w-6 h-6" />
                      <div className="text-sm text-center">
                        <span className="font-medium">
                          {isDragOver 
                            ? (language === 'ar' ? 'إفلات الملفات هنا' : 'Drop files here')
                            : (language === 'ar' ? 'انقر لاختيار الملفات أو اسحبها هنا' : 'Click to select files or drag them here')
                          }
                        </span>
                        <br />
                        <span className="text-xs">
                          {language === 'ar' ? 'PDF, DOC, DOCX, TXT, JPG, PNG, XLS, XLSX' : 'PDF, DOC, DOCX, TXT, JPG, PNG, XLS, XLSX'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    <div className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? 'الملفات المحددة' : 'Selected Files'} ({selectedFiles.length})
                    </div>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="text-blue-600 flex-shrink-0">
                            {getFileIcon(file.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-blue-800 truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-blue-600">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 flex items-center justify-center text-blue-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting 
                    ? t('common.saving')
                    : t('sessions.addSession')
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionModal;