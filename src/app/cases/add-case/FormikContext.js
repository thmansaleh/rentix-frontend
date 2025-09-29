"use client"
import React, { createContext, useContext } from 'react';

// Create context for Formik form methods
const FormikContext = createContext();

// Provider component
export const FormikProvider = ({ children, formikProps }) => {
  return (
    <FormikContext.Provider value={formikProps}>
      {children}
    </FormikContext.Provider>
  );
};

// Custom hook to use Formik context
export const useFormikContext = () => {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error('useFormikContext must be used within a FormikProvider');
  }
  return context;
};

export default FormikContext;