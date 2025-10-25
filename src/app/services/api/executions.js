import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const createExecution = async (executionData) => {
    const files = executionData.files || [];
    const uploadedFiles = await uploadFiles(files)
    executionData.files = uploadedFiles;
  const response = await api.post("/executions", executionData);
  return response.data;
};

export const getExecutionByCaseId = async (caseId) => {
  const response = await api.get(`/executions/case/${caseId}`);
  return response.data;
};

export const getExecutionById = async (executionId) => {
  const response = await api.get(`/executions/${executionId}`);
  return response.data;
};

export const updateExecution = async (executionId, executionData) => {
  const files = executionData.files || [];
  if (files.length > 0) {
    const uploadedFiles = await uploadFiles(files);
    executionData.files = uploadedFiles;
  }
  const response = await api.put(`/executions/${executionId}`, executionData);
  return response.data;
};

export const deleteExecution = async (executionId) => {
  const response = await api.delete(`/executions/${executionId}`);
  return response.data;
};
export const deleteExecutionDocument = async ( documentId) => {
  const response = await api.delete(`/executions/documents/${documentId}`);
  return response.data;
};
