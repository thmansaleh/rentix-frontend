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
