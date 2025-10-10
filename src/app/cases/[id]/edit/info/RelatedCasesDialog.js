'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Link, Download, ExternalLink } from 'lucide-react';
import RelatedCases from './RelatedCases';

function RelatedCasesDialog({ caseId, documents = [] }) {
  const [open, setOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return '📄';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return '🖼️';
    if (['doc', 'docx'].includes(extension)) return '📝';
    return '📎';
  };

  const handleDownload = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            <Link className="h-4 w-4" />
            <span className="text-sm font-medium">القضايا المرتبطة</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">إدارة القضايا المرتبطة</DialogTitle>
            <DialogDescription>
              يمكنك إضافة أو إزالة القضايا المرتبطة بهذه القضية
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RelatedCases caseId={caseId} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={documentsOpen} onOpenChange={setDocumentsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">المستندات ({documents.length})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">مستندات القضية</DialogTitle>
            <DialogDescription>
              عرض وتحميل المستندات المرفقة بهذه القضية
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد مستندات مرفقة بهذه القضية
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="border rounded-lg p-4 bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">
                          {getFileIcon(document.document_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate" title={document.document_name}>
                            {document.document_name}
                          </h3>
                          {document.uploaded_by_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              رفع بواسطة: {document.uploaded_by_name}
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
                          className="h-8 w-8 p-0"
                          title="عرض"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(document.document_url, document.document_name)}
                          className="h-8 w-8 p-0"
                          title="تحميل"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RelatedCasesDialog;
