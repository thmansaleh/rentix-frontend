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

export const getJudicialOrders = async (caseId) => {
  try {
    const response = await api.get(`/judicial-orders?caseId=${caseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching judicial orders:", error);
    throw error;
  }
};
