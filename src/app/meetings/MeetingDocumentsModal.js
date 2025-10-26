"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import meetingsApi from '../services/api/meetings';
import { useTranslations } from '@/hooks/useTranslations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Trash2, 
  Loader2,
  AlertCircle,
  Eye,
  ExternalLink,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadFiles } from '../../../utils/fileUpload';

function MeetingDocumentsModal({ children, meetingId, meetingTitle }) {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch documents using SWR
  const { 
    data: documentsResponse, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    open && meetingId ? `meeting-documents-${meetingId}` : null,
    () => meetingsApi.getMeetingDocuments(meetingId)
  );

  const documents = documentsResponse?.data || [];

  // Handle document deletion
  const handleDeleteDocument = async (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      await meetingsApi.deleteMeetingDocument(documentToDelete.id);
      
      // Optimistically update the cache
      mutate();
      
      toast.success(
        t('documents.deleteSuccess') || 'Document deleted successfully'
      );
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {

      toast.error(
        t('documents.deleteError') || 'Failed to delete document'
      );
    } finally {
      setIsDeleting(false);
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

  // Get file type icon
  const getFileIcon = (fileName) => {
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  // Handle file download/view
  const handleViewDocument = (document) => {
    if (document.document_url) {
      window.open(document.document_url, '_blank');
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle file removal
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle file upload
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedFiles = await uploadFiles(selectedFiles, 'meetings');
      
      // Add documents to meeting
      await meetingsApi.addMeetingDocuments(meetingId, uploadedFiles);
      
      // Clear selected files and refresh documents
      setSelectedFiles([]);
      mutate();
      
      toast.success(
        t('documents.uploadSuccess') || 'Documents uploaded successfully'
      );
    } catch (error) {

      toast.error(
        t('documents.uploadError') || 'Failed to upload documents'
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('meetings.documents.title')}
              {meetingTitle && (
                <span className="text-sm font-normal text-muted-foreground">
                  - {meetingTitle}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      {t('meetings.documents.upload')}
                    </h3>
                    {selectedFiles.length > 0 && (
                      <Button
                        onClick={handleUploadFiles}
                        disabled={isUploading}
                        size="sm"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t('common.uploading')}
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {t('common.upload')}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('doc-file-input').click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t('meetings.actions.selectFiles')}
                    </Button>
                    <input
                      id="doc-file-input"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t('meetings.labels.selectedFiles')}: {selectedFiles.length}
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded-md text-sm"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                              disabled={isUploading}
                              className="h-6 w-6 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {t('meetings.documents.existing')} ({documents.length})
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm">{t('documents.errorLoading')}</p>
                </div>
              ) : documents.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('documents.noDocuments')}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {documents.map((document) => (
                    <Card key={document.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getFileIcon(document.document_name)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {document.document_name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{formatDate(document.created_at)}</span>
                                {document.created_by_name && (
                                  <>
                                    <span>•</span>
                                    <span>{document.created_by_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDocument(document)}
                              title={t('documents.view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDocument(document)}
                              title={t('documents.delete')}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('documents.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('documents.deleteDescription')}
              <br />
              <strong className="block mt-2">{documentToDelete?.document_name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDocument}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MeetingDocumentsModal;
