import api from "./axiosInstance";

// Get all deposits
export const getAllDeposits = async () => {
  const response = await api.get('/deposits');
  return response.data;
};

// Get deposits by bank account ID
export const getDepositsByBankAccountId = async (bankAccountId) => {
  const response = await api.get(`/deposits/bank-account/${bankAccountId}`);
  return response.data;
};

// Get deposit by ID
export const getDepositById = async (id) => {
  const response = await api.get(`/deposits/${id}`);
  return response.data;
};

// Create new deposit
export const createDeposit = async (depositData) => {
  const response = await api.post('/deposits', depositData);
  return response.data;
};

// Update deposit
export const updateDeposit = async (id, depositData) => {
  const response = await api.put(`/deposits/${id}`, depositData);
  return response.data;
};

// Delete deposit
export const deleteDeposit = async (id) => {
  const response = await api.delete(`/deposits/${id}`);
  return response.data;
};
