import React from 'react'
import { Form } from 'formik'
import { useFormikContext } from './FormikContext'
import Bar from "./Bar"
import Branch from "./Branch"
import CaseClassifications from "./CaseClassifications"
import CaseType from "./CaseType"
import Files from "./Files"
import Inputs from "./Inputs"
import SubmitButton from "./SubmitButton"
import CaseDocuments from "./CaseDocuments"

function Info({ caseId }) {
  const formikProps = useFormikContext();

  return (
    <Form className="space-y-6 p-4">
      <SubmitButton />
      <Bar formikProps={formikProps} />
      <div className="flex gap-4">
        <div className="space-y-2">
          <CaseType formikProps={formikProps} />
        </div>
        <div className="space-y-2">
          <CaseClassifications formikProps={formikProps} />
        </div>
        <div className="space-y-2">
          <Branch formikProps={formikProps} />
        </div>
      </div>
      <Inputs formikProps={formikProps} />
      <Files formikProps={formikProps} />
      
      {/* Case Documents Section */}
      <CaseDocuments caseId={caseId} />
    </Form>
  )
}

export default Info