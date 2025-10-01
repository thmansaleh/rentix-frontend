import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";
export const casePetitions = async () => {
  const response = await api.get("/case-petitions");
  return response.data;
}
export const updateCasePetition = async (id, casePetitionData) => {
  const response = await api.put(`/case-petitions/${id}`, casePetitionData);
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