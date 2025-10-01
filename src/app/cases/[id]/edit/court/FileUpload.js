"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import { 
  Upload, 
  X, 
  FileText
} from "lucide-react";

function FileUpload({ 
  files = [], 
  onFilesChange, 
  title,
  description,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt",
  maxFileSize = 10, // MB
  maxFiles = 10,
  folder = 'court-documents'
}) {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslations();
  const isArabic = language === 'ar';
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Convert FileList to Array
    const fileArray = Array.from(selectedFiles);
    
    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      toast.error(
        isArabic 
          ? `يمكنك إضافة ${maxFiles} ملفات كحد أقصى`
          : `You can add maximum ${maxFiles} files`
      );
      return;
    }

    // Validate file sizes
    const invalidFiles = fileArray.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(
        isArabic 
          ? `حجم الملف يجب أن يكون أقل من ${maxFileSize} ميجابايت`
          : `File size must be less than ${maxFileSize}MB`
      );
      return;
    }

    // Add files directly to Formik (same structure as input - just File objects)
    const updatedFiles = [...files, ...fileArray];
    
    onFilesChange(updatedFiles);
  };

  // Handle file removal
  const handleFileRemove = (fileIndex) => {
    const updatedFiles = files.filter((file, index) => index !== fileIndex);
    onFilesChange(updatedFiles);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Get file icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isArabic ? 'text-right' : 'text-left'}>
          {title || (isArabic ? 'رفع الملفات' : 'File Upload')}
        </CardTitle>
        {description && (
          <p className={`text-sm text-gray-600 ${isArabic ? 'text-right' : 'text-left'}`}>
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isArabic 
                ? 'اسحب الملفات هنا أو اضغط للاختيار'
                : 'Drag files here or click to select'
              }
            </p>
            <p className="text-xs text-gray-500">
              {isArabic 
                ? `الحد الأقصى: ${maxFiles} ملفات، ${maxFileSize} ميجابايت لكل ملف`
                : `Max: ${maxFiles} files, ${maxFileSize}MB per file`
              }
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className={isArabic ? 'text-right block' : 'text-left block'}>
              {isArabic ? 'الملفات المحددة' : 'Selected Files'} ({files.length})
            </Label>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {new Date().toLocaleDateString(
                          isArabic ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(index)}
                      className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button (Alternative) */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isArabic ? 'اختيار ملفات' : 'Select Files'}
        </Button>
        
      </CardContent>
    </Card>
  );
}

export default FileUpload;