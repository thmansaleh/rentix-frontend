import api from "./axiosInstance";

export const getAllBranchSettings = async () => {
  const response = await api.get("/branch-settings");
  return response.data;
};

// Get settings for the current selected branch (auto from token)
export const getMyBranchSettings = async () => {
  const response = await api.get("/branch-settings/my");
  return response.data;
};

// Update settings for the current selected branch (auto from token)
export const updateMyBranchSettings = async (settingsData) => {
  const response = await api.put("/branch-settings/my", settingsData);
  return response.data;
};
