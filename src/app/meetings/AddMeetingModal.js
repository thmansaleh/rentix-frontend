"use client";

import { useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomModal, CustomModalBody } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Loader2, Save, Upload, X, FileText, Users, MapPin } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";
import meetingsApi from "../services/api/meetings";
import { getEmployees } from "../services/api/employees";
import { searchParties } from "../services/api/parties";
import { uploadFiles } from "../../../utils/fileUpload";
import useSWR from "swr";

export function AddMeetingModal({ isOpen, onClose, onSuccess, partyId }) {
  const { t } = useTranslations();
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch employees for attendee selection
  const { data: employeesData, isLoading: employeesLoading } = useSWR(
    'employees',
    getEmployees,
    {
      revalidateOnFocus: false,
    }
  );

  const employees = employeesData?.data || [];

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle party/client search
  const handlePartySearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query);
      if (response.success) {
        setPartySearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching parties:', error);
      setPartySearchResults([]);
    }
  }, []);

  // Format party options for combobox
  const partyOptions = partySearchResults.map(party => ({
    value: party.id,
    label: `${party.name}${party.phone ? ` - ${party.phone}` : ''}`,
    phone: party.phone,
    name: party.name
  }));

  const meetingResults = [
    { value: "scheduled", label: t("meetings.results.scheduled") },
    { value: "completed", label: t("meetings.results.completed") },
    { value: "cancelled", label: t("meetings.results.cancelled") },
    { value: "rescheduled", label: t("meetings.results.rescheduled") },
    { value: "no_show", label: t("meetings.results.noShow") }
  ];

  const meetingTypes = [
    { value: "online", label: t("meetings.types.online") },
    { value: "onsite", label: t("meetings.types.onsite") }
  ];

  // Initial form values
  const initialValues = {
    party_id: partyId || "",
    date: "",
    start_time: "",
    end_time: "",
    note: "",
    meet_result: "",
    meeting_type: "",
    address: "",
    employee_ids: []
  };

  // Validation schema
  const validationSchema = Yup.object({
    party_id: partyId ? Yup.string() : Yup.string().required(t("meetings.validation.clientRequired")),
    date: Yup.string().required(t("meetings.validation.dateRequired")),
    start_time: Yup.string(),
    end_time: Yup.string().when("start_time", {
      is: (start_time) => start_time && start_time.length > 0,
      then: (schema) => schema.test("is-after", t("meetings.validation.endTimeAfterStart"), function(end_time) {
        const { start_time } = this.parent;
        if (!start_time || !end_time) return true;
        return end_time > start_time;
      }),
      otherwise: (schema) => schema
    }),
    note: Yup.string(),
    meet_result: Yup.string(),
    meeting_type: Yup.string(),
    address: Yup.string(),
    employee_ids: Yup.array()
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create meeting first
      const meetingData = {
        party_id: values.party_id,
        date: values.date,
        start_time: values.start_time || null,
        end_time: values.end_time || null,
        note: values.note || null,
        meet_result: values.meet_result || null,
        meeting_type: values.meeting_type || null,
        address: values.address || null,
        employee_ids: values.employee_ids || []
      };

      const result = await meetingsApi.createMeeting(meetingData);
      const meetingId = result.id;

      // Upload files if any
      if (selectedFiles.length > 0) {
        try {
          const uploadedFiles = await uploadFiles(selectedFiles, 'meetings');
          
          // Add documents to meeting
          await meetingsApi.addMeetingDocuments(meetingId, uploadedFiles);
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          toast.warning(t("meetings.messages.meetingCreatedFilesError"));
        }
      }

      toast.success(t("meetings.messages.createSuccess"));
      
      resetForm();
      setSelectedFiles([]);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error(error.message || t("meetings.messages.createError"));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle employee toggle
  const handleEmployeeToggle = (employeeId, setFieldValue, currentIds) => {
    const newIds = currentIds.includes(employeeId)
      ? currentIds.filter(id => id !== employeeId)
      : [...currentIds, employeeId];
    setFieldValue("employee_ids", newIds);
  };

  // Handle select all employees
  const handleSelectAll = (setFieldValue, currentIds) => {
    if (currentIds.length === filteredEmployees.length) {
      setFieldValue("employee_ids", []);
    } else {
      setFieldValue("employee_ids", filteredEmployees.map(emp => emp.id));
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} size="lg">
      <CustomModalBody 
        title={
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("meetings.addModal.title")}
          </div>
        }
      >

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Client/Party Selection with SearchableCombobox - Hidden when partyId is provided */}
              {!partyId && (
                <div className="space-y-2">
                  <Label htmlFor="party_id" className="text-sm font-medium">
                    {t("meetings.fields.client")} *
                  </Label>
                  <SearchableCombobox
                    value={values.party_id}
                    onValueChange={(value) => setFieldValue("party_id", value)}
                    onSearch={handlePartySearch}
                    options={partyOptions}
                    placeholder={t("meetings.placeholders.selectClient")}
                    searchPlaceholder={t("meetings.placeholders.searchClient")}
                    emptyMessage={t("meetings.messages.noResults")}
                    minSearchLength={3}
                    className={errors.party_id && touched.party_id ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="party_id" component="div" className="text-red-500 text-sm" />
                </div>
              )}
              <div className="flex  gap-x-4">

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  {t("meetings.fields.date")} *
                </Label>
                <Field name="date">
                  {({ field }) => (
                    <Input
                      {...field}
                      id="date"
                      type="date"
                      min={today}
                      className={`w-full ${errors.date && touched.date ? "border-red-500" : ""}`}
                    />
                  )}
                </Field>
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {t("meetings.fields.address")}
                </Label>
                <Field name="address">
                  {({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      placeholder={t("meetings.placeholders.enterAddress")}
                      className="w-full"
                    />
                  )}
                </Field>
              </div>

           </div>

              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="text-sm font-medium">
                    {t("meetings.fields.startTime")}
                  </Label>
                  <Field name="start_time">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="start_time"
                        type="time"
                        className="w-full"
                      />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time" className="text-sm font-medium">
                    {t("meetings.fields.endTime")}
                  </Label>
                  <Field name="end_time">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="end_time"
                        type="time"
                        min={values.start_time}
                        className={`w-full ${errors.end_time && touched.end_time ? "border-red-500" : ""}`}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="end_time" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
<div className="flex  gap-x-4">
   {/* Meeting Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="meeting_type" className="text-sm font-medium">
                  {t("meetings.fields.meetingType")}
                </Label>
                <Select value={values.meeting_type} onValueChange={(value) => setFieldValue("meeting_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("meetings.placeholders.selectMeetingType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Meeting Result */}
              <div className="space-y-2">
                <Label htmlFor="meet_result" className="text-sm font-medium">
                  {t("meetings.fields.result")}
                </Label>
                <Select value={values.meet_result} onValueChange={(value) => setFieldValue("meet_result", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("meetings.placeholders.selectResult")} />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingResults.map((result) => (
                      <SelectItem key={result.value} value={result.value}>
                        {result.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
</div>
              {/* Notes Field */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  {t("meetings.fields.notes")}
                </Label>
                <Field name="note">
                  {({ field }) => (
                    <Textarea
                      {...field}
                      id="note"
                      placeholder={t("meetings.placeholders.enterNotes")}
                      rows={4}
                      className="w-full resize-none"
                    />
                  )}
                </Field>
              </div>

              {/* Employees Attendance Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("meetings.fields.attendees")}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {values.employee_ids.length} {t("meetings.labels.selected")}
                  </span>
                </div>

                {/* Search */}
                <Input
                  placeholder={t("meetings.placeholders.searchEmployee")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />

                {/* Select All */}
                <div className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md bg-muted/50">
                  <Checkbox
                    id="select-all"
                    checked={filteredEmployees.length > 0 && values.employee_ids.length === filteredEmployees.length}
                    onCheckedChange={() => handleSelectAll(setFieldValue, values.employee_ids)}
                  />
                  <Label htmlFor="select-all" className="cursor-pointer flex-1 font-medium">
                    {t("meetings.labels.selectAll")}
                  </Label>
                </div>

                {/* Employees List */}
                <ScrollArea className="h-48 border rounded-md p-2">
                  {employeesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      {t("meetings.messages.noEmployees")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center space-x-2 space-x-reverse p-2 hover:bg-muted/50 rounded-md transition-colors"
                        >
                          <Checkbox
                            id={`employee-${employee.id}`}
                            checked={values.employee_ids.includes(employee.id)}
                            onCheckedChange={() => handleEmployeeToggle(employee.id, setFieldValue, values.employee_ids)}
                          />
                          <Label
                            htmlFor={`employee-${employee.id}`}
                            className="cursor-pointer flex-1"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{employee.name}</span>
                              {(employee.role_ar || employee.role_en) && (
                                <span className="text-sm text-muted-foreground">
                                  {employee.role_ar || employee.role_en}
                                </span>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("meetings.fields.documents")}
                </Label>
                
                {/* File Input */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('meeting-file-input').click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t("meetings.actions.uploadFiles")}
                  </Button>
                  <input
                    id="meeting-file-input"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t("meetings.labels.selectedFiles")}: {selectedFiles.length}
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2">
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !values.date || !values.party_id}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t("common.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("common.save")}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModalBody>
    </CustomModal>
  );
}
