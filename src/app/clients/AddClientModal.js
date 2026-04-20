"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Save, Upload, X, User, IdCard, FileText, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { createCustomer } from "../services/api/customers";
import { uploadFiles } from "../../../utils/fileUpload";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { PhoneInputField } from "@/components/ui/phone-input";

export function AddClientModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState({
    emirates_id_front: null,
    emirates_id_back: null,
    license_front: null,
    license_back: null,
    passport_front: null,
    passport_back: null
  });

  const initialValues = {
    full_name: "",
    phone: "",
    email: "",
    emirates_id: "",
    emirates_id_expiry: "",
    driving_license_no: "",
    driving_license_expiry: "",
    driving_license_country: "",
    passport_number: "",
    passport_country: "",
    passport_issue_date: "",
    passport_expiry_date: "",
    address: "",
    nationality_id: "",
    date_of_birth: ""
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required(t('clients.add.validation.fullNameRequired')),
    phone: Yup.string()
      .required(t('clients.add.validation.phoneRequired'))
      .test('phone-format', t('clients.add.validation.phoneInvalid') || 'Invalid phone number', (value) => {
        if (!value) return false;
        if (value.startsWith('971')) {
          // UAE: dial code 971 + exactly 9 digits, local part must NOT start with 0
          return /^971[1-9]\d{8}$/.test(value);
        }
        // Other countries: 7–15 digits per ITU-T E.164
        return /^\d{7,15}$/.test(value);
      }),
    email: Yup.string().email(t('clients.add.validation.emailInvalid')).nullable()
  });

  const handleFileSelect = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const removeFile = (fieldName) => {
    setSelectedFiles(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Upload files if any
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

      const customerData = {
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
        nationality_id: values.nationality_id || null,
        date_of_birth: values.date_of_birth || null,
        ...uploadedUrls
      };

      const result = await createCustomer(customerData);
      toast.success(t('clients.add.success'));
      resetForm();
      setSelectedFiles({
        emirates_id_front: null,
        emirates_id_back: null,
        license_front: null,
        license_back: null,
        passport_front: null,
        passport_back: null
      });
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error(error.response?.data?.message || t('clients.add.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadField = ({ label, fieldName, icon: Icon }) => (
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
            variant="outline"
            size="sm"
            onClick={() => removeFile(fieldName)}
          >
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer">
          <input
            type="file"
            id={fieldName}
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelect(fieldName, e)}
            className="hidden"
          />
          <label htmlFor={fieldName} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{t('clients.add.fields.clickToUpload')}</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('clients.add.title')}
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <CustomModalBody className="h-[70vh] overflow-y-auto">
              <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 mb-6 flex-shrink-0">
                  <TabsTrigger value="basic">
                    <User className="w-4 h-4 mr-2" />
                    {t('clients.add.tabs.basic')}
                  </TabsTrigger>
                  <TabsTrigger value="emirates">
                    <IdCard className="w-4 h-4 mr-2" />
                    {t('clients.add.tabs.emirates')}
                  </TabsTrigger>
                  <TabsTrigger value="license">
                    <IdCard className="w-4 h-4 mr-2" />
                    {t('clients.add.tabs.license')}
                  </TabsTrigger>
                  <TabsTrigger value="passport">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('clients.add.tabs.passport')}
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">
                        {t('clients.add.fields.fullName')} <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="full_name"
                        name="full_name"
                        placeholder={t('clients.add.fields.fullNamePlaceholder')}
                      />
                      <ErrorMessage name="full_name" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t('clients.add.fields.phone')} <span className="text-red-500">*</span>
                      </Label>
                      <PhoneInputField
                        value={values.phone}
                        onChange={(phone) => setFieldValue('phone', phone)}
                      />
                      <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('clients.add.fields.email')}</Label>
                      <Field
                        as={Input}
                        type="email"
                        id="email"
                        name="email"
                        placeholder={t('clients.add.fields.emailPlaceholder')}
                      />
                      <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {t('clients.add.fields.address')}
                      </Label>
                      <Field
                        as={Textarea}
                        id="address"
                        name="address"
                        placeholder={t('clients.add.fields.addressPlaceholder')}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality_id">{t('clients.add.fields.nationality')}</Label>
                      <CountryCombobox
                        value={values.nationality_id}
                        onValueChange={(val) => setFieldValue('nationality_id', val)}
                        placeholder={t('clients.add.fields.nationalityPlaceholder')}
                        searchPlaceholder={t('clients.add.fields.searchCountry') || 'Search country...'}
                        emptyMessage={t('clients.add.fields.noCountryFound') || 'No country found.'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">{t('clients.add.fields.dateOfBirth')}</Label>
                      <DatePicker
                        date={values.date_of_birth ? new Date(values.date_of_birth) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("date_of_birth", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('clients.add.fields.selectDateOfBirth')}
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Emirates ID Tab */}
                <TabsContent value="emirates" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emirates_id">{t('clients.add.fields.emiratesId')}</Label>
                      <Field
                        as={Input}
                        id="emirates_id"
                        name="emirates_id"
                        placeholder={t('clients.add.fields.emiratesIdPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emirates_id_expiry">{t('clients.add.fields.emiratesIdExpiry')}</Label>
                      <DatePicker
                        date={values.emirates_id_expiry ? new Date(values.emirates_id_expiry) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("emirates_id_expiry", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('clients.add.fields.selectExpiryDate')}
                        minDate={new Date()}
                      />
                      <ErrorMessage name="emirates_id_expiry" component="p" className="text-red-500 text-xs" />
                    </div>

                    <FileUploadField label={t('clients.add.fields.emiratesIdFront')} fieldName="emirates_id_front" icon={IdCard} />
                    <FileUploadField label={t('clients.add.fields.emiratesIdBack')} fieldName="emirates_id_back" icon={IdCard} />
                  </div>
                </TabsContent>

                {/* License Tab */}
                <TabsContent value="license" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driving_license_no">{t('clients.add.fields.licenseNumber')}</Label>
                      <Field
                        as={Input}
                        id="driving_license_no"
                        name="driving_license_no"
                        placeholder={t('clients.add.fields.licenseNumberPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driving_license_country">{t('clients.add.fields.licenseCountry')}</Label>
                      <Field
                        as={Input}
                        id="driving_license_country"
                        name="driving_license_country"
                        placeholder={t('clients.add.fields.licenseCountryPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driving_license_expiry">{t('clients.add.fields.licenseExpiry')}</Label>
                      <DatePicker
                        date={values.driving_license_expiry ? new Date(values.driving_license_expiry) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("driving_license_expiry", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('clients.add.fields.selectExpiryDate')}
                        minDate={new Date()}
                      />
                      <ErrorMessage name="driving_license_expiry" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="space-y-2"></div>

                    <FileUploadField label={t('clients.add.fields.licenseFront')} fieldName="license_front" icon={IdCard} />
                    <FileUploadField label={t('clients.add.fields.licenseBack')} fieldName="license_back" icon={IdCard} />
                  </div>
                </TabsContent>

                {/* Passport Tab */}
                <TabsContent value="passport" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passport_number">{t('clients.add.fields.passportNumber')}</Label>
                      <Field
                        as={Input}
                        id="passport_number"
                        name="passport_number"
                        placeholder={t('clients.add.fields.passportNumberPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passport_country">{t('clients.add.fields.passportCountry')}</Label>
                      <Field
                        as={Input}
                        id="passport_country"
                        name="passport_country"
                        placeholder={t('clients.add.fields.passportCountryPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passport_issue_date">{t('clients.add.fields.passportIssueDate')}</Label>
                      <DatePicker
                        date={values.passport_issue_date ? new Date(values.passport_issue_date) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("passport_issue_date", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('clients.add.fields.selectIssueDate')}
                        maxDate={new Date()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passport_expiry_date">{t('clients.add.fields.passportExpiryDate')}</Label>
                      <DatePicker
                        date={values.passport_expiry_date ? new Date(values.passport_expiry_date) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("passport_expiry_date", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('clients.add.fields.selectExpiryDate')}
                        minDate={values.passport_issue_date ? new Date(values.passport_issue_date) : new Date()}
                      />
                      <ErrorMessage name="passport_expiry_date" component="p" className="text-red-500 text-xs" />
                    </div>

                    <FileUploadField label={t('clients.add.fields.passportFront')} fieldName="passport_front" icon={FileText} />
                    <FileUploadField label={t('clients.add.fields.passportBack')} fieldName="passport_back" icon={FileText} />
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
                {t('clients.add.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('clients.add.adding')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('clients.add.submit')}
                  </>
                )}
              </Button>
            </CustomModalFooter>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}
