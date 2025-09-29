import { uploadFilesToFirebase } from '../src/app/services/api/firebaseStorage.js';

/**
 * Upload files to Firebase Storage and return formatted result
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

    // Upload files using existing Firebase service
    const result = await uploadFilesToFirebase(files, folder);

    // Check if upload was successful
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    // Transform the result to match the requested format
    const formattedResult = result.files.map(file => ({
      document_name: file.filename,
      document_url: file.url
    }));

    return formattedResult;
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

/**
 * Example usage:
 * 
 * // Upload multiple files
 * const files = [file1, file2, file3];
 * const uploadedFiles = await uploadFiles(files, 'cases');
 * console.log(uploadedFiles);
 * // Output: [
 * //   { document_name: "contract.pdf", document_url: "https://firebase..." },
 * //   { document_name: "evidence.jpg", document_url: "https://firebase..." }
 * // ]
 * 
 * // Upload single file
 * const uploadedFile = await uploadFile(file, 'documents');
 * console.log(uploadedFile);
 * // Output: { document_name: "document.pdf", document_url: "https://firebase..." }
 */