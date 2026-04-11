import api from "./axiosInstance";

// Get expenses with pagination and filters
export const getExpenses = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.categoryId) query.append("categoryId", params.categoryId);
  if (params.branchId) query.append("branchId", params.branchId);
  if (params.paymentMethod) query.append("paymentMethod", params.paymentMethod);
  const response = await api.get(`/expenses?${query.toString()}`);
  return response.data;
};

// Get expense by ID
export const getExpenseById = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

// Create expense
export const createExpense = async (expenseData) => {
  const response = await api.post("/expenses", expenseData);
  return response.data;
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

// Get expense categories
export const getExpenseCategories = async () => {
  const response = await api.get("/expenses/categories");
  return response.data;
};

// Create expense category
export const createExpenseCategory = async (categoryData) => {
  const response = await api.post("/expenses/categories", categoryData);
  return response.data;
};

// Get expense attachments
export const getExpenseAttachments = async (expenseId) => {
  const response = await api.get(`/expenses/${expenseId}/attachments`);
  return response.data;
};

// Add expense attachment
export const addExpenseAttachment = async (expenseId, attachmentData) => {
  const response = await api.post(`/expenses/${expenseId}/attachments`, attachmentData);
  return response.data;
};

// Delete expense attachment
export const deleteExpenseAttachment = async (attachmentId) => {
  const response = await api.delete(`/expenses/attachments/${attachmentId}`);
  return response.data;
};
