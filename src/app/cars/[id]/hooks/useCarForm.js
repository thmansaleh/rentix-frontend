'use client'
import { useState } from 'react';

const initialFormState = {
  plate_number: "",
  make: "",
  model: "",
  year: 2024,
  color: "",
  transmission_type: "أوتوماتيك",
  fuel_type: "بنزين",
  mileage: 0,
  seating_capacity: 5,
  daily_rate: 0,
  hourly_rate: 0,
  weekly_rate: 0,
  monthly_rate: 0,
  status: "available",
  last_maintenance_date: null,
  next_maintenance_date: null,
  purchase_date: null,
  purchase_price: 0,
  insurance_number: "",
  insurance_expiry: null,
  features: [],
  features_input: "",
  description: ""
};

export function useCarForm() {
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleDateChange = (date, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSelectChange = (value, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeaturesChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      features_input: value,
      features: value.split(',').map(f => f.trim()).filter(Boolean)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("تمت إضافة السيارة بنجاح!");
      setForm(initialFormState);
    } catch (error) {
      alert("حدث خطأ أثناء إضافة السيارة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-GB') : "اختر التاريخ";
  };

  return {
    form,
    isSubmitting,
    handleChange,
    handleDateChange,
    handleSelectChange,
    handleFeaturesChange,
    handleSubmit,
    formatDate
  };
}
