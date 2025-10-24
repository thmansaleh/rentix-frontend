import api from "./axiosInstance";

// Get all expenses with pagination
export const getAllExpenses = async (params = {}) => {
  const { page = 1, limit = 10 } = params;
  const queryParams = new URLSearchParams();
  queryParams.append("page", page);
  queryParams.append("limit", limit);
  
  const response = await api.get(`/wallet-expenses?${queryParams.toString()}`);
  return response.data;
};

// Get all expenses for a wallet
export const getExpensesByWalletId = async (walletId) => {
  const response = await api.get(`/wallet-expenses/wallet/${walletId}`);
  return response.data;
};

// Get a single expense by ID
export const getExpenseById = async (expenseId) => {
  const response = await api.get(`/wallet-expenses/${expenseId}`);
  return response.data;
};

// Create a new wallet expense
export const createWalletExpense = async (expenseData) => {
  const response = await api.post("/wallet-expenses", expenseData);
  return response.data;
};

// Update an existing wallet expense
export const updateWalletExpense = async (expenseId, expenseData) => {
  const response = await api.put(`/wallet-expenses/${expenseId}`, expenseData);
  return response.data;
};

// Delete a wallet expense
export const deleteWalletExpense = async (expenseId) => {
  const response = await api.delete(`/wallet-expenses/${expenseId}`);
  return response.data;
};

// Get expense items for a specific expense
export const getExpenseItems = async (expenseId) => {
  const response = await api.get(`/wallet-expenses/${expenseId}/items`);
  return response.data;
};

// Upload receipts for an expense
export const uploadReceipts = async (expenseId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('receipts', file);
  });
  const response = await api.post(`/wallet-expenses/${expenseId}/receipts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get receipts for an expense
export const getExpenseReceipts = async (expenseId) => {
  const response = await api.get(`/wallet-expenses/${expenseId}/receipts`);
  return response.data;
};

// Delete a receipt
export const deleteReceipt = async (expenseId, receiptId) => {
  const response = await api.delete(`/wallet-expenses/${expenseId}/receipts/${receiptId}`);
  return response.data;
};

// Approve (verify) an expense
export const approveExpense = async (expenseId) => {
  const response = await api.post(`/wallet-expenses/${expenseId}/approve`);
  return response.data;
};

// Reject an expense
export const rejectExpense = async (expenseId, rejection_reason) => {
  const response = await api.post(`/wallet-expenses/${expenseId}/reject`, { rejection_reason });
  return response.data;
};
