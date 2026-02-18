import api from "./axiosInstance";

// ─── INVOICES ───

export const getAllInvoices = async (params = {}) => {
  const response = await api.get('/invoices', { params });
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const getInvoicesByCustomerId = async (customerId) => {
  const response = await api.get(`/invoices/customer/${customerId}`);
  return response.data;
};

export const getInvoicesByContractId = async (contractId) => {
  const response = await api.get('/invoices', { params: { contract_id: contractId, limit: 100 } });
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
};

export const updateInvoice = async (id, invoiceData) => {
  const response = await api.put(`/invoices/${id}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const response = await api.patch(`/invoices/${id}/status`, { status });
  return response.data;
};

export const getInvoiceStatistics = async (params = {}) => {
  const response = await api.get('/invoices/statistics', { params });
  return response.data;
};

// ─── PAYMENTS (linked to invoices) ───

export const getPaymentsByInvoiceId = async (invoiceId) => {
  const response = await api.get(`/payments/invoice/${invoiceId}`);
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const updatePayment = async (id, paymentData) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

export const getPaymentStatistics = async (params = {}) => {
  const response = await api.get('/payments/statistics', { params });
  return response.data;
};
