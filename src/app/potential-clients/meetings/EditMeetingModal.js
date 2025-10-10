"use client";

import { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useSWR from "swr";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, Clock, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";
import meetingsApi from "../../services/api/meetings";
import { getEmployees } from "../../services/api/employees";

export function EditMeetingModal({ isOpen, onClose, meetingId, onSuccess }) {
  const { t } = useTranslations();
  const formikRef = useRef();

  // Fetch meeting details
  const { data: meetingData, error: meetingError, isLoading: meetingLoading } = useSWR(
    meetingId ? `/meetings/${meetingId}` : null,
    () => meetingsApi.getMeetingById(meetingId),
    {
      revalidateOnFocus: false,
    }
  );

  // Fetch employees for lawyer selection
  const { data: employeesData, isLoading: employeesLoading } = useSWR(
    'employees',
    getEmployees,
    {
      revalidateOnFocus: false,
    }
  );

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

  // Function to parse date for DatePicker (Date object)
  const parseDateFromAPI = (dateString) => {
    if (!dateString) return null;
    
    // Handle various date formats from API
    try {
      let date;
      
      // If it's already a Date object
      if (dateString instanceof Date) {
        date = dateString;
      } else {
        // Try to parse the date string
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return null;
      
      return date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  // Function to format date for API submission (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (!date) return "";
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for API:", error);
      return "";
    }
  };

  // Effect to populate form when data arrives
  useEffect(() => {
    if (meetingData?.data && formikRef.current) {
      const parsedDate = parseDateFromAPI(meetingData.data.date);
      
      console.log("Meeting data received:", meetingData.data);
      console.log("Original date:", meetingData.data.date);
      console.log("Parsed date:", parsedDate);
      
      // Manually set all form values
      formikRef.current.setValues({
        date: parsedDate,
        start_time: meetingData.data.start_time || "",
        end_time: meetingData.data.end_time || "",
        note: meetingData.data.note || "",
        meet_result: meetingData.data.meet_result || "",
        lawyer_id: meetingData.data.lawyer_id?.toString() || "",
        meeting_type: meetingData.data.meeting_type || ""
      });
    }
  }, [meetingData]);

  // Initial form values
  const initialValues = {
    date: parseDateFromAPI(meetingData?.data?.date) || null,
    start_time: meetingData?.data?.start_time || "",
    end_time: meetingData?.data?.end_time || "",
    note: meetingData?.data?.note || "",
    meet_result: meetingData?.data?.meet_result || "",
    lawyer_id: meetingData?.data?.lawyer_id?.toString() || "",
    meeting_type: meetingData?.data?.meeting_type || ""
  };

  // Validation schema
  const validationSchema = Yup.object({
    date: Yup.date().nullable().required(t("meetings.validation.dateRequired")),
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
    lawyer_id: Yup.string(),
    meeting_type: Yup.string()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const meetingUpdateData = {
        party_id: meetingData?.data?.party_id,
        date: formatDateForAPI(values.date),
        start_time: values.start_time || null,
        end_time: values.end_time || null,
        note: values.note || null,
        meet_result: values.meet_result || null,
        lawyer_id: values.lawyer_id || null,
        meeting_type: values.meeting_type || null,
      };

      await meetingsApi.updateMeeting(meetingId, meetingUpdateData);

      toast.success(t("meetings.messages.updateSuccess"));
      
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error(error.message || t("meetings.messages.updateError"));
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date for min date
  const today = new Date();

  if (meetingLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">{t("meetings.messages.loading")}</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (meetingError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-12 text-destructive">
            <p>{t("meetings.messages.error")}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("meetings.editModal.title")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          ref={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Client Info Display */}
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium text-gray-700">
                  {t("meetings.editModal.clientInfo")}
                </div>
                <div className="text-sm text-gray-600">
                  {meetingData?.data?.client_name} 
                  {meetingData?.data?.client_phone && ` - ${meetingData.data.client_phone}`}
                </div>
              </div>

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  {t("meetings.fields.date")} *
                </Label>
                <DatePicker
                  date={values.date}
                  onDateChange={(date) => setFieldValue("date", date)}
                  placeholder={t("meetings.placeholders.selectDate") || "Select date"}
                  minDate={today}
                  className={`w-full ${errors.date && touched.date ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Lawyer/Advisor Selection */}
              <div className="space-y-2">
                <Label htmlFor="lawyer_id" className="text-sm font-medium">
                  {t("meetings.fields.lawyer")}
                </Label>
                <Select value={values.lawyer_id} onValueChange={(value) => setFieldValue("lawyer_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("meetings.placeholders.selectLawyer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {employeesLoading ? (
                      <SelectItem value="loading" disabled>
                        {t("common.loading")}
                      </SelectItem>
                    ) : (
                      employeesData?.data?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

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
                  disabled={isSubmitting || !values.date}
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
                      {t("meetings.editModal.update")}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}