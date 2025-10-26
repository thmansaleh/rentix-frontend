
import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const createMemo = async (memoData) => {
  try {
    const files = await uploadFiles(memoData.files || []);

    const response = await api.post("/memos", { ...memoData, files });
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getMemos = async () => {
  try {
    const response = await api.get("/memos");
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getMemoById = async (memoId) => {
  try {
    const response = await api.get(`/memos/${memoId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getCaseMemos = async (caseId) => {
  try {
    const response = await api.get(`/memos/case/${caseId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const updateMemo = async (memoId, updatedData) => {
  try {
    const files = await uploadFiles(updatedData.files || []);
    const response = await api.put(`/memos/${memoId}`, { ...updatedData, files });
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const getActiveEmployeeMemos = async (employeeId) => {
  try {
    const response = await api.get(`/memos/employee/${employeeId}/active`);
    return response.data;
  } catch (error) {

    throw error;
  }
};


export const updateMemoApproval = async (id, approvalType, isApproved) => {
  try {
    const response = await api.patch(`/memos/${id}/approve`, { approvalType, isApproved });
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getActiveMemos = async () => {
  try {
    const response = await api.get("/memos/active");
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const deleteMemo = async (memoId) => {
  try {
    const response = await api.delete(`/memos/${memoId}`);
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const updateEmployeeMemoStatus = async (memoId, position, status) => {
  try {
    const response = await api.patch(`/memos/${memoId}/employee-status`, { position, status });
    return response.data;
  } catch (error) {

    throw error;
  }
};
