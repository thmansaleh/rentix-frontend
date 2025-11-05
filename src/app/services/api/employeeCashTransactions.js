import api from "./axiosInstance";

// Get all employee cash transactions
export const getAllEmployeeCashTransactions = async (params = {}) => {
  const response = await api.get('/employee-cash-transactions', { params });
  return response.data;
};

// Get transaction by ID
export const getEmployeeCashTransactionById = async (id) => {
  const response = await api.get(`/employee-cash-transactions/${id}`);
  return response.data;
};

// Create new transaction
export const createEmployeeCashTransaction = async (transactionData) => {
  const response = await api.post('/employee-cash-transactions', transactionData);
  return response.data;
};

// Update transaction
export const updateEmployeeCashTransaction = async (id, transactionData) => {
  const response = await api.put(`/employee-cash-transactions/${id}`, transactionData);
  return response.data;
};

// Delete transaction
export const deleteEmployeeCashTransaction = async (id) => {
  const response = await api.delete(`/employee-cash-transactions/${id}`);
  return response.data;
};

// Delete attachment
export const deleteEmployeeCashTransactionAttachment = async (transactionId, attachmentId) => {
  const response = await api.delete(`/employee-cash-transactions/${transactionId}/attachments/${attachmentId}`);
  return response.data;
};

// Get transactions by client ID
export const getEmployeeCashTransactionsByClientId = async (clientId, params = {}) => {
  const response = await api.get('/employee-cash-transactions', { 
    params: { 
      client_id: clientId,
      ...params 
    } 
  });
  return response.data;
};

// Get transaction statistics for charts
export const getEmployeeCashTransactionStatistics = async (params = {}) => {
  const response = await api.get('/employee-cash-transactions/statistics', { params });
  return response.data;
};
