"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCarById, getCarPhotos, getCarDocuments } from "../../services/api/cars";
import { getAccidentsByCarId } from "../../services/api/accidents";

export function useCarData({ isOpen, carId, t }) {
  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [accidents, setAccidents] = useState([]);

  // Accident modal state
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [isViewAccidentOpen, setIsViewAccidentOpen] = useState(false);
  const [isEditAccidentOpen, setIsEditAccidentOpen] = useState(false);
  const [isDeleteAccidentOpen, setIsDeleteAccidentOpen] = useState(false);

  useEffect(() => {
    if (isOpen && carId) {
      fetchCarData();
    }
  }, [isOpen, carId]);

  const fetchCarData = async () => {
    setLoading(true);
    try {
      const [carResponse, photosResponse, documentsResponse, accidentsResponse] = await Promise.all([
        getCarById(carId),
        getCarPhotos(carId),
        getCarDocuments(carId),
        getAccidentsByCarId(carId),
      ]);

      setCarData(carResponse.data);
      setPhotos(photosResponse.data || []);
      setDocuments(documentsResponse.data || []);
      setAccidents(accidentsResponse.data || []);
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

  return {
    loading,
    carData,
    setCarData,
    photos,
    documents,
    accidents,
    reloadAccidents,
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
  };
}
