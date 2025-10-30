import api from "./axiosInstance";

export const getLegalPeriods = async () => {
  const response = await api.get("/legal-periods");
  return response.data;
};

export const getLegalPeriodById = async (id) => {
  const response = await api.get(`/legal-periods/${id}`);
  return response.data;
};

export const createLegalPeriod = async (legalPeriodData) => {
  const response = await api.post("/legal-periods", legalPeriodData);
  return response.data;
};

export const updateLegalPeriod = async (id, legalPeriodData) => {
  const response = await api.put(`/legal-periods/${id}`, legalPeriodData);
  return response.data;
};

export const deleteLegalPeriod = async (id) => {
  const response = await api.delete(`/legal-periods/${id}`);
  return response.data;
};
