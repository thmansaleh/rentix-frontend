import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const createExecution = async (executionData) => {
    const files = executionData.files || [];
    const uploadedFiles = await uploadFiles(files)
    console.log('files from uploadFiles:', uploadedFiles);
    executionData.files = uploadedFiles;
  const response = await api.post("/executions", executionData);
  return response.data;
};

export const updateExecution = async (executionId, executionData) => {
  const response = await api.put(`/executions/${executionId}`, executionData);
  return response.data;
};

export const deleteExecution = async (executionId) => {
  const response = await api.delete(`/executions/${executionId}`);
  return response.data;
};
