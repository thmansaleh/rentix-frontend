import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";
export const getCases = async () => {
  const response = await api.get(`/cases`);
  return response.data;
}
export const createCase = async (caseData, caseFiles, employeesFiles, courtFiles) => {
 if (caseFiles && caseFiles.length > 0) {
   const uploadedFiles = await uploadFiles(caseFiles);
    caseData.files = uploadedFiles;
  }
  if (employeesFiles && employeesFiles.length > 0) {
    const uploadedEmployeesFiles = await uploadFiles(employeesFiles);
    caseData.employeesFiles = uploadedEmployeesFiles;
  }
  if (courtFiles && courtFiles.length > 0) {
    const uploadedCourtFiles = await uploadFiles(courtFiles);
    caseData.courtFiles = uploadedCourtFiles;
  }
  const response = await api.post(`/cases`, caseData);
 
  return response.data;
} 
export const caseTypes = async () => {  
  const response = await api.get(`/case-types`);
  return response.data;
}
export const createCaseType = async (caseData) => {
  const response = await api.post(`/case-types`, caseData);
  return response.data;
}
export const caseClassifications = async () => {  
  const response = await api.get(`/case-classifications`);
  return response.data;
}
export const createCaseClassification = async (caseData) => {
  const response = await api.post(`/case-classifications`, caseData);
  return response.data;
}
export const searchCasesForAddNewCasePage = async (term) => {
  try {
    const response = await api.get(`/cases/search`, { params: { searchTerm: term } });
    return response.data;
  } catch (error) {
    console.error('Error searching cases:', error);
    throw error;
  } 
}