"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, Save, FileText, Check, ChevronsUpDown, Search, Upload, X, User, Car, DollarSign, Calendar, Gauge, Fuel, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { createContract } from "../services/api/contracts";
import { getCars } from "../services/api/cars";
import { getCustomers } from "../services/api/customers";
import { getBranches } from "../services/api/branches";
import { addContractAttachment } from "../services/api/contracts";
import { uploadFiles } from "../../../utils/fileUpload";
import useSWR from 'swr';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function AddContractModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslations();
    const {isRTL} = useLanguage();
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  // Fetch cars and branches
  const { data: carsData } = useSWR('cars', getCars);
  const { data: branchesData } = useSWR('branches', getBranches);
  const cars = carsData?.data || carsData || [];
  const branches = branchesData?.data || branchesData || [];

  // Load initial customers (default 10)
  useEffect(() => {
    if (isOpen) {
      loadCustomers("");
    }
  }, [isOpen]);

  const loadCustomers = async (search) => {
    setIsLoadingCustomers(true);
    try {
      const data = await getCustomers(search);
      const customersList = data?.data || data || [];
      setSearchedCustomers(customersList.slice(0, 10));
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerOpen) {
        loadCustomers(customerSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch, customerOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAttachments([]);
      setCustomerSearch("");
    }
  }, [isOpen]);

  const initialValues = {
    customer_id: "",
    car_id: "",
    branch_id: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    km_allowed: "",
    km_taken_start: "",
    km_return_end: "",
    petrol_at_take: "100",
    daily_price: "",
    total_amount: "",
    paid_amount: "0",
    insurance_amount: "",
    status: "active",
    notes: ""
  };

  const validationSchema = Yup.object({
    customer_id: Yup.number().required(t('contracts.addModal.customerRequired')),
    car_id: Yup.number().required(t('contracts.addModal.carRequired')),
    start_date: Yup.date().required(t('contracts.addModal.startDateRequired')),
    end_date: Yup.date()
      .required(t('contracts.addModal.endDateRequired'))
      .min(Yup.ref("start_date"), t('contracts.addModal.endDateRequired')),
    daily_price: Yup.number().min(0, t('validation.required')),
    total_amount: Yup.number().min(0, t('validation.required')),
    paid_amount: Yup.number().min(0, t('validation.required')),
    insurance_amount: Yup.number().min(0, t('validation.required')),
    km_allowed: Yup.number().min(0, t('validation.required')),
  });

  const calculateTotalAmount = (startDate, endDate, dailyPrice) => {
    if (!startDate || !endDate || !dailyPrice) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days * parseFloat(dailyPrice);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const contractData = {
        customer_id: parseInt(values.customer_id),
        car_id: parseInt(values.car_id),
        branch_id: values.branch_id ? parseInt(values.branch_id) : null,
        start_date: values.start_date,
        start_time: values.start_time || null,
        end_date: values.end_date,
        end_time: values.end_time || null,
        km_allowed: values.km_allowed ? parseInt(values.km_allowed) : null,
        km_taken_start: values.km_taken_start ? parseInt(values.km_taken_start) : null,
        km_return_end: values.km_return_end ? parseInt(values.km_return_end) : null,
        petrol_at_take: values.petrol_at_take,
        daily_price: values.daily_price ? parseFloat(values.daily_price) : null,
        total_amount: values.total_amount ? parseFloat(values.total_amount) : null,
        paid_amount: values.paid_amount ? parseFloat(values.paid_amount) : 0,
        insurance_amount: values.insurance_amount ? parseFloat(values.insurance_amount) : null,
        status: values.status,
        notes: values.notes || null
      };

      const result = await createContract(contractData);
      const contractId = result.contract.id;

      // Upload attachments if any
      if (selectedAttachments.length > 0) {
        try {
          const attachmentFiles = selectedAttachments.map(att => att.file);
          const uploadedFiles = await uploadFiles(attachmentFiles, 'contract-attachments');
          
          for (let i = 0; i < uploadedFiles.length; i++) {
            await addContractAttachment(contractId, {
              attachment_name: uploadedFiles[i].document_name,
              attachment_url: uploadedFiles[i].document_url
            });
          }
        } catch (uploadError) {
          console.error("Error uploading attachments:", uploadError);
          toast.warning("Contract saved but some attachments failed to upload");
          resetForm();
          setSelectedAttachments([]);
          onSuccess();
          onClose();
          return;
        }
      }

      toast.success(t('contracts.createSuccess'));

      resetForm();
      setSelectedAttachments([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast.error(error.response?.data?.message || t('contracts.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('contracts.addModal.title')}
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <CustomModalBody className="h-[70vh] overflow-y-auto">
              <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-5 mb-6 flex-shrink-0">
                  <TabsTrigger value="basic">
                    <User className="w-4 h-4 mr-2" />
                    {t('contracts.addModal.tabs.basicInfo')}
                  </TabsTrigger>
                  <TabsTrigger value="dates">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('contracts.addModal.tabs.dates')}
                  </TabsTrigger>
                  <TabsTrigger value="vehicle">
                    <Gauge className="w-4 h-4 mr-2" />
                    {t('contracts.addModal.tabs.vehicle')}
                  </TabsTrigger>
                  <TabsTrigger value="payment">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t('contracts.addModal.tabs.payment')}
                  </TabsTrigger>
                  <TabsTrigger value="attachments">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('contracts.addModal.tabs.attachments')}
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6 flex-1 overflow-y-auto">
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.customer')} & {t('contracts.addModal.car')}</Label>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Customer Selection */}
                        <div>
                          <Label htmlFor="customer_id" className="text-sm font-medium flex items-center gap-1">
                            {t('contracts.addModal.customer')} <span className="text-red-500">*</span>
                          </Label>
                          <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={customerOpen}
                                className="w-full justify-between h-10 mt-2"
                              >
                                {values.customer_id
                                  ? searchedCustomers.find((customer) => customer.id.toString() === values.customer_id.toString())?.full_name || t('contracts.addModal.selectCustomer')
                                  : t('contracts.addModal.selectCustomer')}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <div className="flex items-center border-b px-3">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                  placeholder={t('contracts.addModal.searchCustomer')}
                                  value={customerSearch}
                                  onChange={(e) => setCustomerSearch(e.target.value)}
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {isLoadingCustomers ? (
                                  <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                ) : searchedCustomers.length === 0 ? (
                                  <div className="py-6 text-center text-sm text-gray-500">
                                    {t('contracts.addModal.noCustomersFound')}
                                  </div>
                                ) : (
                                  <div className="p-1">
                                    {searchedCustomers.map((customer) => (
                                      <div
                                        key={customer.id}
                                        onClick={() => {
                                          setFieldValue("customer_id", customer.id.toString());
                                          setCustomerOpen(false);
                                        }}
                                        className={cn(
                                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                          values.customer_id === customer.id.toString() && "bg-accent"
                                        )}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            values.customer_id === customer.id.toString() ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex-1">
                                          <div className="font-medium">{customer.full_name}</div>
                                          <div className="text-xs text-gray-500">{customer.phone}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <ErrorMessage name="customer_id" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Car Selection */}
                        <div>
                          <Label htmlFor="car_id" className="text-sm font-medium flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            {t('contracts.addModal.car')} <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={values.car_id?.toString()}
                            onValueChange={(value) => {
                              setFieldValue("car_id", value);
                              const selectedCar = cars.find(car => car.id.toString() === value);
                              if (selectedCar?.daily_price) {
                                setFieldValue("daily_price", selectedCar.daily_price);
                                if (values.start_date && values.end_date) {
                                  const total = calculateTotalAmount(values.start_date, values.end_date, selectedCar.daily_price);
                                  setFieldValue("total_amount", total);
                                }
                              }
                              // Auto-fill km_taken_start with car's current mileage
                              if (selectedCar?.mileage != null) {
                                setFieldValue("km_taken_start", selectedCar.mileage);
                              }
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder={t('contracts.addModal.selectCar')} />
                            </SelectTrigger>
                            <SelectContent>
                              {cars.map((car) => (
                                <SelectItem key={car.id} value={car.id.toString()}>
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <span>{car.brand} {car.model} {car.year} - {car.plate_number}</span>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant={
                                          car.status === 'available' ? 'default' : 
                                          car.status === 'rented' ? 'secondary' : 
                                          car.status === 'maintenance' ? 'outline' : 
                                          'destructive'
                                        }
                                        className="text-xs"
                                      >
                                        {car.status}
                                      </Badge>
                                      {car.daily_price && (
                                        <span className="text-xs font-semibold text-green-600">
                                          AED {parseFloat(car.daily_price).toFixed(2)}/day
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage name="car_id" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Branch Selection */}
                        <div>
                          <Label htmlFor="branch_id" className="text-sm font-medium">{t('contracts.addModal.branch')}</Label>
                          <Select
                            value={values.branch_id?.toString()}
                            onValueChange={(value) => setFieldValue("branch_id", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder={t('contracts.addModal.selectBranch')} />
                            </SelectTrigger>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                  {branch.name_ar || branch.name_en || branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.notes')}</Label>
                      </div>
                      <Field name="notes" as={Textarea} rows={4} placeholder={t('contracts.addModal.additionalNotes')} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Dates & Times Tab */}
                <TabsContent value="dates" className="space-y-6 flex-1 overflow-y-auto">
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.contractPeriod')}</Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_date" className="text-sm font-medium flex items-center gap-1">
                            {t('contracts.startDate')} <span className="text-red-500">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !values.start_date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {values.start_date ? format(new Date(values.start_date), "PPP") : <span>{t('contracts.addModal.selectDate') || "Pick a date"}</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={values.start_date ? new Date(values.start_date) : undefined}
                                onSelect={(date) => {
                                  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                  setFieldValue("start_date", formattedDate);
                                  if (values.end_date && values.daily_price) {
                                    const total = calculateTotalAmount(formattedDate, values.end_date, values.daily_price);
                                    setFieldValue("total_amount", total);
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <ErrorMessage name="start_date" component="div" className="text-red-500 text-xs" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="start_time" className="text-sm font-medium">{t('contracts.addModal.startTime')}</Label>
                          <Field name="start_time" as={Input} type="time" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end_date" className="text-sm font-medium flex items-center gap-1">
                            {t('contracts.endDate')} <span className="text-red-500">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !values.end_date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {values.end_date ? format(new Date(values.end_date), "PPP") : <span>{t('contracts.addModal.selectDate') || "Pick a date"}</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={values.end_date ? new Date(values.end_date) : undefined}
                                onSelect={(date) => {
                                  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                  setFieldValue("end_date", formattedDate);
                                  if (values.start_date && values.daily_price) {
                                    const total = calculateTotalAmount(values.start_date, formattedDate, values.daily_price);
                                    setFieldValue("total_amount", total);
                                  }
                                }}
                                disabled={(date) => values.start_date ? date < new Date(values.start_date) : false}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <ErrorMessage name="end_date" component="div" className="text-red-500 text-xs" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end_time" className="text-sm font-medium">{t('contracts.addModal.endTime')}</Label>
                          <Field name="end_time" as={Input} type="time" />
                        </div>
                      </div>

                      {values.start_date && values.end_date && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>{t('contracts.addModal.duration')}:</strong> {Math.ceil((new Date(values.end_date) - new Date(values.start_date)) / (1000 * 60 * 60 * 24)) + 1} {t('contracts.addModal.days')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vehicle Details Tab */}
                <TabsContent value="vehicle" className="space-y-6 flex-1 overflow-y-auto">
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Gauge className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.kmDetails')}</Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="km_allowed" className="text-sm font-medium">{t('contracts.addModal.kmAllowed')}</Label>
                          <Field name="km_allowed" as={Input} type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="km_taken_start" className="text-sm font-medium">{t('contracts.addModal.kmAtStart')}</Label>
                          <Field name="km_taken_start" as={Input} type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="km_return_end" className="text-sm font-medium">{t('contracts.addModal.kmAtReturn')}</Label>
                          <Field name="km_return_end" as={Input} type="number" placeholder="0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Fuel className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.fuelLevel')}</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="petrol_at_take" className="text-sm font-medium">{t('contracts.addModal.petrolAtTake')}</Label>
                        <Select
                          value={values.petrol_at_take}
                          onValueChange={(value) => setFieldValue("petrol_at_take", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0% - {t('contracts.addModal.empty')}</SelectItem>
                            <SelectItem value="25">25% - {t('contracts.addModal.quarterTank')}</SelectItem>
                            <SelectItem value="50">50% - {t('contracts.addModal.halfTank')}</SelectItem>
                            <SelectItem value="75">75% - {t('contracts.addModal.threeQuarters')}</SelectItem>
                            <SelectItem value="100">100% - {t('contracts.addModal.fullTank')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment" className="space-y-6 flex-1 overflow-y-auto">
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <Label className="text-lg font-semibold">{t('contracts.addModal.pricingInfo')}</Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="daily_price" className="text-sm font-medium">{t('contracts.addModal.dailyPrice')}</Label>
                          <Field name="daily_price">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => {
                                  setFieldValue("daily_price", e.target.value);
                                  if (values.start_date && values.end_date) {
                                    const total = calculateTotalAmount(values.start_date, values.end_date, e.target.value);
                                    setFieldValue("total_amount", total);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="total_amount" className="text-sm font-medium">{t('contracts.addModal.totalAmount')}</Label>
                          <Field name="total_amount" as={Input} type="number" step="0.01" placeholder="0.00" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paid_amount" className="text-sm font-medium">{t('contracts.addModal.paidAmount')}</Label>
                          <Field name="paid_amount" as={Input} type="number" step="0.01" placeholder="0.00" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="insurance_amount" className="text-sm font-medium">{t('contracts.addModal.insuranceAmount')}</Label>
                          <Field name="insurance_amount" as={Input} type="number" step="0.01" placeholder="0.00" />
                        </div>
                      </div>

                      {values.total_amount && values.paid_amount && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                          <p className="text-sm text-green-800">
                            <strong>{t('contracts.addModal.total')}:</strong> AED {parseFloat(values.total_amount || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-green-800">
                            <strong>{t('contracts.addModal.paid')}:</strong> AED {parseFloat(values.paid_amount || 0).toFixed(2)}
                          </p>
                          <p className="text-sm font-semibold text-green-900">
                            <strong>{t('contracts.addModal.remaining')}:</strong> AED {(parseFloat(values.total_amount || 0) - parseFloat(values.paid_amount || 0)).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Attachments Tab */}
                <TabsContent value="attachments" className="space-y-6 flex-1 overflow-y-auto">
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <Label className="text-lg font-semibold">Contract Attachments</Label>
                        </div>
                        {selectedAttachments.length > 0 && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {selectedAttachments.length} {t('contracts.addModal.files')}
                          </span>
                        )}
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                        <input
                          id="attachment-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const newAttachments = files.map(file => ({ file }));
                            setSelectedAttachments(prev => [...prev, ...newAttachments]);
                            e.target.value = null;
                          }}
                        />
                        <label htmlFor="attachment-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t('contracts.addModal.uploadAttachments')}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('contracts.addModal.attachmentsHint')}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      {selectedAttachments.length > 0 && (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                          {selectedAttachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors group">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 rounded bg-primary/10">
                                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(attachment.file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAttachments(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CustomModalBody>

            <CustomModalFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t('contracts.addModal.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('contracts.addModal.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('contracts.addModal.createContract')}
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
