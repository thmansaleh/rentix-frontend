'use client';
import React, { useState, useRef } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-toastify';

const SaveCaseButton = ({ 
  isLoading = false, 
  onClick = () => {}, 
  disabled = false,
  className = "",
  formValues = {},
  onSubmitForm = () => {}, // This will be the Formik submitForm function
  validateForm = () => {}, // Formik's validateForm function
  isValid = true, // Formik's isValid state
  setTouched = () => {}, // Formik's setTouched function to mark fields as touched
  ...props 
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  
  // State to track if a submission is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref to track the last submission time for debouncing
  const lastSubmissionTime = useRef(0);
  const submissionTimeout = useRef(null);
  
  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    // Prevent rapid successive clicks (debouncing)
    if (now - lastSubmissionTime.current < DEBOUNCE_DELAY) {
      // console.log('Submission blocked: too soon after last submission');
      return;
    }
    
    // Prevent submission if already submitting
    if (isSubmitting || isLoading) {
      return;
    }
    
    // Clear any existing timeout
    if (submissionTimeout.current) {
      clearTimeout(submissionTimeout.current);
    }
    
    try {
      setIsSubmitting(true);
      lastSubmissionTime.current = now;
      
      // Validate form before submission
      const errors = await validateForm();
      
      // Check if there are validation errors
      if (Object.keys(errors).length > 0) {
        // Mark all fields as touched so errors are displayed
        const touchedFields = {};
        const markAllTouched = (obj, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const fieldPath = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              markAllTouched(obj[key], fieldPath);
            } else {
              touchedFields[fieldPath] = true;
            }
          });
        };
        markAllTouched(errors);
        
        // Set all fields as touched
        if (setTouched) {
          setTouched(touchedFields);
        }
        
        // Show error toast with the first error message
        const firstError = Object.values(errors)[0];
        const errorMessage = typeof firstError === 'string' 
          ? firstError 
          : (typeof firstError === 'object' ? Object.values(firstError)[0] : 'يرجى ملء جميع الحقول المطلوبة');
        
        toast.error(errorMessage || 'يرجى ملء جميع الحقول المطلوبة');
        
        setIsSubmitting(false);
        return;
      }
      
      // Call the original onClick handler first
      if (onClick) {
        await onClick();
      }
      
      // Then trigger Formik's validation and submission
      await onSubmitForm();
      
    } catch (error) {

    } finally {
      // Reset submitting state after a delay to prevent rapid resubmissions
      submissionTimeout.current = setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (submissionTimeout.current) {
        clearTimeout(submissionTimeout.current);
      }
    };
  }, []);

  const isButtonDisabled = isLoading || disabled || isSubmitting;

  return (
      <div className="max-w-7xl sticky  bottom-0 left-0 right-0 z-10 h-20  w-full flex items-center justify-between">
      

        {/* Action buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Save as Draft button - for mobile and desktop */}
        

          {/* Main Save button */}
          <Button
            onClick={handleSubmit}
            size="default"
            className={`
              flex-1 md:flex-none min-w-[140px]
              shadow-lg hover:shadow-xl
              transition-all duration-200 
              transform hover:scale-[1.02] active:scale-[0.98]
              ${isButtonDisabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
              ${className}
            `}
            disabled={isButtonDisabled}
            type="button"
            {...props}
          >
            {(isLoading || isSubmitting) ? (
              <>
                <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isSubmitting ? t('buttons.submitting') || 'Submitting...' : t('buttons.saving')}
              </>
            ) : (
              <>
                <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('buttons.save')} 
              </>
            )}
          </Button>
        </div>
      </div>

      
 
  );
};

export default SaveCaseButton;