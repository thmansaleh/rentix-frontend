"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import useSWR, { mutate } from "swr";
import { getClientAgreementById, updateClientAgreement } from "../services/api/clientsAgreements";
import { getBranches } from "../services/api/branches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X, Upload, FileText, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";
// import { uploadFile, deleteFile } from "@/utils/fileUpload";

export function EditClientModal({ clientId, isOpen, onClose, onSuccess }) {
  const { t } = useTranslations();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch branches data
  const { data: branchesData } = useSWR('branches', getBranches);

  // SWR fetcher function
  const fetcher = () => {
    if (!clientId) return null;
    return getClientAgreementById(clientId);
  };

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR(
    clientId ? [`/clients-agreements/${clientId}`] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("potentialClientsPage.validation.nameRequired")),
    phone: Yup.string(),
    status: Yup.string()
      .required(t("potentialClientsPage.validation.statusRequired")),
    source: Yup.string()
      .required(t("potentialClientsPage.validation.sourceRequired")),
    branch_id: Yup.string()
      .required(t("potentialClientsPage.validation.branchRequired")),
    consultation_type: Yup.string()
      .required(t("potentialClientsPage.validation.consultationTypeRequired")),
    category: Yup.string()
      .required(t("potentialClientsPage.validation.categoryRequired")),
    note: Yup.string(),
  });

  // Initial values for Formik
  const getInitialValues = () => {
    if (data?.data) {
      const client = data.data;
      return {
        name: client.name || "",
        phone: client.phone || "",
        note: client.note || "",
        status: client.status || "",
        source: client.source || "",
        branch_id: client.branch_id?.toString() || "",
        consultation_type: client.consultation_type || "",
        category: client.category || "",
      };
    }
    return {
      name: "",
      phone: "",
      note: "",
      status: "",
      source: "",
      branch_id: "",
      consultation_type: "",
      category: "",
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
  

      await updateClientAgreement(clientId, values);
      
      // Mutate SWR cache to refresh data
      mutate([`/clients-agreements`, 1, "", undefined]);
      mutate([`/clients-agreements/${clientId}`]);
      
      toast.success(t("potentialClientsPage.messages.updateSuccess"));
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset files and close modal
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(t("potentialClientsPage.messages.updateError"));
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: ${t("potentialClientsPage.files.invalidType")}`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: ${t("potentialClientsPage.files.tooLarge")}`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = async (fileId, fileName) => {
  
  };

  const statusOptions = [
    { value: "New", label: t("potentialClientsPage.status.new") },
    { value: "Contacted", label: t("potentialClientsPage.status.contacted") },
    { value: "Qualified", label: t("potentialClientsPage.status.qualified") },
    { value: "Unqualified", label: t("potentialClientsPage.status.notQualified") },
    { value: "Converted to Client", label: t("potentialClientsPage.status.convertToClient") },
  ];

  const sourceOptions = [
    { value: "الموقع الالكتروني", label: t("potentialClientsPage.source.website") },
    { value: "زيارة المكتب", label: t("potentialClientsPage.source.officeVisit") },
    { value: "التواصل عبر الهاتف", label: t("potentialClientsPage.source.phoneContact") },
  ];

  const consultationTypeOptions = [
    { value: "قانونية", label: t("potentialClientsPage.consultationType.legal") },
    { value: "مالية", label: t("potentialClientsPage.consultationType.financial") },
    { value: "ادارية", label: t("potentialClientsPage.consultationType.administrative") },
  ];

  const categoryOptions = [
    { value: "individual", label: t("potentialClientsPage.category.individual") },
    { value: "company", label: t("potentialClientsPage.category.company") },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("potentialClientsPage.editModal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("potentialClientsPage.editModal.description")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">{t("potentialClientsPage.messages.loading")}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            <p>{t("potentialClientsPage.messages.error")}</p>
          </div>
        ) : data?.data ? (
          <Formik
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("potentialClientsPage.table.name")} *
                    </Label>
                    <Field name="name">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          placeholder={t("potentialClientsPage.editModal.namePlaceholder")}
                          disabled={isSubmitting}
                          className={errors.name && touched.name ? "border-red-500" : ""}
                        />
                      )}
                    </Field>
                    {errors.name && touched.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t("potentialClientsPage.table.phone")}
                    </Label>
                    <Field name="phone">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder={t("potentialClientsPage.editModal.phonePlaceholder")}
                          disabled={isSubmitting}
                        />
                      )}
                    </Field>
                  </div>


