import api from "./axiosInstance";

// Get current working hours
export const getWorkingHours = async () => {
  const response = await api.get("/work-hours");
  return response.data;
};

// Update working hours
export const updateWorkingHours = async (workingHoursData) => {
  const response = await api.put("/work-hours", workingHoursData);
  return response.data;
};