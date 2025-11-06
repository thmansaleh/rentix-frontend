import axiosInstance from "./axiosInstance";

export const getDepositsByPartyId = async (partyId) => {
  try {
    const response = await axiosInstance.get(`/clients-deposits/party/${partyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deposits:", error);
    throw error;
  }
};

export const createDeposit = async (depositData) => {
  try {
    const response = await axiosInstance.post("/clients-deposits", depositData);
    return response.data;
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw error;
  }
};

export const updateDeposit = async (depositId, depositData) => {
  try {
    const response = await axiosInstance.put(`/clients-deposits/${depositId}`, depositData);
    return response.data;
  } catch (error) {
    console.error("Error updating deposit:", error);
    throw error;
  }
};

export const deleteDeposit = async (depositId) => {
  try {
    const response = await axiosInstance.delete(`/clients-deposits/${depositId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting deposit:", error);
    throw error;
  }
};
