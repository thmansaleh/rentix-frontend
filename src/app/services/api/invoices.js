import api from "./axiosInstance";

// Get all invoices
export const getAllInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

// Get invoices by client ID
export const getInvoicesByClientId = async (clientId) => {
  const response = await api.get(`/invoices/client/${clientId}`);
  return response.data;
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  const response = await api.put(`/invoices/${id}`, invoiceData);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

// Delete invoice attachment
export const deleteInvoiceAttachment = async (attachmentId) => {
  const response = await api.delete(`/invoices/attachments/${attachmentId}`);
  return response.data;
};

// Update invoice status
export const updateInvoiceStatus = async (id, status) => {
  const response = await api.patch(`/invoices/${id}/status`, { status });
  return response.data;
};

// Upload invoice attachments
export const uploadInvoiceAttachments = async (invoiceId, formData) => {
  const response = await api.post(`/invoices/${invoiceId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get invoice statistics
export const getInvoiceStatistics = async (params = {}) => {
  const response = await api.get('/invoices/statistics', { params });
  return response.data;
};
