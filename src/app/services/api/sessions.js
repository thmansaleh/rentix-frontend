import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";
export const getAllSessions = async () => {
  const response = await api.get("/sessions");
  return response.data;
}
export const getSession = async (id) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};
export const getSessionsThisWeek = async () => {
  const response = await api.get("/sessions/this-week");
  return response.data;
}
export const getSessionsNoDecision = async () => {
  const response = await api.get("/sessions/no-decision");
  return response.data;
}
export const getSessionsWithDecisions = async () => {
  const response = await api.get("/sessions/with-decision");
  return response.data;
}

export const createSession = async (sessionData) => {
  const sessionFiles = sessionData.files || [];
  if (sessionFiles && sessionFiles.length > 0) {
    const uploadedFiles = await uploadFiles(sessionFiles);
    sessionData.files = uploadedFiles;
  }
  const response = await api.post("/sessions", sessionData);
  return response.data;
};

export const updateSession = async (id, sessionData) => {
  const response = await api.put(`/sessions/${id}`, sessionData);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
};
export const getSessionDocuments = async (id) => {
  const response = await api.get(`/sessions/${id}/documents`);
  return response.data;
};
export const deleteSessionDocument = async (sessionId, documentId) => {
  const response = await api.delete(`/sessions/${sessionId}/documents/${documentId}`);
  return response.data;
};