<div className="flex gap-4 flex-wrap">
                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      {t("potentialClientsPage.table.status")} *
                    </Label>
                    <Select
                      value={values.status || ""}
                      onValueChange={(value) => setFieldValue("status", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.status && touched.status ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("potentialClientsPage.editModal.selectStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && touched.status && (
                      <p className="text-sm text-red-500">{errors.status}</p>
                    )}
                  </div>

                  {/* Source Field */}
                  <div className="space-y-2">
                    <Label htmlFor="source">
                      {t("potentialClientsPage.table.source")} *
                    </Label>
                    <Select
                      value={values.source || ""}
                      onValueChange={(value) => setFieldValue("source", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.source && touched.source ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("potentialClientsPage.editModal.selectSource")} />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.source && touched.source && (
                      <p className="text-sm text-red-500">{errors.source}</p>
                    )}
                  </div>

                  {/* Branch Field */}
                  <div className="space-y-2">
                    <Label htmlFor="branch_id">
                      {t("potentialClientsPage.table.branch")} *
                    </Label>
                    <Select
                      value={values.branch_id || ""}
                      onValueChange={(value) => setFieldValue("branch_id", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.branch_id && touched.branch_id ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("potentialClientsPage.editModal.selectBranch")} />
                      </SelectTrigger>
                      <SelectContent>
                        {branchesData?.success && branchesData.data?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name_ar} ({branch.name_en})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.branch_id && touched.branch_id && (
                      <p className="text-sm text-red-500">{errors.branch_id}</p>
                    )}
                  </div>

                  {/* Consultation Type Field */}
                  <div className="space-y-2">
                    <Label htmlFor="consultation_type">
                      {t("potentialClientsPage.table.consultationType")} *
                    </Label>
                    <Select
                      value={values.consultation_type || ""}
                      onValueChange={(value) => setFieldValue("consultation_type", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.consultation_type && touched.consultation_type ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("potentialClientsPage.editModal.selectConsultationType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {consultationTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.consultation_type && touched.consultation_type && (
                      <p className="text-sm text-red-500">{errors.consultation_type}</p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {t("potentialClientsPage.table.category")} *
                    </Label>
                    <Select
                      value={values.category || ""}
                      onValueChange={(value) => setFieldValue("category", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.category && touched.category ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("potentialClientsPage.editModal.selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && touched.category && (
                      <p className="text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
</div>
                  {/* Note Field */}
                  <div className="space-y-2">
                    <Label htmlFor="note">
                      {t("potentialClientsPage.modal.notes")}
                    </Label>
                    <Field name="note">
                      {({ field }) => (
                        <Textarea
                          {...field}
                          id="note"
                          placeholder={t("potentialClientsPage.editModal.notePlaceholder")}
                          rows={4}
                          disabled={isSubmitting}
                        />
                      )}
                    </Field>
                  </div>

                  {/* Files Section */}
                  <div className="space-y-4">
                    <Label>{t("potentialClientsPage.files.title")}</Label>
                    
                    {/* Existing Files */}
                    {data?.data?.files && data.data.files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {t("potentialClientsPage.files.existing")}
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {data.data.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExistingFile(file.id, file.name)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-input').click()}
                          disabled={isSubmitting || isUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t("potentialClientsPage.files.selectFiles")}
                        </Button>
                        <input
                          id="file-input"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {t("potentialClientsPage.files.supportedFormats")}
                      </p>

                      {/* Selected Files */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {t("potentialClientsPage.files.selected")}
                          </p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFile(index)}
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("potentialClientsPage.editModal.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploading || !values.name?.trim() || !values.status || !values.source || !values.branch_id || !values.consultation_type || !values.category}
                  >
                    {isSubmitting || isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isUploading 
                      ? t("potentialClientsPage.files.uploading") 
                      : t("potentialClientsPage.editModal.save")
                    }
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>{t("potentialClientsPage.messages.noResults")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}