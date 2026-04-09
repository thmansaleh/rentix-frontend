"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Upload, X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { createAccident, addAccidentMedia } from "../services/api/accidents";
import { getCars } from "../services/api/cars";
import { getCustomers } from "../services/api/customers";
import { getContracts } from "../services/api/contracts";
import { uploadFiles } from "../../../utils/fileUpload";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import useSWR from 'swr';

export function AddAccidentModal({ isOpen, onClose, onSuccess, defaultCarId }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch cars, customers, and contracts — only when modal is open
  const { data: carsData } = useSWR(isOpen ? 'cars' : null, () => getCars());
  const { data: customersData } = useSWR(isOpen ? 'customers' : null, () => getCustomers());
  const { data: contractsData } = useSWR(isOpen ? 'contracts' : null, () => getContracts());

  const cars = carsData?.data || [];
  const customers = customersData?.data || [];
  const contracts = contractsData || [];

  const initialValues = {
    car_id: defaultCarId || "",
    customer_id: "",
    contract_id: "",
    accident_datetime: "",
    location: "",
    police_report_number: "",
    police_station: "",
    liability_type: "UNKNOWN",
    description: ""
  };

  const validationSchema = Yup.object({
    car_id: Yup.number().required(isRTL ? 'السيارة مطلوبة' : 'Car is required'),
    customer_id: Yup.number().required(isRTL ? 'العميل مطلوب' : 'Customer is required'),
    contract_id: Yup.number().required(isRTL ? 'العقد مطلوب' : 'Contract is required'),
    accident_datetime: Yup.string().required(isRTL ? 'تاريخ ووقت الحادث مطلوب' : 'Accident date and time is required'),
    location: Yup.string(),
    police_report_number: Yup.string(),
    police_station: Yup.string(),
    liability_type: Yup.string().oneOf(['CUSTOMER', 'THIRD_PARTY', 'UNKNOWN']),
    description: Yup.string()
  });

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsUploading(true);

      // Create accident first
      const response = await createAccident(values);
      const accidentId = response.data.id;

      // Upload media files if any
      if (selectedMedia.length > 0) {
        const uploadedFiles = await uploadFiles(selectedMedia);
        
        // Add each media to the accident
        for (const uploadedFile of uploadedFiles) {
          await addAccidentMedia(accidentId, uploadedFile.document_url, uploadedFile.document_name);
        }
      }

      toast.success(isRTL ? 'تم إضافة الحادث بنجاح' : 'Accident added successfully');
      setSelectedMedia([]);
      onSuccess();
    } catch (error) {
      console.error('Error creating accident:', error);
      const errorMessage = error.response?.data?.message || error.message || 
        (isRTL ? 'فشل في إضافة الحادث' : 'Failed to add accident');
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>{isRTL ? 'إضافة حادث جديد' : 'Add New Accident'}</span>
        </div>
      }
      size="lg"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <CustomModalBody>
              <div className="space-y-6">
                {/* Car, Customer, Contract Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="car_id">
                      {isRTL ? 'السيارة' : 'Car'} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.car_id?.toString()}
                      onValueChange={(value) => setFieldValue('car_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر السيارة' : 'Select Car'} />
                      </SelectTrigger>
                      <SelectContent>
                        {cars.map((car) => (
                          <SelectItem key={car.id} value={car.id.toString()}>
                            {car.plate_number} - {car.brand} {car.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="car_id" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="customer_id">
                      {isRTL ? 'العميل' : 'Customer'} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.customer_id?.toString()}
                      onValueChange={(value) => setFieldValue('customer_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر العميل' : 'Select Customer'} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="customer_id" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="contract_id">
                      {isRTL ? 'رقم العقد' : 'Contract'} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.contract_id?.toString()}
                      onValueChange={(value) => setFieldValue('contract_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر العقد' : 'Select Contract'} />
                      </SelectTrigger>
                      <SelectContent>
                        {contracts.map((contract) => (
                          <SelectItem key={contract.id} value={contract.id.toString()}>
                            {contract.contract_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="contract_id" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Accident Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accident_datetime">
                      {isRTL ? 'تاريخ ووقت الحادث' : 'Accident Date & Time'} <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="accident_datetime"
                      name="accident_datetime"
                      type="datetime-local"
                      className={errors.accident_datetime && touched.accident_datetime ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="accident_datetime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="liability_type">
                      {isRTL ? 'نوع المسؤولية' : 'Liability Type'}
                    </Label>
                    <Select
                      value={values.liability_type}
                      onValueChange={(value) => setFieldValue('liability_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">{isRTL ? 'العميل' : 'Customer'}</SelectItem>
                        <SelectItem value="THIRD_PARTY">{isRTL ? 'طرف ثالث' : 'Third Party'}</SelectItem>
                        <SelectItem value="UNKNOWN">{isRTL ? 'غير معروف' : 'Unknown'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">
                    {isRTL ? 'الموقع' : 'Location'}
                  </Label>
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    placeholder={isRTL ? 'أدخل موقع الحادث' : 'Enter accident location'}
                  />
                </div>

                {/* Police Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="police_report_number">
                      {isRTL ? 'رقم تقرير الشرطة' : 'Police Report Number'}
                    </Label>
                    <Field
                      as={Input}
                      id="police_report_number"
                      name="police_report_number"
                      placeholder={isRTL ? 'أدخل رقم التقرير' : 'Enter report number'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="police_station">
                      {isRTL ? 'مركز الشرطة' : 'Police Station'}
                    </Label>
                    <Field
                      as={Input}
                      id="police_station"
                      name="police_station"
                      placeholder={isRTL ? 'أدخل اسم المركز' : 'Enter station name'}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    {isRTL ? 'الوصف' : 'Description'}
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    rows={4}
                    placeholder={isRTL ? 'أدخل تفاصيل الحادث' : 'Enter accident details'}
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <Label>
                    {isRTL ? 'صور/ملفات الحادث' : 'Accident Media'}
                  </Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf"
                        onChange={handleMediaSelect}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'انقر لرفع الملفات' : 'Click to upload files'}
                        </p>
                      </div>
                    </label>

                    {selectedMedia.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedMedia.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm truncate flex-1">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMedia(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CustomModalBody>

            <CustomModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isUploading}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-2"
              >
                {(isSubmitting || isUploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isRTL ? 'جاري الحفظ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isRTL ? 'حفظ' : 'Save'}
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
