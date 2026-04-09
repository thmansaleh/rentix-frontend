"use client";

import { useState } from "react";
import useSWR from "swr";
import { getCarById } from "../../services/api/cars";

export function useCarData({ isOpen, carId }) {
  const [activeTab, setActiveTab] = useState("basic");

  // Only fetch car data (includes photos & documents in the response)
  const { data: carResponse, isLoading: loading } = useSWR(
    isOpen && carId ? `car-${carId}` : null,
    () => getCarById(carId),
    { revalidateOnFocus: false }
  );

  const carData = carResponse?.data || null;

  // Accident modal state
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [isViewAccidentOpen, setIsViewAccidentOpen] = useState(false);
  const [isEditAccidentOpen, setIsEditAccidentOpen] = useState(false);
  const [isDeleteAccidentOpen, setIsDeleteAccidentOpen] = useState(false);

  // Contract modal state
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);

  return {
    loading,
    carData,
    activeTab,
    setActiveTab,
    // Accident modal state
    selectedAccidentId,
    setSelectedAccidentId,
    selectedAccident,
    setSelectedAccident,
    isViewAccidentOpen,
    setIsViewAccidentOpen,
    isEditAccidentOpen,
    setIsEditAccidentOpen,
    isDeleteAccidentOpen,
    setIsDeleteAccidentOpen,
    // Contract modal state
    isAddContractOpen,
    setIsAddContractOpen,
  };
}
