import api from "./axiosInstance";

// Get all contracts
export const getContracts = async () => {
  const response = await api.get("/contracts");
  return response.data;
};

// Get contracts by customer ID
export const getContractsByCustomerId = async (customerId) => {
  const response = await api.get(`/contracts/customer/${customerId}`);
  return response.data;
};

// Get contract by ID
export const getContractById = async (id) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

// Create new contract
export const createContract = async (contractData) => {
  const response = await api.post("/contracts", contractData);
  return response.data;
};

// Update contract
export const updateContract = async (id, contractData) => {
  const response = await api.put(`/contracts/${id}`, contractData);
  return response.data;
};

// Delete contract
export const deleteContract = async (id) => {
  const response = await api.delete(`/contracts/${id}`);
  return response.data;
};

// Contract Attachments APIs
export const getContractAttachments = async (contractId) => {
  const response = await api.get(`/contracts/${contractId}/attachments`);
  return response.data;
};

export const addContractAttachment = async (contractId, attachmentData) => {
  const response = await api.post(`/contracts/${contractId}/attachments`, attachmentData);
  return response.data;
};

export const deleteContractAttachment = async (attachmentId) => {
  const response = await api.delete(`/contracts/attachments/${attachmentId}`);
  return response.data;
};
