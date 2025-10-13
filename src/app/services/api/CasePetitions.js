import { ca } from "date-fns/locale";
import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";
export const casePetitions = async () => {
  const response = await api.get("/case-petitions");
  return response.data;
}
export const updateCasePetition = async (id, casePetitionData) => {
  const documents = casePetitionData.files || [];
if (documents.length > 0) {
  const uploadedFiles = await uploadFiles(documents)
  console.log('files from uploadFiles:', uploadedFiles);
  casePetitionData.files = uploadedFiles;
}
  const response = await api.put(`/case-petitions/${id}`, { ...casePetitionData });
  return response.data;
}
export const getCasePetitionById = async (id) => {
  const response = await api.get(`/case-petitions/${id}`);
  return response.data;
}
export const getCasePetitionsByCaseId = async (caseId) => {
  const response = await api.get(`/case-petitions/case/${caseId}`);
  return response.data;
}
export const createCasePetition = async (casePetitionData) => {
  const files= await uploadFiles(casePetitionData.files)
  console.log('files from uploadFiles:', files);

  const response = await api.post("/case-petitions", { ...casePetitionData, files });
  return response.data;
}

export const deleteCasePetition = async (id) => {
  const response = await api.delete(`/case-petitions/${id}`);
  return response.data;
}

export const deleteCasePetitionDocument = async (documentId) => {
  const response = await api.delete(`/case-petitions/documents/${documentId}`);
  return response.data;
}