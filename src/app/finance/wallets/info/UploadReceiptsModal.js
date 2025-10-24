"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Upload, Image, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { uploadReceipts } from "@/app/services/api/walletExpenses";

export function UploadReceiptsModal({ isOpen, onClose, expenseId, onSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("الرجاء اختيار ملف واحد على الأقل");
      return;
    }

    setIsUploading(true);
    try {
      await uploadReceipts(expenseId, selectedFiles);
      toast.success("تم رفع الإيصالات بنجاح");
      setSelectedFiles([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading receipts:", error);
      toast.error(error.response?.data?.error || "فشل في رفع الإيصالات");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isUploading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">رفع إيصالات المصروف</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* File Input */}
          <div>
            <label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  اضغط لاختيار الملفات أو اسحبها هنا
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (صور، PDF - حتى 10 ملفات)
                </p>
              </div>
              <input
                id="receipt-upload"
                type="file"
                className="hidden"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">الملفات المحددة ({selectedFiles.length}):</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Image className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      disabled={isUploading}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                رفع الإيصالات ({selectedFiles.length})
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
