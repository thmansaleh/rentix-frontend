import api from "./axiosInstance";
import { uploadFiles } from "../../../../utils/fileUpload";
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

export const createClientDeal = async (dealData, files = []) => {
  
  try {
    // Upload files first if any
    let uploadedFiles = [];
    if (files && files.length > 0) {
      uploadedFiles = await uploadFiles(files, 'deal-documents');
    }
    
    // Send deal data with uploaded file references
    const response = await api.post(`/clients-deals`, {
      data: JSON.stringify(dealData),
      files: JSON.stringify(uploadedFiles)
    });
    return response.data;
  } catch (error) {
    console.error("Error creating client deal:", error);
    throw error;
  }
};

export const updateClientDeal = async (dealId, dealData, files = []) => {
  try {
    // Upload files first if any
    let uploadedFiles = [];
    if (files && files.length > 0) {
      uploadedFiles = await uploadFiles(files, 'deal-documents');
    }
    
    // Send deal data with uploaded file references
    const response = await api.put(`/clients-deals/${dealId}`, {
      data: JSON.stringify(dealData),
      files: JSON.stringify(uploadedFiles)
    });
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

export const deleteDealDocument = async (dealId, documentId) => {
  try {
    const response = await api.delete(`/clients-deals/${dealId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting deal document:", error);
    throw error;
  }
};