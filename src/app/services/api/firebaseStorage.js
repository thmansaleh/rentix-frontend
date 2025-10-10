// Firebase configuration - Add your Firebase config here

const firebaseConfig = {
  apiKey: "AIzaSyAhkYhsAx1_D_inve1n8_P7uRH3DyyR_nU",
  authDomain: "mbh-backend-6219a.firebaseapp.com",
  projectId: "mbh-backend-6219a",
  storageBucket: "mbh-backend-6219a.firebasestorage.app",
  messagingSenderId: "239366713349",
  appId: "1:239366713349:web:8db8b5d5cd3c9c5ab1ac6c"
};
// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload files to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Folder path in storage (e.g., 'sessions')
 * @returns {Promise<{success: boolean, files: Array<{filename: string, url: string}>, error?: string}>}
 */
export const uploadFilesToFirebase = async (files, folder = 'sessions') => {
  try {
    if (!files || files.length === 0) {
      return { success: true, files: [] };
    }

    const uploadPromises = files.map(async (file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      const uniqueFilename = `${timestamp}_${randomString}.${extension}`;
      
      // Create storage reference
      const storageRef = ref(storage, `${folder}/${uniqueFilename}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        filename: file.name,
        url: downloadURL,
        path: `${folder}/${uniqueFilename}`
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    return {
      success: true,
      files: uploadResults
    };
  } catch (error) {
    console.error('Error uploading files to Firebase:', error);
    return {
      success: false,
      files: [],
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Upload a single file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in storage
 * @returns {Promise<{success: boolean, filename?: string, url?: string, error?: string}>}
 */
export const uploadFileToFirebase = async (file, folder = 'sessions') => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const result = await uploadFilesToFirebase([file], folder);
    
    if (result.success && result.files.length > 0) {
      return {
        success: true,
        filename: result.files[0].filename,
        url: result.files[0].url
      };
    } else {
      return {
        success: false,
        error: result.error || 'Upload failed'
      };
    }
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Delete files from Firebase Storage
 * @param {string[]} filePaths - Array of file paths to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFilesFromFirebase = async (filePaths) => {
  try {
    if (!filePaths || filePaths.length === 0) {
      return { success: true };
    }

    const deletePromises = filePaths.map(async (filePath) => {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    });

    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting files from Firebase:', error);
    return {
      success: false,
      error: error.message || 'Delete failed'
    };
  }
};