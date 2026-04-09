import api from "./axiosInstance";

// Get all bank accounts
export const getAllBankAccounts = async () => {
  const response = await api.get('/bank-accounts');
  return response.data;
};

// Get bank account by ID
export const getBankAccountById = async (id) => {
  const response = await api.get(`/bank-accounts/${id}`);
  return response.data;
};

// Create new bank account
export const createBankAccount = async (bankAccountData) => {
  const response = await api.post('/bank-accounts', bankAccountData);
  return response.data;
};

// Update bank account
export const updateBankAccount = async (id, bankAccountData) => {
  const response = await api.put(`/bank-accounts/${id}`, bankAccountData);
  return response.data;
};

// Delete bank account
export const deleteBankAccount = async (id) => {
  const response = await api.delete(`/bank-accounts/${id}`);
  return response.data;
};

// Get account transactions (payments + expenses) for a bank account
export const getAccountTransactions = async (id, params = {}) => {
  const response = await api.get(`/bank-accounts/${id}/transactions`, { params });
  return response.data;
};

// Get bank account statistics
export const getBankAccountStatistics = async (params = {}) => {
  const response = await api.get('/bank-accounts/statistics', { params });
  return response.data;
};