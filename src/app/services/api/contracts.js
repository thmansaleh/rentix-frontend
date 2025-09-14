import api from "./axiosInstance";

export const getContracts = async () => {
  const response = await api.get("/contracts");
  return response.data;
};

export const getContractById = async (id) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

export const createContract = async (contractData) => {
  const response = await api.post("/contracts", contractData);
  return response.data;
};

export const updateContract = async (id, contractData) => {
  const response = await api.put(`/contracts/${id}`, contractData);
  return response.data;
};

export const deleteContract = async (id) => {
  const response = await api.delete(`/contracts/${id}`);
  return response.data;
};
