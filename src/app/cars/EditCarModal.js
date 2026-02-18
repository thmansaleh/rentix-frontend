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
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Save, Upload, X, FileText, Image as ImageIcon, Car, FileCheck, Shield, Wrench, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { getCarById, updateCar, getCarPhotos, getCarDocuments, addCarPhoto, addCarDocument, deleteCarPhoto, deleteCarDocument } from "../services/api/cars";
import { uploadFiles } from "../../../utils/fileUpload";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function EditCarModal({ isOpen, onClose, onSuccess, carId }) {
  const { t } = useTranslations();
  const {isRTL} = useLanguage();
  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);

  useEffect(() => {
    if (isOpen && carId) {
      fetchCarData();
    }
  }, [isOpen, carId]);

  const fetchCarData = async () => {
    setLoading(true);
    try {
      const [carResponse, photosResponse, documentsResponse] = await Promise.all([
        getCarById(carId),
        getCarPhotos(carId),
        getCarDocuments(carId)
      ]);

      setCarData(carResponse.data);
      setExistingPhotos(photosResponse.data || []);
      setExistingDocuments(documentsResponse.data || []);
      setSelectedPhotos([]);
      setSelectedDocuments([]);
      setPhotosToDelete([]);
      setDocumentsToDelete([]);
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast.error(t('cars.messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    plate_number: Yup.string().required(t('cars.validation.plateNumberRequired')),
    brand: Yup.string(),
    model: Yup.string(),
    year: Yup.number().min(1900).max(new Date().getFullYear() + 1),
    color: Yup.string(),
    status: Yup.string().oneOf(['available', 'rented', 'maintenance', 'sold']),
    mileage: Yup.number().min(0),
    car_price: Yup.number().min(0),
    registration_start: Yup.date(),
    registration_end: Yup.date().when("registration_start", {
      is: (start) => start && start.length > 0,
      then: (schema) => schema.min(Yup.ref("registration_start"), t('cars.validation.endDateAfterStart')),
      otherwise: (schema) => schema
    }),
    insurance_start: Yup.date(),
    insurance_end: Yup.date().when("insurance_start", {
      is: (start) => start && start.length > 0,
      then: (schema) => schema.min(Yup.ref("insurance_start"), t('cars.validation.endDateAfterStart')),
      otherwise: (schema) => schema
    }),
    daily_price: Yup.number().min(0)
  });

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(prev => [...prev, ...files]);
  };

  const removeNewPhoto = (index) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const markPhotoForDeletion = (photoId) => {
    setPhotosToDelete(prev => [...prev, photoId]);
    setExistingPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleDocumentSelect = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      file,
      document_type: 'other',
      issue_date: '',
      expiry_date: '',
      notes: ''
    }));
    setSelectedDocuments(prev => [...prev, ...newDocs]);
  };

  const removeNewDocument = (index) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const markDocumentForDeletion = (docId) => {
    setDocumentsToDelete(prev => [...prev, docId]);
    setExistingDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const updateDocumentMetadata = (index, field, value) => {
    setSelectedDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    ));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Update car basic info
      const carUpdateData = {
        plate_number: values.plate_number,
        brand: values.brand || null,
        model: values.model || null,
        year: values.year || null,
        color: values.color || null,
        status: values.status,
        mileage: values.mileage || 0,
        car_price: values.car_price || null,
        registration_number: values.registration_number || null,
        registration_start: values.registration_start || null,
        registration_end: values.registration_end || null,
        insurance_company: values.insurance_company || null,
        insurance_policy_number: values.insurance_policy_number || null,
        insurance_start: values.insurance_start || null,
        insurance_end: values.insurance_end || null,
        last_maintenance_date: values.last_maintenance_date || null,
        next_maintenance_date: values.next_maintenance_date || null,
        daily_price: values.daily_price || null,
        description: values.description || null,
        notes: values.notes || null
      };

      await updateCar(carId, carUpdateData);

      // Delete marked photos
      for (const photoId of photosToDelete) {
        try {
          await deleteCarPhoto(carId, photoId);
        } catch (error) {
          console.error("Error deleting photo:", error);
        }
      }

      // Delete marked documents
      for (const docId of documentsToDelete) {
        try {
          await deleteCarDocument(carId, docId);
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      }

      // Upload new photos
      if (selectedPhotos.length > 0) {
        try {
          const uploadedPhotos = await uploadFiles(selectedPhotos, 'car-photos');
          for (const photo of uploadedPhotos) {
            await addCarPhoto(carId, {
              file_name: photo.document_name,
              file_url: photo.document_url
            });
          }
        } catch (uploadError) {
          console.error("Error uploading photos:", uploadError);
          toast.warning(t('cars.messages.photosUploadWarning'));
        }
      }

      // Upload new documents
      if (selectedDocuments.length > 0) {
        try {
          const documentFiles = selectedDocuments.map(doc => doc.file);
          const uploadedDocs = await uploadFiles(documentFiles, 'car-documents');
          
          for (let i = 0; i < uploadedDocs.length; i++) {
            const uploadedDoc = uploadedDocs[i];
            const docMetadata = selectedDocuments[i];
            
            await addCarDocument(carId, {
              document_type: docMetadata.document_type,
              file_name: uploadedDoc.document_name,
              file_url: uploadedDoc.document_url,
              issue_date: docMetadata.issue_date || null,
              expiry_date: docMetadata.expiry_date || null,
              notes: docMetadata.notes || null
            });
          }
        } catch (uploadError) {
          console.error("Error uploading documents:", uploadError);
          toast.warning(t('cars.messages.documentsUploadWarning'));
        }
      }

      toast.success(t('cars.messages.updateSuccess'));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error(error.response?.data?.message || t('cars.messages.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !carData) {
    return (
      <CustomModal isOpen={isOpen} onClose={onClose} title={t('cars.editCar')} size="xl">
        <CustomModalBody className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CustomModalBody>
      </CustomModal>
    );
  }

  const initialValues = {
    plate_number: carData.plate_number || "",
    brand: carData.brand || "",
    model: carData.model || "",
    year: carData.year || "",
    color: carData.color || "",
    status: carData.status || "available",
    mileage: carData.mileage || 0,
    car_price: carData.car_price || "",
    registration_number: carData.registration_number || "",
    registration_start: carData.registration_start || "",
    registration_end: carData.registration_end || "",
    insurance_company: carData.insurance_company || "",
    insurance_policy_number: carData.insurance_policy_number || "",
    insurance_start: carData.insurance_start || "",
    insurance_end: carData.insurance_end || "",
    last_maintenance_date: carData.last_maintenance_date || "",
    next_maintenance_date: carData.next_maintenance_date || "",
    daily_price: carData.daily_price || "",
    description: carData.description || "",
    notes: carData.notes || ""
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('cars.editCar')}
      size="xl"
    >
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
                <TabsList className="grid w-full grid-cols-5 mb-6 flex-shrink-0">
                  <TabsTrigger value="basic">
                    <Car className="w-4 h-4 mr-2" />
                    {t('cars.tabs.basic')}
                  </TabsTrigger>
                  <TabsTrigger value="registration">
                    <FileCheck className="w-4 h-4 mr-2" />
                    {t('cars.tabs.registration')}
                  </TabsTrigger>
                  <TabsTrigger value="insurance">
                    <Shield className="w-4 h-4 mr-2" />
                    {t('cars.tabs.insurance')}
                  </TabsTrigger>
                  <TabsTrigger value="maintenance">
                    <Wrench className="w-4 h-4 mr-2" />
                    {t('cars.tabs.maintenance')}
                  </TabsTrigger>
                  <TabsTrigger value="files">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t('cars.tabs.files')}
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plate_number">
                        {t('cars.plateNumber')} <span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="plate_number"
                        name="plate_number"
                        placeholder={t('cars.placeholders.plateNumber')}
                      />
                      <ErrorMessage name="plate_number" component="p" className="text-red-500 text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">{t('cars.brand')}</Label>
                      <Field
                        as={Input}
                        id="brand"
                        name="brand"
                        placeholder={t('cars.placeholders.brand')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">{t('cars.model')}</Label>
                      <Field
                        as={Input}
                        id="model"
                        name="model"
                        placeholder={t('cars.placeholders.model')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">{t('cars.year')}</Label>
                      <Field
                        as={Input}
                        type="number"
                        id="year"
                        name="year"
                        placeholder={t('cars.placeholders.year')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">{t('cars.color')}</Label>
                      <Field
                        as={Input}
                        id="color"
                        name="color"
                        placeholder={t('cars.placeholders.color')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">{t('cars.status')}</Label>
                      <Select
                        value={values.status}
                        onValueChange={(value) => setFieldValue("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">{t('cars.statusAvailable')}</SelectItem>
                          <SelectItem value="rented">{t('cars.statusRented')}</SelectItem>
                          <SelectItem value="maintenance">{t('cars.statusMaintenance')}</SelectItem>
                          <SelectItem value="sold">{t('cars.statusSold')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
       <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">{t('cars.description')}</Label>
                      <Field
                        as={Textarea}
                        id="description"
                        name="description"
                        placeholder={t('cars.description')}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">{t('cars.mileage')}</Label>
                      <Field
                        as={Input}
                        type="number"
                        id="mileage"
                        name="mileage"
                        placeholder={t('cars.placeholders.mileage')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="car_price">{t('cars.carPrice')}</Label>
                      <Field
                        as={Input}
                        type="number"
                        id="car_price"
                        name="car_price"
                        placeholder={t('cars.placeholders.carPrice')}
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="daily_price">{t('cars.dailyPrice')}</Label>
                      <Field
                        as={Input}
                        type="number"
                        id="daily_price"
                        name="daily_price"
                        placeholder={t('cars.placeholders.dailyPrice')}
                        step="0.01"
                      />
                    </div>

             

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="notes">{t('cars.notes')}</Label>
                      <Field
                        as={Textarea}
                        id="notes"
                        name="notes"
                        placeholder={t('cars.placeholders.notes')}
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Registration Tab */}
                <TabsContent value="registration" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="registration_number">{t('cars.registration.number')}</Label>
                      <Field
                        as={Input}
                        id="registration_number"
                        name="registration_number"
                        placeholder={t('cars.placeholders.registrationNumber')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_start">{t('cars.registration.startDate')}</Label>
                      <DatePicker
                        date={values.registration_start ? new Date(values.registration_start) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("registration_start", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_end">{t('cars.registration.endDate')}</Label>
                      <DatePicker
                        date={values.registration_end ? new Date(values.registration_end) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("registration_end", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                        minDate={values.registration_start ? new Date(values.registration_start) : undefined}
                      />
                      <ErrorMessage name="registration_end" component="p" className="text-red-500 text-xs" />
                    </div>
                  </div>
                </TabsContent>

                {/* Insurance Tab */}
                <TabsContent value="insurance" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_company">{t('cars.insurance.company')}</Label>
                      <Field
                        as={Input}
                        id="insurance_company"
                        name="insurance_company"
                        placeholder={t('cars.placeholders.insuranceCompany')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurance_policy_number">{t('cars.insurance.policyNumber')}</Label>
                      <Field
                        as={Input}
                        id="insurance_policy_number"
                        name="insurance_policy_number"
                        placeholder={t('cars.placeholders.policyNumber')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurance_start">{t('cars.insurance.startDate')}</Label>
                      <DatePicker
                        date={values.insurance_start ? new Date(values.insurance_start) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("insurance_start", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurance_end">{t('cars.insurance.endDate')}</Label>
                      <DatePicker
                        date={values.insurance_end ? new Date(values.insurance_end) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("insurance_end", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                        minDate={values.insurance_start ? new Date(values.insurance_start) : undefined}
                      />
                      <ErrorMessage name="insurance_end" component="p" className="text-red-500 text-xs" />
                    </div>
                  </div>
                </TabsContent>

                {/* Maintenance Tab */}
                <TabsContent value="maintenance" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_maintenance_date">{t('cars.maintenanceTab.lastDate')}</Label>
                      <DatePicker
                        date={values.last_maintenance_date ? new Date(values.last_maintenance_date) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("last_maintenance_date", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                        // maxDate={new Date()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="next_maintenance_date">{t('cars.maintenanceTab.nextDate')}</Label>
                      <DatePicker
                        date={values.next_maintenance_date ? new Date(values.next_maintenance_date) : undefined}
                        onDateChange={(date) => {
                          setFieldValue("next_maintenance_date", date ? date.toISOString().split('T')[0] : "");
                        }}
                        placeholder={t('cars.placeholders.selectDate')}
                        minDate={values.last_maintenance_date ? new Date(values.last_maintenance_date) : new Date()}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="files" className="space-y-6 flex-1 overflow-y-auto">
                  {/* Photos Section */}
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            {t('cars.photos.title')}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('cars.photos.description')}
                          </p>
                        </div>
                        {(existingPhotos.length + selectedPhotos.length) > 0 && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('cars.photos.photoCount', {count: existingPhotos.length + selectedPhotos.length})}
                          </span>
                        )}
                      </div>
                      
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                        <input
                          type="file"
                          id="photos"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        <label htmlFor="photos" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t('cars.photos.clickToUpload')}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('cars.photos.supportedFormats')}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Existing Photos */}
                      {existingPhotos.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t('cars.photos.currentPhotos')}</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {existingPhotos.map((photo) => (
                              <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden border-2">
                                <img
                                  src={photo.file_url}
                                  alt={photo.file_name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => markPhotoForDeletion(photo.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* New Photos */}
                      {selectedPhotos.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t('cars.photos.newPhotos')}</Label>
                          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                            {selectedPhotos.map((file, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="p-2 rounded bg-primary/10">
                                    <ImageIcon className="w-4 h-4 text-primary flex-shrink-0" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNewPhoto(index)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Documents Section */}
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            {t('cars.documents.title')}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('cars.documents.description')}
                          </p>
                        </div>
                        {(existingDocuments.length + selectedDocuments.length) > 0 && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('cars.documents.documentCount', {count: existingDocuments.length + selectedDocuments.length})}
                          </span>
                        )}
                      </div>
                      
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                        <input
                          type="file"
                          id="documents"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentSelect}
                          className="hidden"
                        />
                        <label htmlFor="documents" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t('cars.photos.clickToUpload')}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('cars.documents.supportedFormats')}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Existing Documents */}
                      {existingDocuments.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{t('cars.documents.currentDocuments')}</Label>
                          {existingDocuments.map((doc) => (
                            <Card key={doc.id} className="border hover:border-primary/50 transition-colors">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">{doc.file_name}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markDocumentForDeletion(doc.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      {/* New Documents */}
                      {selectedDocuments.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{t('cars.documents.newDocuments')}</Label>
                          {selectedDocuments.map((doc, index) => (
                            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                              <CardContent className="p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="p-2 rounded bg-primary/10 mt-1">
                                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold truncate">{doc.file.name}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNewDocument(index)}
                                    className="flex-shrink-0"
                                  >
                                    <X className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('cars.documents.documentType')}</Label>
                                    <Select
                                      value={doc.document_type}
                                      onValueChange={(value) => updateDocumentMetadata(index, 'document_type', value)}
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="registration">📋 {t('cars.documents.types.registration')}</SelectItem>
                                        <SelectItem value="insurance">🛡️ {t('cars.documents.types.insurance')}</SelectItem>
                                        <SelectItem value="inspection">🔍 {t('cars.documents.types.inspection')}</SelectItem>
                                        <SelectItem value="purchase_invoice">🧾 {t('cars.documents.types.purchase_invoice')}</SelectItem>
                                        <SelectItem value="warranty">✅ {t('cars.documents.types.warranty')}</SelectItem>
                                        <SelectItem value="other">📄 {t('cars.documents.types.other')}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium flex items-center gap-1">
                                      <CalendarIcon className="w-3 h-3" />
                                      {t('cars.documents.issueDate')}
                                    </Label>
                                    <DatePicker
                                      date={doc.issue_date ? new Date(doc.issue_date) : undefined}
                                      onDateChange={(date) => {
                                        updateDocumentMetadata(index, 'issue_date', date ? date.toISOString().split('T')[0] : '');
                                      }}
                                      placeholder={t('cars.placeholders.selectDate')}
                                      maxDate={new Date()}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium flex items-center gap-1">
                                      <CalendarIcon className="w-3 h-3" />
                                      {t('cars.documents.expiryDate')}
                                    </Label>
                                    <DatePicker
                                      date={doc.expiry_date ? new Date(doc.expiry_date) : undefined}
                                      onDateChange={(date) => {
                                        updateDocumentMetadata(index, 'expiry_date', date ? date.toISOString().split('T')[0] : '');
                                      }}
                                      placeholder={t('cars.placeholders.selectDate')}
                                      minDate={doc.issue_date ? new Date(doc.issue_date) : new Date()}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
                {t('cars.buttons.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('cars.buttons.updating')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('cars.buttons.update')}
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
