"use client";

import React, { useRef } from 'react';
import { Upload, File, FileText, Image, FileIcon, Trash2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormikContext } from './FormikContext';
import { toast } from 'react-toastify';
import { cn } from "@/lib/utils";

function Files() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { values, setFieldValue } = useFormikContext();
  const { caseFiles } = values;
  const fileInputRef = useRef(null);

  // File upload settings
  const maxFileSize = 10; // MB
  const maxFiles = 20;
  const acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt";

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Convert FileList to Array
    const fileArray = Array.from(selectedFiles);
    
    // Validate file count
    if ((caseFiles?.length || 0) + fileArray.length > maxFiles) {
      return;
    }

    // Validate file sizes
    const invalidFiles = fileArray.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (invalidFiles.length > 0) {
      return;
    }

    // Add files to the current list - keeping original file structure
    const updatedFiles = [
      ...(caseFiles || []),
      ...fileArray
    ];
    
    setFieldValue('caseFiles', updatedFiles);
  };

  // Handle file removal
  const handleFileRemove = (fileIndex) => {
    const updatedFiles = (caseFiles || []).filter((_, index) => index !== fileIndex);
    setFieldValue('caseFiles', updatedFiles);
  };

  // Format file size (utility function)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon (utility function)
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  // Get file type badge color (utility function)
  const getFileTypeBadge = (type) => {
    if (type.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('document') || type.includes('word')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='space-x-4 grid grid-cols-2'>
      {/* File Upload Area */}
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
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
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {isArabic 
            ? 'اسحب الملفات هنا أو انقر للاختيار'
            : 'Drag files here or click to select files'
          }
        </p>
        <p className="text-xs text-muted-foreground">
          {isArabic 
            ? 'يدعم: PDF, DOC, DOCX, JPG, PNG, GIF, TXT'
            : 'Supports: PDF, DOC, DOCX, JPG, PNG, GIF, TXT'
          }
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {isArabic 
            ? `الحد الأقصى: ${maxFiles} ملفات، ${maxFileSize} ميجابايت لكل ملف`
            : `Max: ${maxFiles} files, ${maxFileSize}MB per file`
          }
        </p>
      </div>

      {/* File List Column */}
      <div>
        {/* File List */}
        <div className="space-y-3">
          <h4 className={cn("font-medium", isArabic ? 'text-right' : 'text-left')}>
            {isArabic ? 'الملفات المحددة' : 'Selected Files'} ({caseFiles?.length || 0})
          </h4>
          
          {caseFiles && caseFiles.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {caseFiles.map((file, index) => {
                const fileExtension = file.name?.split('.').pop()?.toLowerCase() || 'file';
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getFileTypeBadge(file.type))}
                          >
                            {fileExtension.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                         
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {isArabic ? 'لم يتم اختيار أي ملفات بعد' : 'No files selected yet'}
              </p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {(!caseFiles || caseFiles.length < maxFiles) && (
          <div className="mt-4">
            <Button
               
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={caseFiles?.length >= maxFiles}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isArabic ? 'اختيار ملفات إضافية' : 'Select More Files'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;