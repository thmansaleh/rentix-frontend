"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Save, Upload, X, User, IdCard, FileText, MapPin, ShieldBan } from "lucide-react";
import { toast } from "react-toastify";
import { getCustomerById, updateCustomer } from "../services/api/customers";
import { getBranches } from "../services/api/branches";
import { uploadFiles } from "../../../utils/fileUpload";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function EditClientModal({ isOpen, onClose, onSuccess, customerId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    emirates_id_front: null,
    emirates_id_back: null,
    license_front: null,
    license_back: null,
    passport_front: null,
    passport_back: null
  });
  const [existingFiles, setExistingFiles] = useState({});

  useEffect(() => {
    if (isOpen && customerId) {
      fetchBranches();
      fetchCustomer();
    }
  }, [isOpen, customerId]);

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await getBranches();
      setBranches(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error(t('clients.edit.error'));
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchCustomer = async () => {
    try {
      setLoadingCustomer(true);
      const response = await getCustomerById(customerId);
      const customer = response.data;
      setCustomerData(customer);
      
      // Store existing file URLs
      setExistingFiles({
        emirates_id_front: customer.emirates_id_front,
        emirates_id_back: customer.emirates_id_back,
        license_front: customer.license_front,
        license_back: customer.license_back,
        passport_front: customer.passport_front,
        passport_back: customer.passport_back
      });
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error(t('clients.edit.loadingError'));
      onClose();
    } finally {
      setLoadingCustomer(false);
    }
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required(t('clients.edit.validation.fullNameRequired')),
    phone: Yup.string().required(t('clients.edit.validation.phoneRequired')),
    email: Yup.string().email(t('clients.edit.validation.emailInvalid')).nullable(),
    branch_id: Yup.string().required(t('clients.edit.validation.branchRequired'))
  });

  const handleFileSelect = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const removeFile = (fieldName) => {
    setSelectedFiles(prev => ({ ...prev, [fieldName]: null }));
    setExistingFiles(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Upload new files if any
      const uploadedUrls = {};
      
      for (const [fieldName, file] of Object.entries(selectedFiles)) {
        if (file) {
          try {
            const uploaded = await uploadFiles([file], 'customer-documents');
            if (uploaded && uploaded.length > 0) {
              uploadedUrls[fieldName] = uploaded[0].document_url;
            }
          } catch (uploadError) {
            console.error(`Error uploading ${fieldName}:`, uploadError);
          }
        }
      }

      // Merge existing files with new uploads
      const finalDocuments = { ...existingFiles, ...uploadedUrls };

      const updatedCustomerData = {
        full_name: values.full_name,
        phone: values.phone,
        email: values.email || null,
        emirates_id: values.emirates_id || null,
        emirates_id_expiry: values.emirates_id_expiry || null,
        driving_license_no: values.driving_license_no || null,
        driving_license_expiry: values.driving_license_expiry || null,
        driving_license_country: values.driving_license_country || null,
        passport_number: values.passport_number || null,
        passport_country: values.passport_country || null,
        passport_issue_date: values.passport_issue_date || null,
        passport_expiry_date: values.passport_expiry_date || null,
        address: values.address || null,
        branch_id: values.branch_id,
        is_blacklisted: values.is_blacklisted,
        ...finalDocuments
      };

      await updateCustomer(customerId, updatedCustomerData);
      toast.success(t('clients.edit.success'));
      resetForm();
      setSelectedFiles({
        emirates_id_front: null,
        emirates_id_back: null,
        license_front: null,
        license_back: null,
        passport_front: null,
        passport_back: null
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(error.response?.data?.message || t('clients.edit.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadField = ({ label, fieldName, icon: Icon, existingUrl }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      {selectedFiles[fieldName] ? (
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm truncate">{selectedFiles[fieldName].name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeFile(fieldName)}
          >
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ) : existingUrl ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700 dark:text-green-400">{t('clients.edit.fields.currentFile')}</span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(existingUrl, '_blank')}
            >
              {t('clients.edit.fields.view')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile(fieldName)}
            >
              <X className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer">
          <input
            type="file"
            id={`edit-${fieldName}`}
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelect(fieldName, e)}
            className="hidden"
          />
          <label htmlFor={`edit-${fieldName}`} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{t('clients.edit.fields.clickToUpload')}</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );

  if (!customerData) {
    return null;
  }

  const initialValues = {
    full_name: customerData.full_name || "",
    phone: customerData.phone || "",
    email: customerData.email || "",
    emirates_id: customerData.emirates_id || "",
    emirates_id_expiry: customerData.emirates_id_expiry || "",
    driving_license_no: customerData.driving_license_no || "",
    driving_license_expiry: customerData.driving_license_expiry || "",
    driving_license_country: customerData.driving_license_country || "",
    passport_number: customerData.passport_number || "",
    passport_country: customerData.passport_country || "",
    passport_issue_date: customerData.passport_issue_date || "",
    passport_expiry_date: customerData.passport_expiry_date || "",
    address: customerData.address || "",
    branch_id: customerData.branch_id?.toString() || "",
    is_blacklisted: customerData.is_blacklisted || false
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('clients.edit.title')}
      size="xl"
    >
      {loadingCustomer ? (
        <CustomModalBody className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CustomModalBody>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <CustomModalBody className="h-[70vh] overflow-y-auto">
                <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4 mb-6 flex-shrink-0">
                    <TabsTrigger value="basic">
                      <User className="w-4 h-4 mr-2" />
                      {t('clients.edit.tabs.basic')}
                    </TabsTrigger>
                    <TabsTrigger value="emirates">
                      <IdCard className="w-4 h-4 mr-2" />
                      {t('clients.edit.tabs.emirates')}
                    </TabsTrigger>
                    <TabsTrigger value="license">
                      <IdCard className="w-4 h-4 mr-2" />
                      {t('clients.edit.tabs.license')}
                    </TabsTrigger>
                    <TabsTrigger value="passport">
                      <FileText className="w-4 h-4 mr-2" />
                      {t('clients.edit.tabs.passport')}
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">
                          {t('clients.edit.fields.fullName')} <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="full_name"
                          name="full_name"
                          placeholder={t('clients.edit.fields.fullNamePlaceholder')}
                        />
                        <ErrorMessage name="full_name" component="p" className="text-red-500 text-xs" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {t('clients.edit.fields.phone')} <span className="text-red-500">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          placeholder={t('clients.edit.fields.phonePlaceholder')}
                        />
                        <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('clients.edit.fields.email')}</Label>
                        <Field
                          as={Input}
                          type="email"
                          id="email"
                          name="email"
                          placeholder={t('clients.edit.fields.emailPlaceholder')}
                        />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch_id">
                          {t('clients.edit.fields.branch')} <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.branch_id}
                          onValueChange={(value) => setFieldValue("branch_id", value)}
                          disabled={loadingBranches}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingBranches ? t('clients.edit.fields.loadingBranches') : t('clients.edit.fields.selectBranch')} />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id.toString()}>
                                {branch.name_ar || branch.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="branch_id" component="p" className="text-red-500 text-xs" />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {t('clients.edit.fields.address')}
                        </Label>
                        <Field
                          as={Textarea}
                          id="address"
                          name="address"
                          placeholder={t('clients.edit.fields.addressPlaceholder')}
                          rows={3}
                        />
                      </div>

                      {/* Blacklist Toggle */}
                      <div className="md:col-span-2">
                        <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                          values.is_blacklisted 
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${values.is_blacklisted ? 'bg-red-100 dark:bg-red-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
                              <ShieldBan className={`w-5 h-5 ${values.is_blacklisted ? 'text-red-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">{t('clients.edit.fields.blacklistStatus')}</Label>
                              <p className={`text-xs ${values.is_blacklisted ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                                {values.is_blacklisted ? t('clients.edit.fields.blacklistWarning') : t('clients.edit.fields.blacklistDescription')}
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={values.is_blacklisted}
                              onChange={(e) => setFieldValue('is_blacklisted', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Emirates ID Tab */}
                  <TabsContent value="emirates" className="space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emirates_id">{t('clients.edit.fields.emiratesId')}</Label>
                        <Field
                          as={Input}
                          id="emirates_id"
                          name="emirates_id"
                          placeholder={t('clients.edit.fields.emiratesIdPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emirates_id_expiry">{t('clients.edit.fields.emiratesIdExpiry')}</Label>
                        <DatePicker
                          date={values.emirates_id_expiry ? new Date(values.emirates_id_expiry) : undefined}
                          onDateChange={(date) => {
                            setFieldValue("emirates_id_expiry", date ? date.toISOString().split('T')[0] : "");
                          }}
                          placeholder={t('clients.edit.fields.selectExpiryDate')}
                          minDate={new Date()}
                        />
                      </div>

                      <FileUploadField 
                        label={t('clients.edit.fields.emiratesIdFront')} 
                        fieldName="emirates_id_front" 
                        icon={IdCard}
                        existingUrl={existingFiles.emirates_id_front}
                      />
                      <FileUploadField 
                        label={t('clients.edit.fields.emiratesIdBack')} 
                        fieldName="emirates_id_back" 
                        icon={IdCard}
                        existingUrl={existingFiles.emirates_id_back}
                      />
                    </div>
                  </TabsContent>

                  {/* License Tab */}
                  <TabsContent value="license" className="space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="driving_license_no">{t('clients.edit.fields.licenseNumber')}</Label>
                        <Field
                          as={Input}
                          id="driving_license_no"
                          name="driving_license_no"
                          placeholder={t('clients.edit.fields.licenseNumberPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="driving_license_country">{t('clients.edit.fields.licenseCountry')}</Label>
                        <Field
                          as={Input}
                          id="driving_license_country"
                          name="driving_license_country"
                          placeholder={t('clients.edit.fields.licenseCountryPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="driving_license_expiry">{t('clients.edit.fields.licenseExpiry')}</Label>
                        <DatePicker
                          date={values.driving_license_expiry ? new Date(values.driving_license_expiry) : undefined}
                          onDateChange={(date) => {
                            setFieldValue("driving_license_expiry", date ? date.toISOString().split('T')[0] : "");
                          }}
                          placeholder={t('clients.edit.fields.selectExpiryDate')}
                          minDate={new Date()}
                        />
                      </div>

                      <div className="space-y-2"></div>

                      <FileUploadField 
                        label={t('clients.edit.fields.licenseFront')} 
                        fieldName="license_front" 
                        icon={IdCard}
                        existingUrl={existingFiles.license_front}
                      />
                      <FileUploadField 
                        label={t('clients.edit.fields.licenseBack')} 
                        fieldName="license_back" 
                        icon={IdCard}
                        existingUrl={existingFiles.license_back}
                      />
                    </div>
                  </TabsContent>

                  {/* Passport Tab */}
                  <TabsContent value="passport" className="space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="passport_number">{t('clients.edit.fields.passportNumber')}</Label>
                        <Field
                          as={Input}
                          id="passport_number"
                          name="passport_number"
                          placeholder={t('clients.edit.fields.passportNumberPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passport_country">{t('clients.edit.fields.passportCountry')}</Label>
                        <Field
                          as={Input}
                          id="passport_country"
                          name="passport_country"
                          placeholder={t('clients.edit.fields.passportCountryPlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passport_issue_date">{t('clients.edit.fields.passportIssueDate')}</Label>
                        <DatePicker
                          date={values.passport_issue_date ? new Date(values.passport_issue_date) : undefined}
                          onDateChange={(date) => {
                            setFieldValue("passport_issue_date", date ? date.toISOString().split('T')[0] : "");
                          }}
                          placeholder={t('clients.edit.fields.selectIssueDate')}
                          maxDate={new Date()}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passport_expiry_date">{t('clients.edit.fields.passportExpiryDate')}</Label>
                        <DatePicker
                          date={values.passport_expiry_date ? new Date(values.passport_expiry_date) : undefined}
                          onDateChange={(date) => {
                            setFieldValue("passport_expiry_date", date ? date.toISOString().split('T')[0] : "");
                          }}
                          placeholder={t('clients.edit.fields.selectExpiryDate')}
                          minDate={values.passport_issue_date ? new Date(values.passport_issue_date) : new Date()}
                        />
                      </div>

                      <FileUploadField 
                        label={t('clients.edit.fields.passportFront')} 
                        fieldName="passport_front" 
                        icon={FileText}
                        existingUrl={existingFiles.passport_front}
                      />
                      <FileUploadField 
                        label={t('clients.edit.fields.passportBack')} 
                        fieldName="passport_back" 
                        icon={FileText}
                        existingUrl={existingFiles.passport_back}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CustomModalBody>

              <CustomModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t('clients.edit.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('clients.edit.updating')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t('clients.edit.submit')}
                    </>
                  )}
                </Button>
              </CustomModalFooter>
            </Form>
          )}
        </Formik>
      )}
    </CustomModal>
  );
}
