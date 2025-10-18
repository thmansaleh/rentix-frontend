import api from "./axiosInstance";

// Get all GoAML records
export const getAllGoamlRecords = async () => {
  const response = await api.get('/goaml');
  return response.data;
};

// Get GoAML record by ID
export const getGoamlRecordById = async (id) => {
  const response = await api.get(`/goaml/${id}`);
  return response.data;
};

// Create new GoAML record
export const createGoamlRecord = async (recordData) => {
  const response = await api.post('/goaml', recordData);
  return response.data;
};

// Update GoAML record
export const updateGoamlRecord = async (id, recordData) => {
  const response = await api.put(`/goaml/${id}`, recordData);
  return response.data;
};

// Delete GoAML record
export const deleteGoamlRecord = async (id) => {
  const response = await api.delete(`/goaml/${id}`);
  return response.data;
};
