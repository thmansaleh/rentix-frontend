import api from "./axiosInstance";

// ─── Tenants ────────────────────────────────────────────────────────
export const getTenants = async (params = {}) => {
  const response = await api.get("/tenant/all", { params });
  return response.data;
};

export const getTenantById = async (id) => {
  const response = await api.get(`/tenant/${id}`);
  return response.data;
};

export const createTenant = async (data) => {
  const response = await api.post("/tenant", data);
  return response.data;
};

export const updateTenant = async (id, data) => {
  const response = await api.put(`/tenant/${id}`, data);
  return response.data;
};

export const deleteTenant = async (id) => {
  const response = await api.delete(`/tenant/${id}`);
  return response.data;
};

// ─── Subscription ───────────────────────────────────────────────────
export const getTenantSubscription = async (tenantId) => {
  const response = await api.get(`/tenant/${tenantId}/subscription`);
  return response.data;
};

export const updateTenantSubscription = async (tenantId, data) => {
  const response = await api.put(`/tenant/${tenantId}/subscription`, data);
  return response.data;
};

export const getSubscriptionLogs = async (tenantId) => {
  const response = await api.get(`/tenant/${tenantId}/subscription-logs`);
  return response.data;
};

// ─── Invoices ───────────────────────────────────────────────────────
export const getTenantInvoices = async (tenantId) => {
  const response = await api.get(`/tenant/${tenantId}/invoices`);
  return response.data;
};

export const createTenantInvoice = async (tenantId, data) => {
  const response = await api.post(`/tenant/${tenantId}/invoices`, data);
  return response.data;
};

export const updateTenantInvoice = async (tenantId, invoiceId, data) => {
  const response = await api.put(`/tenant/${tenantId}/invoices/${invoiceId}`, data);
  return response.data;
};

export const deleteTenantInvoice = async (tenantId, invoiceId) => {
  const response = await api.delete(`/tenant/${tenantId}/invoices/${invoiceId}`);
  return response.data;
};

// ─── Payments ───────────────────────────────────────────────────────
export const getTenantPayments = async (tenantId) => {
  const response = await api.get(`/tenant/${tenantId}/payments`);
  return response.data;
};

export const createTenantPayment = async (tenantId, data) => {
  const response = await api.post(`/tenant/${tenantId}/payments`, data);
  return response.data;
};

export const updateTenantPayment = async (tenantId, paymentId, data) => {
  const response = await api.put(`/tenant/${tenantId}/payments/${paymentId}`, data);
  return response.data;
};

export const deleteTenantPayment = async (tenantId, paymentId) => {
  const response = await api.delete(`/tenant/${tenantId}/payments/${paymentId}`);
  return response.data;
};

// ─── Plans ──────────────────────────────────────────────────────────
export const getSubscriptionPlans = async () => {
  const response = await api.get("/tenant/plans");
  return response.data;
};

// ─── Stats ──────────────────────────────────────────────────────────
export const getTenantStats = async (tenantId) => {
  const response = await api.get(`/tenant/${tenantId}/stats`);
  return response.data;
};

// ─── Addon Definitions ──────────────────────────────────────────────
export const getAddonDefinitions = async () => {
  const response = await api.get('/tenant/addon-definitions');
  return response.data;
};

// ─── Tenant Addons ───────────────────────────────────────────────────
export const createTenantAddon = async (tenantId, data) => {
  const response = await api.post(`/tenant/${tenantId}/addons`, data);
  return response.data;
};

export const updateTenantAddon = async (tenantId, addonId, data) => {
  const response = await api.put(`/tenant/${tenantId}/addons/${addonId}`, data);
  return response.data;
};

export const deleteTenantAddon = async (tenantId, addonId) => {
  const response = await api.delete(`/tenant/${tenantId}/addons/${addonId}`);
  return response.data;
};
