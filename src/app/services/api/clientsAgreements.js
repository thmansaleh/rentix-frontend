import api from "./axiosInstance";

export const getAllClientsAgreements = async (params = {}) => {
  try {
    const response = await api.get(`/clients-agreements`, { params });
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getClientAgreementById = async (id) => {
  try {
    const response = await api.get(`/clients-agreements/${id}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const createClientAgreement = async (agreementData) => {
  try {
    const response = await api.post(`/clients-agreements`, agreementData);
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const updateClientAgreement = async (clientId, clientData) => {
  try {
    
    const response = await api.put(`/clients-agreements/${clientId}`, clientData);
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const deleteClientAgreement = async (clientId, agreementId) => {
  try {
    const response = await api.delete(`/clients/${clientId}/agreements/${agreementId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};