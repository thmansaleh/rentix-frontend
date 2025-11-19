'use client';

import { Button } from '@/components/ui/button';
import { Plus, FileText, CircleX } from 'lucide-react';

export default function FileUploadSection({ 
  selectedFiles, 
  onFileSelect, 
  onFileDrop, 
  onDragOver, 
  onRemoveFile, 
  onClearAll,
  isRtl 
}) {
  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
          {isRtl ? "رفع الملفات" : "Upload Files"}
        </h3>
      </div>

      {/* File Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50"
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          onChange={onFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRtl 
              ? "انقر لاختيار الملفات أو اسحبها هنا"
              : "Click to select files or drag and drop here"
            }
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {isRtl 
              ? "PDF, DOC, TXT أو صور"
              : "PDF, DOC, TXT, or images"
            }
          </p>
        </div>
      </div>

      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isRtl ? "الملفات المحددة" : "Selected Files"} ({selectedFiles.length})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              {isRtl ? "مسح الكل" : "Clear All"}
            </Button>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 h-6 w-6 p-0"
                >
                  <CircleX className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
