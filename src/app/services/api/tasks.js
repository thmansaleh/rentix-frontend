import { uploadFiles } from "../../../../utils/fileUpload";
import api from "./axiosInstance";

export const createTask = async (taskData) => {
  try {
    const files = await uploadFiles(taskData.files || []);

    const response = await api.post("/tasks", { ...taskData, files });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getAssignedToTasks = async (employeeId) => {
  try {
    
    const response = await api.get(`/tasks/assigned-to/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks assigned to employee:", error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const files = await uploadFiles(updatedData.files || []);
    const response = await api.put(`/tasks/${taskId}`, { ...updatedData, files });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getCaseTasks = async (caseId) => {
  try {
    const response = await api.get(`/tasks/case-tasks/${caseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching case tasks:", error);
    throw error;
  }
};
 export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};
