import axiosInstance from './axiosInstance';
import { uploadFile } from '../../../../utils/fileUpload';

const API_URL = '/forms';

export const getForms = async (document_for = null) => {
  try {
    const params = document_for ? { document_for } : {};
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forms');
  }
};

export const getFormById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch form');
  }
};

export const getFormTypes = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch form types');
  }
};

export const createForm = async (formData) => {
  try {
    const response = await axiosInstance.post(API_URL, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create form');
  }
};

export const createFormWithUpload = async (file, documentFor) => {
  try {
    // 1. Upload file to Cloudflare R2
    const uploadResult = await uploadFile(file, 'forms');
    
    if (!uploadResult || !uploadResult.document_url) {
      throw new Error('File upload failed');
    }
    
    // 2. Create form record in database
    const response = await axiosInstance.post(API_URL, {
      document_url: uploadResult.document_url,
      document_for: documentFor
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create form with upload');
  }
};

export const updateForm = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update form');
  }
};

export const deleteForm = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete form');
  }
};

export const downloadForm = async (id) => {
  try {
    // Get the signed URL from backend
    const response = await axiosInstance.get(`${API_URL}/${id}/download`);
    
    if (response.data.success && response.data.data.url) {
      // Open the signed AWS URL directly
      window.open(response.data.data.url, '_blank');
      return response.data;
    } else {
      throw new Error('Failed to get download URL');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to download form');
  }
};