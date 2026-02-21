"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCarById, getCarPhotos, getCarDocuments } from "../../services/api/cars";
import { getAccidentsByCarId } from "../../services/api/accidents";
import { getContractsByCarId } from "../../services/api/contracts";

export function useCarData({ isOpen, carId, t }) {
  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [contracts, setContracts] = useState([]);

  // Accident modal state
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [isViewAccidentOpen, setIsViewAccidentOpen] = useState(false);
  const [isEditAccidentOpen, setIsEditAccidentOpen] = useState(false);
  const [isDeleteAccidentOpen, setIsDeleteAccidentOpen] = useState(false);

  // Contract modal state
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [isViewContractOpen, setIsViewContractOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);

  useEffect(() => {
    if (isOpen && carId) {
      fetchCarData();
    }
  }, [isOpen, carId]);

  const fetchCarData = async () => {
    setLoading(true);
    try {
      const [carResponse, photosResponse, documentsResponse, accidentsResponse, contractsResponse] = await Promise.all([
        getCarById(carId),
        getCarPhotos(carId),
        getCarDocuments(carId),
        getAccidentsByCarId(carId),
        getContractsByCarId(carId),
      ]);

      setCarData(carResponse.data);
      setPhotos(photosResponse.data || []);
      setDocuments(documentsResponse.data || []);
      setAccidents(accidentsResponse.data || []);
      setContracts(contractsResponse.data || []);
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast.error(t("cars.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const reloadAccidents = async () => {
    try {
      const accidentsResponse = await getAccidentsByCarId(carId);
      setAccidents(accidentsResponse.data || []);
    } catch (error) {
      console.error("Error reloading accidents:", error);
    }
  };

  const reloadContracts = async () => {
    try {
      const contractsResponse = await getContractsByCarId(carId);
      setContracts(contractsResponse.data || []);
    } catch (error) {
      console.error("Error reloading contracts:", error);
    }
  };

  return {
    loading,
    carData,
    setCarData,
    photos,
    documents,
    accidents,
    reloadAccidents,
    contracts,
    reloadContracts,
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
    selectedContractId,
    setSelectedContractId,
    isViewContractOpen,
    setIsViewContractOpen,
    isEditContractOpen,
    setIsEditContractOpen,
    isAddContractOpen,
    setIsAddContractOpen,
  };
}
