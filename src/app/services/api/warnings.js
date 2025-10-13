import api from "./axiosInstance";

export const getWarnings = async (employeeId = null) => {
  const url = employeeId ? `/warnings?employee_id=${employeeId}` : '/warnings';
  const response = await api.get(url);
  return response.data;
};

export const getWarningById = async (id) => {
  const response = await api.get(`/warnings/${id}`);
  return response.data;
};

export const getWarningDocuments = async (warningId) => {
  const response = await api.get(`/warnings/${warningId}/documents`);
  return response.data;
};

export const createWarning = async (warningData) => {
  const response = await api.post("/warnings", warningData);
  return response.data;
};

export const updateWarning = async (id, warningData) => {
  const response = await api.put(`/warnings/${id}`, warningData);
  return response.data;
};

export const deleteWarningDocument = async (warningId, documentId) => {
  const response = await api.delete(`/warnings/${warningId}/documents/${documentId}`);
  return response.data;
};

export const deleteWarning = async (id) => {
  const response = await api.delete(`/warnings/${id}`);
  return response.data;
};
