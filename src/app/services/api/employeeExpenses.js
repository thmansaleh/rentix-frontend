import api from "./axiosInstance";

// Get all employee expenses
export const getAllEmployeeExpenses = async (params = {}) => {
  const response = await api.get('/employee-expenses', { params });
  return response.data;
};

// Get expense by ID
export const getEmployeeExpenseById = async (id) => {
  const response = await api.get(`/employee-expenses/${id}`);
  return response.data;
};

// Add attachments to expense
export const addEmployeeExpenseAttachments = async (id, attachments) => {
  const response = await api.post(`/employee-expenses/${id}/attachments`, { attachments });
  return response.data;
};

// Delete expense attachment
export const deleteEmployeeExpenseAttachment = async (expenseId, attachmentId) => {
  const response = await api.delete(`/employee-expenses/${expenseId}/attachments/${attachmentId}`);
  return response.data;
};

// Create new expense
export const createEmployeeExpense = async (expenseData) => {
  const response = await api.post('/employee-expenses', expenseData);
  return response.data;
};

// Update expense
export const updateEmployeeExpense = async (id, expenseData) => {
  const response = await api.put(`/employee-expenses/${id}`, expenseData);
  return response.data;
};

// Delete expense
export const deleteEmployeeExpense = async (id) => {
  const response = await api.delete(`/employee-expenses/${id}`);
  return response.data;
};
