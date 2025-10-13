import api from "@/app/services/api/axiosInstance";

/**
 * Upload files to Cloudflare R2 via backend API and return formatted result
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Optional folder path in storage (default: 'documents')
 * @returns {Promise<Array<{document_name: string, document_url: string}>>}
 */
export const uploadFiles = async (files, folder = 'documents') => {
  try {
    // Validate input
    if (!files || !Array.isArray(files) || files.length === 0) {
      return [];
    }

    // Create FormData to send files
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    // Get the backend URL from environment or default
    const backendUrl = api|| 'http://localhost:8080/api';
    
    // Get auth token from localStorage or cookie
    const token = localStorage.getItem('token');

    // Upload files to backend API
    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include', // Include cookies
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();

    // Check if upload was successful
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    // Return the array of {document_name, document_url}
    return result.files;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error(error.message || 'Failed to upload files');
  }
};

/**
 * Upload a single file to Firebase Storage and return formatted result
 * @param {File} file - File to upload
 * @param {string} folder - Optional folder path in storage (default: 'documents')
 * @returns {Promise<{document_name: string, document_url: string}>}
 */
export const uploadFile = async (file, folder = 'documents') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const result = await uploadFiles([file], folder);
    
    if (result.length === 0) {
      throw new Error('Upload failed');
    }

    return result[0];
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};
