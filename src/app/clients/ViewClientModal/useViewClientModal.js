import { useState, useEffect } from "react";
import { getCustomerById } from "../../services/api/customers";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";

export function useViewClientModal({ isOpen, customerId, onClose }) {
  const { t } = useTranslations();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerDetails();
    }
  }, [isOpen, customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await getCustomerById(customerId);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error(t("clients.view.error"));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("clients.view.fields.na");
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    customer,
    loading,
    formatDate,
  };
}
