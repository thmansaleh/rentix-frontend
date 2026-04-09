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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, Save, FileText, Check, ChevronsUpDown, Search, Upload, X, User, Car, DollarSign, Calendar, Gauge, Fuel, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { createContract } from "../services/api/contracts";
import { getCars } from "../services/api/cars";
import { getCustomers } from "../services/api/customers";

import { addContractAttachment } from "../services/api/contracts";
import { getCustomerById } from "../services/api/customers";
import { uploadFiles } from "../../../utils/fileUpload";
import useSWR from 'swr';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export function AddContractModal({ isOpen, onClose, onSuccess, defaultCarId, defaultCustomerId }) {
  const { t } = useTranslations();
    const {isRTL} = useLanguage();
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  // Fetch cars — only when modal is open
  const { data: carsData } = useSWR(isOpen ? 'cars' : null, () => getCars());
  const cars = carsData?.data || carsData || [];

  // Load initial customers (default 10)
  useEffect(() => {
    if (isOpen) {
      loadCustomers("");
    }
  }, [isOpen]);

  // Pre-load defaultCustomerId customer
  useEffect(() => {
    if (isOpen && defaultCustomerId) {
      getCustomerById(defaultCustomerId)
        .then((res) => {
          const customer = res?.data;
          if (customer) {
            setSearchedCustomers((prev) => {
              const exists = prev.some((c) => c.id === customer.id);
              return exists ? prev : [customer, ...prev];
            });
          }
        })
        .catch(() => {});
    }
  }, [isOpen, defaultCustomerId]);

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

  const defaultCar = defaultCarId ? cars.find((c) => c.id.toString() === defaultCarId.toString()) : null;

  const initialValues = {
    customer_id: defaultCustomerId ? defaultCustomerId.toString() : "",
    car_id: defaultCarId ? defaultCarId.toString() : "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    km_allowed: "",
    km_taken_start: defaultCar?.mileage ?? "",
    km_return_end: "",
    petrol_at_take: "100",
    daily_price: defaultCar?.daily_price ?? "",
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
        notes: values.notes || null,
      };

      const result = await createContract(contractData);
      const contractId = result.contract.id;

      // Build display-ready contract from local data (avoids extra API call)
      const selectedCustomer = searchedCustomers.find(c => c.id.toString() === values.customer_id.toString());
      const selectedCar = cars.find(c => c.id.toString() === values.car_id.toString());
      const newDisplayContract = {
        ...result.contract,
        customer_name: selectedCustomer?.full_name || '',
        customer_phone: selectedCustomer?.phone || '',
        car_details: selectedCar ? `${selectedCar.brand} ${selectedCar.model} ${selectedCar.year}`.trim() : '',
        plate_number: selectedCar?.plate_number || '',
      };

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
          onSuccess(newDisplayContract);
          onClose();
          return;
        }
      }

      toast.success(t('contracts.createSuccess'));

      resetForm();
      setSelectedAttachments([]);
      onSuccess(newDisplayContract);
      onClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast.error(error.response?.data?.message || t('contracts.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = defaultCarId && defaultCar
    ? `${t('contracts.addModal.title')} — ${[defaultCar.brand, defaultCar.model, defaultCar.year, defaultCar.plate_number].filter(Boolean).join(' ')}`
    : t('contracts.addModal.title');

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={modalTitle}
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <CustomModalBody className="h-[70vh] overflow-y-auto">
              <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 mb-4 flex-shrink-0">
                  <TabsTrigger value="basic" className="text-sm gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {t('contracts.addModal.tabs.basicInfo')}
                  </TabsTrigger>
                  <TabsTrigger value="vehicle" className="text-sm gap-1.5">
                    <Gauge className="w-3.5 h-3.5" />
                    {t('contracts.addModal.tabs.vehicle')}
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="text-sm gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {t('contracts.addModal.tabs.payment')}
                  </TabsTrigger>
                  <TabsTrigger value="attachments" className="text-sm gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t('contracts.addModal.tabs.attachments')}
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 flex-1 overflow-y-auto">
                  {/* Customer & Car */}
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {t('contracts.addModal.customer')}{!defaultCarId && ` & ${t('contracts.addModal.car')}`}
                    </p>
                    <div className={cn("grid gap-3", !defaultCarId ? "grid-cols-2" : "grid-cols-1")}>
                      <div>
                        <Label className="text-sm  mb-1 block">
                          {t('contracts.addModal.customer')} <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between h-9 text-sm">
                              <span className="truncate">
                                {values.customer_id
                                  ? searchedCustomers.find((c) => c.id.toString() === values.customer_id.toString())?.full_name || t('contracts.addModal.selectCustomer')
                                  : t('contracts.addModal.selectCustomer')}
                              </span>
                              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
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
                            <div className="max-h-[260px] overflow-y-auto">
                              {isLoadingCustomers ? (
                                <div className="flex items-center justify-center py-6"><Loader2 className="h-4 w-4 animate-spin" /></div>
                              ) : searchedCustomers.length === 0 ? (
                                <div className="py-6 text-center text-sm ">{t('contracts.addModal.noCustomersFound')}</div>
                              ) : (
                                <div className="p-1">
                                  {searchedCustomers.map((customer) => (
                                    <div
                                      key={customer.id}
                                      onClick={() => { setFieldValue("customer_id", customer.id.toString()); setCustomerOpen(false); }}
                                      className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", values.customer_id === customer.id.toString() && "bg-accent")}
                                    >
                                      <Check className={cn("mr-2 h-3.5 w-3.5", values.customer_id === customer.id.toString() ? "opacity-100" : "opacity-0")} />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{customer.full_name}</div>
                                        <div className="text-sm ">{customer.phone}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage name="customer_id" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {!defaultCarId && (
                        <div>
                          <Label className="text-sm  mb-1 flex items-center gap-1">
                            <Car className="w-3 h-3" /> {t('contracts.addModal.car')} <span className="text-red-500">*</span>
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
                              if (selectedCar?.mileage != null) setFieldValue("km_taken_start", selectedCar.mileage);
                            }}
                          >
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder={t('contracts.addModal.selectCar')} />
                            </SelectTrigger>
                            <SelectContent>
                              {cars.map((car) => (
                                <SelectItem key={car.id} value={car.id.toString()} disabled={car.status !== 'available'}>
                                  <div className="flex items-center justify-between w-full gap-3">
                                    <span className={cn("text-sm", car.status !== 'available' && "opacity-50")}>
                                      {car.brand} {car.model} {car.year} - {car.plate_number}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant={car.status === 'available' ? 'default' : car.status === 'rented' ? 'secondary' : car.status === 'maintenance' ? 'outline' : 'destructive'} className="text-sm">
                                        {car.status === 'available' ? t('cars.statusAvailable') : car.status === 'rented' ? t('cars.statusRented') : car.status === 'maintenance' ? t('cars.statusMaintenance') : t('cars.statusSold')}
                                      </Badge>
                                      {car.daily_price && <span className="text-sm font-semibold text-green-600">AED {parseFloat(car.daily_price).toFixed(2)}/day</span>}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage name="car_id" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contract Period */}
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('contracts.addModal.contractPeriod')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm  mb-1 block">
                          {t('contracts.startDate')} <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left text-sm h-9 font-normal", !values.start_date && "")}>
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {values.start_date ? format(new Date(values.start_date), "dd MMM yyyy") : ''}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent mode="single" selected={values.start_date ? new Date(values.start_date) : undefined}
                              onSelect={(date) => {
                                const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                setFieldValue("start_date", formattedDate);
                                if (values.end_date && values.daily_price) setFieldValue("total_amount", calculateTotalAmount(formattedDate, values.end_date, values.daily_price));
                              }} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage name="start_date" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.startTime')}</Label>
                        <Field name="start_time" as={Input} type="time" className="h-9 text-sm" />
                      </div>

                      <div>
                        <Label className="text-sm  mb-1 block">
                          {t('contracts.endDate')} <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left text-sm h-9 font-normal", !values.end_date && "")}>
                                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                  {values.end_date ? format(new Date(values.end_date), "dd MMM yyyy") : ''}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent mode="single" selected={values.end_date ? new Date(values.end_date) : undefined}
                              onSelect={(date) => {
                                const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                setFieldValue("end_date", formattedDate);
                                if (values.start_date && values.daily_price) setFieldValue("total_amount", calculateTotalAmount(values.start_date, formattedDate, values.daily_price));
                              }}
                              disabled={(date) => values.start_date ? date < new Date(values.start_date) : false} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage name="end_date" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.endTime')}</Label>
                        <Field name="end_time" as={Input} type="time" className="h-9 text-sm" />
                      </div>
                    </div>

                    {values.start_date && values.end_date && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>{t('contracts.addModal.duration')}:</strong> {Math.ceil((new Date(values.end_date) - new Date(values.start_date)) / (1000 * 60 * 60 * 24)) + 1} {t('contracts.addModal.days')}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="rounded-lg border bg-card p-4 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {t('contracts.addModal.notes')}
                    </p>
                    <Field name="notes" as={Textarea} rows={3} className="text-sm resize-none" placeholder={t('contracts.addModal.additionalNotes')} />
                  </div>
                </TabsContent>

                {/* Vehicle Details Tab */}
                <TabsContent value="vehicle" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5" />
                      {t('contracts.addModal.kmDetails')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.kmAllowed')}</Label>
                        <Field name="km_allowed" as={Input} type="number" placeholder="0" className="h-9 text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.kmAtStart')}</Label>
                        <Field name="km_taken_start" as={Input} type="number" placeholder="0" className="h-9 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5" />
                      {t('contracts.addModal.fuelLevel')}
                    </p>
                    <div>
                      <Label className="text-sm  mb-1 block">{t('contracts.addModal.petrolAtTake')}</Label>
                      <Select value={values.petrol_at_take} onValueChange={(value) => setFieldValue("petrol_at_take", value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% — {t('contracts.addModal.empty')}</SelectItem>
                          <SelectItem value="25">25% — {t('contracts.addModal.quarterTank')}</SelectItem>
                          <SelectItem value="50">50% — {t('contracts.addModal.halfTank')}</SelectItem>
                          <SelectItem value="75">75% — {t('contracts.addModal.threeQuarters')}</SelectItem>
                          <SelectItem value="100">100% — {t('contracts.addModal.fullTank')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment" className="space-y-4 flex-1 overflow-y-auto">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {t('contracts.addModal.pricingInfo')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.dailyPrice')}</Label>
                        <Field name="daily_price">
                          {({ field }) => (
                            <Input {...field} type="number" step="0.01" placeholder="0.00" className="h-9 text-sm"
                              onChange={(e) => {
                                setFieldValue("daily_price", e.target.value);
                                if (values.start_date && values.end_date) setFieldValue("total_amount", calculateTotalAmount(values.start_date, values.end_date, e.target.value));
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.totalAmount')}</Label>
                        <Field name="total_amount" as={Input} type="number" step="0.01" placeholder="0.00" className="h-9 text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.paidAmount')}</Label>
                        <Field name="paid_amount" as={Input} type="number" step="0.01" placeholder="0.00" className="h-9 text-sm" />
                      </div>
                      <div>
                        <Label className="text-sm  mb-1 block">{t('contracts.addModal.insuranceAmount')}</Label>
                        <Field name="insurance_amount" as={Input} type="number" step="0.01" placeholder="0.00" className="h-9 text-sm" />
                      </div>
                    </div>
                  </div>

                  {values.total_amount && values.paid_amount && (
                    <div className="rounded-lg border bg-green-50 border-green-200 p-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-sm  mb-0.5">{t('contracts.addModal.total')}</p>
                        <p className="text-sm font-semibold text-green-800">AED {parseFloat(values.total_amount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm  mb-0.5">{t('contracts.addModal.paid')}</p>
                        <p className="text-sm font-semibold text-green-800">AED {parseFloat(values.paid_amount || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm  mb-0.5">{t('contracts.addModal.remaining')}</p>
                        <p className="text-sm font-bold text-green-900">AED {(parseFloat(values.total_amount || 0) - parseFloat(values.paid_amount || 0)).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Attachments Tab */}
                <TabsContent value="attachments" className="space-y-3 flex-1 overflow-y-auto">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold uppercase tracking-wide  flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {t('contracts.addModal.attachments')}
                      </p>
                      {selectedAttachments.length > 0 && (
                        <span className="text-sm ">{selectedAttachments.length} {t('contracts.addModal.files')}</span>
                      )}
                    </div>

                    <div className="border border-dashed rounded-lg p-5 text-center hover:border-primary hover:bg-accent/40 transition-all cursor-pointer group">
                      <input id="attachment-upload" type="file" multiple className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setSelectedAttachments(prev => [...prev, ...files.map(file => ({ file }))]);
                          e.target.value = null;
                        }}
                      />
                      <label htmlFor="attachment-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('contracts.addModal.uploadAttachments')}</p>
                          <p className="text-sm  mt-0.5">{t('contracts.addModal.attachmentsHint')}</p>
                        </div>
                      </label>
                    </div>

                    {selectedAttachments.length > 0 && (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {selectedAttachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between px-3 py-2 bg-accent/50 hover:bg-accent rounded-md transition-colors group">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                                <p className="text-sm ">{(attachment.file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <Button type="button"  variant="outline" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setSelectedAttachments(prev => prev.filter((_, i) => i !== index))}>
                              <X className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
