'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Calendar, Save, CircleX } from 'lucide-react';
import AddLegalPeriodModal from '@/app/cases/add-case/sessions/AddLegalPeriodModal';
import SessionBasicInfo from './SessionBasicInfo';
import SessionSettings from './SessionSettings';
import RulingSection from './RulingSection';
import FileUploadSection from './FileUploadSection';
import { useSessionForm } from './useSessionForm';

const AddSessionModal = ({ isOpen, onClose, caseId, onSessionAdded }) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const {
    formik,
    isLoading,
    isUploading,
    selectedFiles,
    legalPeriods,
    isAddLegalPeriodOpen,
    setIsAddLegalPeriodOpen,
    handleFileSelect,
    handleFileDrop,
    handleDragOver,
    removeSelectedFile,
    clearAllFiles,
    fetchLegalPeriods,
  } = useSessionForm({ isOpen, caseId, isRtl, onClose, onSessionAdded });

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
              <SessionBasicInfo formik={formik} isRtl={isRtl} />

              {/* Session Settings Section */}
              <SessionSettings formik={formik} isRtl={isRtl} />

              {/* Ruling Section - Conditional */}
              <RulingSection 
                formik={formik} 
                isRtl={isRtl} 
                legalPeriods={legalPeriods}
                onAddLegalPeriod={() => setIsAddLegalPeriodOpen(true)}
              />

              {/* File Upload Section */}
              <FileUploadSection 
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onFileDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onRemoveFile={removeSelectedFile}
                onClearAll={clearAllFiles}
                isRtl={isRtl}
              />
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
