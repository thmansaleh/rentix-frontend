import api from "./axiosInstance";

// Get attendance records for an employee
export const getEmployeeAttendance = async (employeeId) => {
  const response = await api.get(`/employee-attendance/${employeeId}`);
  return response.data;
};

// Create new attendance record
export const createAttendance = async (attendanceData) => {
  const response = await api.post("/employee-attendance", attendanceData);
  return response.data;
};

// Update attendance record
export const updateAttendance = async (id, attendanceData) => {
  const response = await api.put(`/employee-attendance/${id}`, attendanceData);
  return response.data;
};

// Delete attendance record
export const deleteAttendance = async (id) => {
  const response = await api.delete(`/employee-attendance/${id}`);
  return response.data;
};
