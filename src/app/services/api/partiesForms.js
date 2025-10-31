import axiosInstance from './axiosInstance';
import { uploadFile } from '../../../../utils/fileUpload';

const API_URL = '/parties-forms';

export const getPartiesForms = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch parties forms');
  }
};

export const getPartiesFormById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch parties form');
  }
};

export const getPartiesFormTypes = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch form types');
  }
};

export const createPartiesForm = async (formData) => {
  try {
    const response = await axiosInstance.post(API_URL, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create parties form');
  }
};

export const createPartiesFormWithUpload = async (file, title, type) => {
  try {
    // 1. Upload file to Cloudflare R2
    const uploadResult = await uploadFile(file, 'parties-forms');
    
    if (!uploadResult || !uploadResult.document_url) {
      throw new Error('File upload failed');
    }
    
    // 2. Create form record in database
    const response = await axiosInstance.post(API_URL, {
      title: title,
      document_name: file.name,
      document_url: uploadResult.document_url,
      type: type
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create parties form with upload');
  }
};

export const updatePartiesForm = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update parties form');
  }
};

export const deletePartiesForm = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete parties form');
  }
};

export const downloadPartiesForm = async (id) => {
  try {
    // For direct download, we'll use window.open
    const baseURL = axiosInstance.defaults.baseURL || '';
    const downloadUrl = `${baseURL}${API_URL}/${id}/download`;
    window.open(downloadUrl, '_blank');
  } catch (error) {
    throw new Error('Failed to download parties form');
  }
};
