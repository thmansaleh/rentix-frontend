'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { tr } from 'date-fns/locale';
import { updateCase } from '@/app/services/api/cases';
import { toast } from 'react-toastify';

const FormikContext = createContext();

export const useFormikContext = () => {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error('useFormikContext must be used within a FormikProvider');
  }
  return context;
};

export const FormikProvider = ({ children, caseId, caseData }) => {
  const [initialValues, setInitialValues] = useState({
    case_number: '',
    police_station_id: '',
    public_prosecution_id: '',
    court_id: '',
    // Employee IDs should match the type returned by the API (likely numbers)
    lawyer_id: null,
    secretary_id: null,
    legal_advisor_id: null,
    legal_researcher_id: null,
    case_classification_id: '',
    case_type_id: '',
    counter_case_id: '',
    fees: '',
    start_date: '',
    additional_note: '',
    topic: '',
    branch_id: '',
    isImportant: false,
    is_secret: false,
    is_archived: false,
    employeesFiles: [],
    courtFiles: [],
    caseFiles: []
  });

  // Process case data when it changes
  useEffect(() => {
    if (caseData) {
      console.log('� Processing Case Data from parent:', caseData);
      
      // Format the date to YYYY-MM-DD for input compatibility
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      const newInitialValues = {
        case_number: caseData.case_number || '',
        police_station_id: caseData.police_station_id?.toString() || '',
        public_prosecution_id: caseData.public_prosecution_id?.toString() || '',
        court_id: caseData.court_id?.toString() || '',
        // Keep employee IDs as numbers to match the employee data from API
        lawyer_id: caseData.lawyer_id || '',
        secretary_id: caseData.secretary_id || '',
        legal_advisor_id: caseData.legal_advisor_id || '',
        legal_researcher_id: caseData.legal_researcher_id || '',
        case_classification_id: caseData.case_classification_id?.toString() || '',
        case_type_id: caseData.case_type_id?.toString() || '',
        counter_case_id: caseData.counter_case_id || '',
        fees: caseData.fees || '',
        start_date: formatDate(caseData.start_date),
        additional_note: caseData.additional_note || '',
        topic: caseData.topic || '',
        branch_id: caseData.branch_id?.toString() || '',
        isImportant: Boolean(caseData.is_important),
        is_secret: Boolean(caseData.is_secret),
        is_archived: Boolean(caseData.is_archived),
        employeesFiles: [],
        courtFiles: [],
        caseFiles: []
      };
      
      console.log('🚀 Setting new initial values:', newInitialValues);
      setInitialValues(newInitialValues);
    }
  }, [caseData]);

  // Add debugging for initial values changes
  useEffect(() => {
    console.log('📊 Initial values updated:', initialValues);
  }, [initialValues]);

  const validationSchema = Yup.object().shape({
    case_number: Yup.string().required('Case number is required'),
    police_station_id: Yup.string().required('Police station is required'),
    public_prosecution_id: Yup.string().required('Public prosecution is required'),
    court_id: Yup.string().required('Court is required'),
    // Employee IDs can be numbers and are required
    lawyer_id: Yup.mixed().required('Lawyer is required'),
    secretary_id: Yup.mixed().required('Secretary is required'),
    legal_advisor_id: Yup.mixed().required('Legal advisor is required'),
    legal_researcher_id: Yup.mixed().required('Legal researcher is required'),
    case_classification_id: Yup.string().required('Case classification is required'),
    case_type_id: Yup.string().required('Case type is required'),
    counter_case_id: Yup.string(),
    fees: Yup.number().min(0, 'Fees must be positive').required('Fees are required'),
    start_date: Yup.date().required('Start date is required'),
    additional_note: Yup.string(),
    topic: Yup.string().required('Topic is required'),
    branch_id: Yup.string().required('Branch is required'),
    isImportant: Yup.boolean(),
    is_secret: Yup.boolean(),
    is_archived: Yup.boolean(),
    employeesFiles: Yup.array(),
    courtFiles: Yup.array()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('📋 calling api:', values);
    //  return null
    // Log specific sections
    const caseData = {
      case_number: values.case_number,
      police_station_id: parseInt(values.police_station_id) || null,
      public_prosecution_id: parseInt(values.public_prosecution_id) || null,
      court_id: parseInt(values.court_id) || null,
      // Employee IDs are already in the correct format (numbers)
      lawyer_id: values.lawyer_id,
      secretary_id: values.secretary_id,
      legal_advisor_id: values.legal_advisor_id,
      legal_researcher_id: values.legal_researcher_id,
      case_classification_id: parseInt(values.case_classification_id) || null,
      case_type_id: parseInt(values.case_type_id) || null,
      counter_case_id: values.counter_case_id || null,
      fees: parseFloat(values.fees) || 0,
      start_date: values.start_date,
      additional_note: values.additional_note,
      topic: values.topic,
      branch_id: parseInt(values.branch_id) || null,
      isImportant: values.isImportant,
      is_secret: values.is_secret,
      is_archived: values.is_archived
    };

    const employeesFiles = values.employeesFiles || [];
    const courtFiles = values.courtFiles || [];
    const caseFiles = values.caseFiles || [];
    try {
      await updateCase(caseId, caseData, caseFiles, employeesFiles, courtFiles);
      // Show success toast
      toast.success('تم تحديث القضية بنجاح');
    } catch (error) {
      console.error('Error logging file sections:', error);
      // Show error toast
      toast.error('حدث خطأ أثناء تحديث القضية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      key={caseId} // Force re-render when caseId changes
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true} // Allow Formik to reinitialize when initialValues change
    >
      {(formikProps) => (
        <FormikContext.Provider value={formikProps}>
          {children}
        </FormikContext.Provider>
      )}
    </Formik>
  );
};