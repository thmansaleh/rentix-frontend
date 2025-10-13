import api from "./axiosInstance";  
export const getAllClientsDeals = async (params = {}) => {
  try {
    const response = await api.get(`/clients-deals`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching client deals:", error);
    throw error;
  }
};
export const getClientDealById = async (id) => {
  try {
    const response = await api.get(`/clients-deals/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client deal:", error);
    throw error;
  }
};
export const getClientDealsByClientId = async (clientId) => {
  try {
    const response = await api.get(`/clients-deals/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client deals by client ID:", error);
    throw error;
  }
};
export const createClientDeal = async (dealData) => {
  try {
    const response = await api.post(`/clients-deals`, dealData);
    return response.data;
  } catch (error) {
    console.error("Error creating client deal:", error);
    throw error;
  }
};
export const updateClientDeal = async (dealId, dealData) => {
  try {
    const response = await api.put(`/clients-deals/${dealId}`, dealData);
    return response.data;
  } catch (error) {
    console.error("Error updating client deal:", error);
    throw error;
  }
};
export const deleteClientDeal = async (dealId) => {
  try {
    const response = await api.delete(`/clients-deals/${dealId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting client deal:", error);
    throw error;
  }
};