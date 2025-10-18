import api from "./axiosInstance";

// Get all client invoices with filters and pagination
export const getAllClientInvoices = async (params = {}) => {
  const response = await api.get('/client-invoices', { params });
  return response.data;
};

// Get invoice by ID
export const getClientInvoiceById = async (id) => {
  const response = await api.get(`/client-invoices/${id}`);
  return response.data;
};

// Get invoices by client ID
export const getInvoicesByClientId = async (clientId) => {
  const response = await api.get(`/client-invoices/client/${clientId}`);
  return response.data;
};

// Create new invoice
export const createClientInvoice = async (invoiceData) => {
  const response = await api.post('/client-invoices', invoiceData);
  return response.data;
};

// Update invoice
export const updateClientInvoice = async (id, invoiceData) => {
  const response = await api.put(`/client-invoices/${id}`, invoiceData);
  return response.data;
};

// Delete invoice
export const deleteClientInvoice = async (id) => {
  const response = await api.delete(`/client-invoices/${id}`);
  return response.data;
};

// Get invoice statistics
export const getInvoiceStats = async (clientId = null) => {
  const params = clientId ? { client_id: clientId } : {};
  const response = await api.get('/client-invoices/stats', { params });
  return response.data;
};
