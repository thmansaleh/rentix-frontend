import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const getPartiesByBranch = async (branchId) => {
  try {
    const response = await api.get(`/parties/branch/${branchId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCaseParties = async (caseId) => {
  try {
    const response = await api.get(`/cases/${caseId}/parties`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createParty = async (partyData) => {
  const response = await api.post("/parties", partyData);
  return response.data;
}
export const addPartyToCase = async (partyData) => {
  if (partyData.files && partyData.files.length > 0) {
    const uploadedFiles = await uploadFiles(partyData.files);
    partyData.files = uploadedFiles;
  }
  const response = await api.post(`/cases/${partyData.caseId}/add-party`, { 
    party_id: partyData.partyId,
    type: partyData.type,
    files: partyData.files
  });
  return response.data;
} 

export const updateCaseParty = async (caseId, partyId, partyData) => {
  if (partyData.files && partyData.files.length > 0) {
    const uploadedFiles = await uploadFiles(partyData.files);
    partyData.files = uploadedFiles;
  }
  const response = await api.put(`/cases/${caseId}/parties/${partyId}`, partyData);
  return response.data;
}
export const removePartyFromCase = async (caseId, partyId) => {
  const response = await api.delete(`/cases/${caseId}/party/${partyId}`);
  return response.data;
}
export const getCasePartyDocuments = async (caseId, partyId) => {
  const response = await api.get(`/cases/${caseId}/party-documents/${partyId}`);
  return response.data;
}
export const addCasePartyDocument = async (caseId, partyId, documentData) => {
  if (documentData.files && documentData.files.length > 0) {
    const uploadedFiles = await uploadFiles(documentData.files);
    documentData.files = uploadedFiles;
  }
  const response = await api.post(`/cases/${caseId}/party-documents/${partyId}`, documentData);
  return response.data;
} 
export const deleteCasePartyDocument = async (caseId, partyId, documentId) => {
  const response = await api.delete(`/cases/${caseId}/party-documents/${partyId}/${documentId}`);
  return response.data;
}
