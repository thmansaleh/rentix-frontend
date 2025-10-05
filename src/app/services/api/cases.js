import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const getCases = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.branchId) queryParams.append('branchId', params.branchId);
  if (params.fromDate) queryParams.append('fromDate', params.fromDate);
  if (params.toDate) queryParams.append('toDate', params.toDate);
  if (params.fileNumber) queryParams.append('fileNumber', params.fileNumber);
  if (params.caseNumber) queryParams.append('caseNumber', params.caseNumber);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/cases?${queryString}` : '/cases';
  
  const response = await api.get(url);
  return response.data;
}
export const getCaseById = async (id) => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
}
export const getAllCaseDetails = async (id) => {
  const response = await api.get(`/cases/all-details/${id}`);
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
export const getCaseDocuments = async (id) => {
  const response = await api.get(`/cases/${id}/documents`);
  return response.data;
};
export const deleteCaseDocument = async (caseId, documentId) => {
  const response = await api.delete(`/cases/${caseId}/documents/${documentId}`);
  return response.data;
};
export const getCaseEmployeesDocuments = async (id) => {
  const response = await api.get(`/cases/${id}/employees-documents`);
  return response.data;
};
export const deleteCaseEmployeeDocument = async (caseId, documentId) => {
  const response = await api.delete(`/cases/${caseId}/employees-documents/${documentId}`);
  return response.data;
}

export const getCaseCourtDocuments = async (id) => {
  const response = await api.get(`/cases/${id}/court-documents`);
  return response.data;
};
export const deleteCaseCourtDocument = async (caseId, documentId) => {
  const response = await api.delete(`/cases/${caseId}/court-documents/${documentId}`);
  return response.data;
};
export const deleteCase = async (id) => {
  const response = await api.delete(`/cases/${id}`);
  return response.data;
};
export const updateCase = async (id, caseData, caseFiles, employeesFiles, courtFiles) => {
//  console.log('updateCase called with:', { caseFiles });
//   return null
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
  const response = await api.put(`/cases/${id}`, caseData);

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