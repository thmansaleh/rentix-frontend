"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Book, Building2, List, NotebookText, StickyNote, Users } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { FormikProvider } from "./FormikContext";
import Sessions from "./sessions/sessions";
import Employees from "./employees/Employees";
import Court from "./court/Court";
import CourtAndPoliceStations from "./court/CourtAndPoliceStations";
import Info from "./info/Info";
import Parties from "./parties/Parties";
import Petition from "./petition/Petition";
import Execution from "./execution/Execution";
import JudicialNotices from "./judicial-notices/JudicialNotices";
import CaseDegrees from "./case-degrees/CaseDegrees";
import Tasks from "./tasks/Tasks";
import SaveCaseButton from "./SaveCaseButton";
import { createCase } from '@/app/services/api/cases';
import { addPartyToCase } from '@/app/services/api/parties';
import { createSession } from '@/app/services/api/sessions';
import { createCaseDegree } from '@/app/services/api/caseDegrees';
import { createCasePetition } from '@/app/services/api/CasePetitions';
import { createExecution } from '@/app/services/api/executions';
import { createJudicialOrder } from '@/app/services/api/judicialOrders';
function AddCasePage() {
  const { t } = useTranslations();

  // Handle form submission
  const handleSubmit = async(values, { setSubmitting, setStatus, setFieldError, resetForm }) => {
    console.log('Submitting form with values:', values);
    
    // Clear any previous error status
    setStatus(null);
    setSubmitting(true);
    
    // Show persistent loading toast
    const loadingToast = toast.loading('جاري انشاء قضية...');
    
    try {
      console.log('Form values at submission:', values);
      
      const caseData = {
        case_number: values.caseNumber || null,
        police_station_id: values.policeStationId || null,
        public_prosecution_id: values.publicProsecutionId || null,
        court_id: values.courtId || null,
        lawyer_id: values.lawyerId || null,
        secretary_id: values.secretaryId || null,
        case_classification_id: values.caseClassificationId || null,
        case_type_id: values.caseTypeId || null,
        legal_advisor_id: values.legalAdvisorId || null,
        legal_researcher_id: values.legalResearcherId || null,
        counter_case_id: values.counterCaseId || null,
        fees: values.fees || 0,
        start_date: values.caseStartDate || null,
        additional_note: values.additionalNote || null,
        topic: values.topic || null,
        branch_id: values.branchId || null,
        isImportant: values.isImportant || 0,
        is_secret: values.is_secret || 0,
        is_archived: values.is_archived || 0
      };

      
      // First, create the case
      const employeesFiles = values.caseFiles || [];
      const courtFiles = values.courtFiles || [];
      const createdCase = await createCase(caseData, values.caseFiles, employeesFiles, courtFiles);
      console.log('Case created successfully:', createdCase);
      const caseId = createdCase.caseId;

      // Then, associate parties with the created case
      if(values.parties && values.parties.length > 0){
        for(const party of values.parties){
          await addPartyToCase({
            caseId: caseId,
            partyId: party.id,
            type: party.party_type,
            files: party.files || [],
          });
        }
      }

      // add case degrees
      if(values.caseDegrees && values.caseDegrees.length > 0){
        for(const degree of values.caseDegrees){
          await createCaseDegree({
            case_id: caseId,
            degree: degree.degree,
            case_number: degree.case_number,
            year: degree.year,
            referral_date: degree.referral_date
          });
        }
      }

      // add petitions
      if(values.petition && values.petition.length > 0){
        for(const petition of values.petition){
          await createCasePetition({
            case_id: caseId,
            date: petition.submissionDate,
            decision: petition.judgeDecision,
            type: petition.orderType,
            appealDate: petition.appealDate,
            files: petition.files || []
          });
        }
      }

      // add sessions
      if(values.sessions && values.sessions.length > 0){
        for(const session of values.sessions){
          await createSession({
            case_id: caseId,
            session_date: session.date,
            link: session.link,
            is_expert_session: session.isExpertSession,
            note: session.note,
            files: session.files || []
          });
        }
      }

      // add executions
      if(values.executions && values.executions.length > 0){
        for(const execution of values.executions){
          await createExecution({
            case_id: caseId,
            date: execution.date,
            type: execution.type,
            status: execution.status,
            amount: execution.amount,
            files: execution.attachedFiles || []
          });
        }
      }

      // create Judicial order
      if(values.JudicialNotices && values.JudicialNotices.length > 0){
        for(const notice of values.JudicialNotices){
          await createJudicialOrder({
            case_id: caseId,
            date: notice.certificationDate,
            notification_period_days: notice.noticePeriod || null,
            case_filed: notice.lawsuitFiled,
            service_completed: notice.noticeCompleted,
            files: notice.files || []
          });
        }
      }

      // Show success toast
      toast.dismiss(loadingToast); // Dismiss loading toast first
      toast.success('تم انشاء قضية بنجاح');

      // Reset form to initial values after successful submission
      resetForm({
        values: initialValues,
        errors: {},
        touched: {},
        status: {
          type: 'success',
          message: 'تم انشاء القضية بنجاح وتم إعادة تعيين النموذج'
        }
      });

    } catch(error){
      console.error('Error creating case:', error);
      toast.dismiss(loadingToast); // Dismiss loading toast first
      
      // Set general error status
      setStatus({
        type: 'error',
        message: 'حدث خطأ أثناء إنشاء القضية. يرجى المحاولة مرة أخرى.'
      });
      
      // Show error toast with more specific message if available
      const errorMessage = error?.response?.data?.message || error?.message || 'حدث خطأ أثناء إنشاء القضية';
      toast.error(errorMessage);
      
      // If there are field-specific errors, set them
      if (error?.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    branchId: null,
    caseNumber: '',
    fees: '',
    caseStartDate: null,
    caseTypeId: null,
    caseClassificationId: null,
    policeStationId: null,
    publicProsecutionId: null,
    courtId: null,
    lawyerId: null,
    secretaryId: null,
    legalAdvisorId: null,
    legalResearcherId: null,
    counterCaseFileNumbers: [],
    additionalNote: '',
    topic: '',
    is_important: false,
    is_secret: false,
    is_archived: false,
    caseFiles: {
      files: [],
      filesNames: []
    },
    parties: [],
    selectedParties: [],
    caseDegrees: [], // Added missing caseDegrees array
    sessions: [],
    executions: [],
    JudicialNotices: [],
    petition: [],
    litigationStages: [],
    tasks: [],
    employeeFiles: [],
    courtFiles: [],
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    caseNumber: Yup.string().required(t('validation.caseNumberRequired') || 'Case number is required'),
    caseTypeId: Yup.string().required(t('validation.caseTypeRequired') || 'Case type is required'),
    caseClassificationId: Yup.string().required(t('validation.caseClassificationRequired') || 'Case classification is required'),
    branchId: Yup.string().required(t('validation.branchRequired') || 'Branch is required'),
    policeStationId: Yup.string().required(t('validation.policeStationRequired') || 'Police station is required'),
    courtId: Yup.string().required(t('validation.courtRequired') || 'Court is required'),
    publicProsecutionId: Yup.string().required(t('validation.publicProsecutionRequired') || 'Public prosecution is required'),
    fees: Yup.string().required(t('validation.feesRequired') || 'Fees and expenses are required'),
    topic: Yup.string().required(t('validation.topicRequired') || 'Subject is required'),
    lawyerId: Yup.string().required(t('validation.lawyerRequired') || 'Lawyer is required'),
    legalAdvisorId: Yup.string().required(t('validation.legalAdvisorRequired') || 'Legal advisor is required'),
    secretaryId: Yup.string().required(t('validation.secretaryRequired') || 'Secretary is required'),
    legalResearcherId: Yup.string().required(t('validation.legalResearcherRequired') || 'Legal researcher is required'),
    caseStartDate: Yup.date().nullable().required(t('validation.caseStartDateRequired') || 'Start date is required'),
    selectedParties: Yup.array().min(1, t('validation.partiesRequired') || 'At least one party is required'),
    parties: Yup.array(),
    sessions: Yup.array(),
    executions: Yup.array(),
    JudicialNotices: Yup.array(),
    petition: Yup.array(),
    tasks: Yup.array(),
  });

  const accordions = [
    {
      title: t('addCase.basicInfo'),
      content: <Info />,
      icon: <StickyNote />,
    },
    {
      title: t('addCase.courtsAndPolice'),
      content: <CourtAndPoliceStations />,
      icon: <Building2 />,
    },
      {
      title: t('addCase.team'),
      content: <Employees />,
      icon: <Users />,
    },
    {
      title: t('addCase.parties'),
      content: <Parties />,
      icon: <Users />,
    },
     {
      title: t('addCase.initiationProceeding'),
      content: <CaseDegrees />,
      icon: <NotebookText />,
    },
     {
      title: t('addCase.petition'),
      content: <Petition />,
      icon: <NotebookText />,
    },
  
    
    {
      title: t('addCase.sessions'),
      content: <Sessions />,
      icon: <NotebookText />,
    },
   
    {
      title: t('addCase.execution'),
      content: <Execution />,
      icon: <NotebookText />,
    },
    {
      title: t('addCase.judicialNotices'),
      content: <JudicialNotices />,
      icon: <NotebookText />,
    },
   
    // {
    //   title: t('addCase.tasks'),
    //   content: <Tasks />,
    //   icon: <NotebookText />,
    // },
  ];
  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, submitForm, validateForm, isValid, status }) => (
        <FormikProvider formikProps={{ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, submitForm }}>
          <Form>
            <div className="pb-24"> {/* Add bottom padding to prevent content being hidden behind sticky button */}
              {/* Status Display */}
              {status && (
                <div className={`mb-4 p-4 rounded-lg ${status.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`text-sm ${status.type === 'error' ? 'text-red-700' : 'text-green-700'}`}>
                    {status.message}
                  </p>
                </div>
              )}
              
              <Accordion type="multiple" defaultValue={["users"]}>
                {accordions.map((accordion, index) => (
                  <AccordionItem className="border-b my-2" value={accordion.title} key={index}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        {accordion.icon}
                        <span className="font-semibold text-md">{accordion.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>{accordion.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {/* Sticky Save Button */}
              <SaveCaseButton 
                onClick={() => {
                  console.log('Save case clicked with values:', values);
                }}
                onSubmitForm={submitForm}
                validateForm={validateForm}
                isValid={isValid}
                isLoading={isSubmitting}
                formValues={values}
              />
            </div>
          </Form>
        </FormikProvider>
      )}
    </Formik>
  )
}

export default AddCasePage