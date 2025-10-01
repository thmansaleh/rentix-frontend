import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const createJudicialOrder = async (data) => {
    const files = data.files || [];
    console.log('Files to upload:', files);
  try {
    if (files.length > 0) {
      const uploadedFiles = await uploadFiles(files);
      data.files = uploadedFiles;
    }

    const response = await api.post("/judicial-orders", data);

    return response.data;
  } catch (error) {
    console.error("Error creating judicial order:", error);
    throw error;
  }
};

export const updateJudicialOrder = async (id, data) => {
  const files = data.files || [];
  console.log('Files to upload:', files);

  try {
    if (files.length > 0) {
      const uploadedFiles = await uploadFiles(files);
      data.files = uploadedFiles;
    }

    const response = await api.put(`/judicial-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating judicial order:", error);
    throw error;
  }
};

export const getJudicialOrdersByCaseId = async (caseId) => {
  try {
    const response = await api.get(`/judicial-orders/case/${caseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching judicial orders by case ID:", error);
    throw error;
  }
};
export const getJudicialOrderById = async (id) => {
  try {
    const response = await api.get(`/judicial-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching judicial order by ID:", error);
    throw error;
  }
};

export const getJudicialOrders = async (caseId) => {
  try {
    const response = await api.get(`/judicial-orders?caseId=${caseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching judicial orders:", error);
    throw error;
  }
};

export const deleteJudicialOrder = async (id) => {
  try {
    const response = await api.delete(`/judicial-orders/${id}`);  
    return response.data;
  } catch (error) {
    console.error("Error deleting judicial order:", error);
    throw error;
  } 
};
export const deleteJudicialOrderDocument = async ( documentId) => {
  try {
    const response = await api.delete(`/judicial-orders/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting judicial order document:", error);
    throw error;
  }
};
