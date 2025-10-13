import api from "./axiosInstance";

export const getTrainings = async (employeeId = null) => {
  const url = employeeId ? `/trainings?employee_id=${employeeId}` : '/trainings';
  const response = await api.get(url);
  return response.data;
};

export const getTrainingById = async (id) => {
  const response = await api.get(`/trainings/${id}`);
  return response.data;
};

export const getTrainingDocuments = async (trainingId) => {
  const response = await api.get(`/trainings/${trainingId}/documents`);
  return response.data;
};

export const createTraining = async (trainingData) => {
  const response = await api.post("/trainings", trainingData);
  return response.data;
};

export const updateTraining = async (id, trainingData) => {
  const response = await api.put(`/trainings/${id}`, trainingData);
  return response.data;
};

export const deleteTrainingDocument = async (trainingId, documentId) => {
  const response = await api.delete(`/trainings/${trainingId}/documents/${documentId}`);
  return response.data;
};

export const deleteTraining = async (id) => {
  const response = await api.delete(`/trainings/${id}`);
  return response.data;
};
