import { createSlice } from "@reduxjs/toolkit";

const addCarSlice = createSlice({
  name: "addCar",
  initialState: {
    // Basic Info
    plate_source: "",
    plate_number: "",
    make: "",
    brand_id: "",
    model: "",
    year: "",
    transmission_type: "",
    fuel_type: "",
    mileage: "",
    seating_capacity: "",
    exterior_color: "",
    interior_color: "",
    doors_count: "",
    
    // Pricing
    daily_rate: "",
    weekly_rate: "",
    monthly_rate: "",
    
    // Purchase Info
    purchase_date: null,
    purchase_price: "",
    
    // Maintenance & Insurance
    last_maintenance_date: null,
    next_maintenance_date: null,
    insurance_number: "",
    insurance_company: "",
    insurance_start_date: null,
    insurance_expiry: null,
    
    // Safety Specs
    safetySpecs: [
      { name_ar: "وسائد هوائية", name_en: "Airbags" },
      { name_ar: "نظام فرامل مانع للانغلاق (ABS)", name_en: "ABS (Anti-lock Braking System)" },
      { name_ar: "نظام التحكم بالثبات", name_en: "Stability Control" },
      { name_ar: "نظام التحكم بالجر", name_en: "Traction Control" },
      { name_ar: "كبح طارئ آلي", name_en: "Automatic Emergency Braking" },
      { name_ar: "تحذير التصادم الأمامي", name_en: "Forward Collision Warning" },
      { name_ar: "مراقبة النقطة العمياء", name_en: "Blind Spot Monitor" },
      { name_ar: "حساسات ركن", name_en: "Parking Sensors" },
      { name_ar: "كاميرا خلفية", name_en: "Rear Camera" },
      { name_ar: "نظام تثبيت السرعة التكيفي", name_en: "Adaptive Cruise Control" },
      { name_ar: "تنبيه المرور الخلفي", name_en: "Rear Cross Traffic Alert" },
      { name_ar: "قفل للأطفال", name_en: "Child Safety Locks" },
      { name_ar: "نظام تثبيت مقاعد الأطفال (ISOFIX)", name_en: "ISOFIX Child Seat Anchors" },
      { name_ar: "مراقبة ضغط الإطارات", name_en: "Tire Pressure Monitoring (TPMS)" },
      { name_ar: "نظام مساعدة صعود التلال", name_en: "Hill Start Assist" },
      { name_ar: "نظام استشعار التصادم الجانبي", name_en: "Side Collision Sensors" },
      { name_ar: "نظام منع السرقة", name_en: "Anti-theft Alarm" },
      { name_ar: "مفتاح تعطيل المحرك (Immobilizer)", name_en: "Immobilizer" },
      { name_ar: "نداء الطوارئ (eCall)", name_en: "Emergency Call (eCall)" },
      { name_ar: "مصابيح ضباب", name_en: "Fog Lights" },
    ],
    
    // Comfort Specs
    comfortSpecs: [
      { name_ar: "تكييف الهواء", name_en: "Air Conditioning" },
      { name_ar: "تدفئة المقاعد", name_en: "Heated Seats" },
      { name_ar: "نوافذ كهربائية", name_en: "Power Windows" },
      { name_ar: "نظام ملاحة", name_en: "Navigation System" },
      { name_ar: "بلوتوث", name_en: "Bluetooth" },
      { name_ar: "نظام تثبيت السرعة", name_en: "Cruise Control" },
      { name_ar: "دخول بدون مفتاح", name_en: "Keyless Entry" },
      { name_ar: "سقف شمسي", name_en: "Sunroof" },
      { name_ar: "مقاعد جلدية", name_en: "Leather Seats" },
      { name_ar: "حساسات ركن", name_en: "Parking Sensors" },
      { name_ar: "كاميرا خلفية", name_en: "Rear Camera" },
      { name_ar: "Apple CarPlay", name_en: "Apple CarPlay" },
      { name_ar: "Android Auto", name_en: "Android Auto" },
      { name_ar: "منافذ USB", name_en: "USB Ports" },
      { name_ar: "مكيف تلقائي", name_en: "Climate Control" },
      { name_ar: "عجلة قيادة قابلة للتعديل", name_en: "Adjustable Steering" },
      { name_ar: "مقاعد خلفية قابلة للطي", name_en: "Folding Rear Seats" },
      { name_ar: "تشغيل عن بُعد", name_en: "Remote Start" },
      { name_ar: "شحن لاسلكي", name_en: "Wireless Charging" },
      { name_ar: "إضاءة محيطية", name_en: "Ambient Lighting" },
    ],
    
    // Images
    carImages: [],
    
    errors: {},
    currentTab: "info"
  },
  reducers: {
    // Basic Info actions
    setPlateSource: (state, action) => {
      state.plate_source = action.payload;
    },
    setPlateNumber: (state, action) => {
      state.plate_number = action.payload;
    },
    setMake: (state, action) => {
      state.make = action.payload;
    },
    setBrandId: (state, action) => {
      state.brand_id = action.payload;
    },
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setTransmissionType: (state, action) => {
      state.transmission_type = action.payload;
    },
    setFuelType: (state, action) => {
      state.fuel_type = action.payload;
    },
    setMileage: (state, action) => {
      state.mileage = action.payload;
    },
    setSeatingCapacity: (state, action) => {
      state.seating_capacity = action.payload;
    },
    setExteriorColor: (state, action) => {
      state.exterior_color = action.payload;
    },
    setInteriorColor: (state, action) => {
      state.interior_color = action.payload;
    },
    setDoorsCount: (state, action) => {
      state.doors_count = action.payload;
    },
    
    // Pricing actions
    setDailyRate: (state, action) => {
      state.daily_rate = action.payload;
    },
    setWeeklyRate: (state, action) => {
      state.weekly_rate = action.payload;
    },
    setMonthlyRate: (state, action) => {
      state.monthly_rate = action.payload;
    },
    
    // Purchase Info actions
    setPurchaseDate: (state, action) => {
      state.purchase_date = action.payload;
    },
    setPurchasePrice: (state, action) => {
      state.purchase_price = action.payload;
    },
    
    // Maintenance & Insurance actions
    setLastMaintenanceDate: (state, action) => {
      state.last_maintenance_date = action.payload;
    },
    setNextMaintenanceDate: (state, action) => {
      state.next_maintenance_date = action.payload;
    },
    setInsuranceNumber: (state, action) => {
      state.insurance_number = action.payload;
    },
    setInsuranceCompany: (state, action) => {
      state.insurance_company = action.payload;
    },
    setInsuranceStartDate: (state, action) => {
      state.insurance_start_date = action.payload;
    },
    setInsuranceExpiry: (state, action) => {
      state.insurance_expiry = action.payload;
    },
    
    // Safety Specs actions
    setSafetySpecs: (state, action) => {
      state.safetySpecs = action.payload;
    },
    addSafetySpec: (state, action) => {
      state.safetySpecs.push(action.payload);
    },
    removeSafetySpec: (state, action) => {
      state.safetySpecs = state.safetySpecs.filter((_, index) => index !== action.payload);
    },
    updateSafetySpec: (state, action) => {
      const { index, value } = action.payload;
      if (state.safetySpecs[index] !== undefined) {
        state.safetySpecs[index] = value;
      }
    },
    
    // Comfort Specs actions
    setComfortSpecs: (state, action) => {
      state.comfortSpecs = action.payload;
    },
    addComfortSpec: (state, action) => {
      state.comfortSpecs.push(action.payload);
    },
    removeComfortSpec: (state, action) => {
      state.comfortSpecs = state.comfortSpecs.filter((_, index) => index !== action.payload);
    },
    updateComfortSpec: (state, action) => {
      const { index, value } = action.payload;
      if (state.comfortSpecs[index] !== undefined) {
        state.comfortSpecs[index] = value;
      }
    },
    
    // Image actions
    setCarImages: (state, action) => {
      const imgs = Array.isArray(action.payload) ? action.payload : [];
      // normalize orders and primary flag
      state.carImages = imgs.map((img, idx) => ({
        ...img,
        order: idx + 1,
        isPrimary: idx === 0
      }));
    },
    addCarImage: (state, action) => {
      const img = action.payload || {};
      const order = state.carImages.length + 1;
      state.carImages.push({
        ...img,
        order,
        isPrimary: state.carImages.length === 0
      });
    },
    removeCarImage: (state, action) => {
      // action.payload is expected to be the index to remove
      state.carImages = state.carImages
        .filter((_, index) => index !== action.payload)
        .map((img, idx) => ({ ...img, order: idx + 1, isPrimary: idx === 0 }));
    },
    
    // Form state actions
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setFieldError: (state, action) => {
      const { field, error } = action.payload;
      state.errors[field] = error;
    },
    clearFieldError: (state, action) => {
      delete state.errors[action.payload];
    },
    clearAllErrors: (state) => {
      state.errors = {};
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    
    // Bulk update actions
    updateBasicInfo: (state, action) => {
      const basicInfoFields = [
        'plate_source', 'plate_number', 'make', 'model', 'year',
        'transmission_type', 'fuel_type', 'mileage', 'seating_capacity',
        'exterior_color', 'interior_color', 'doors_count'
      ];
      
      basicInfoFields.forEach(field => {
        if (action.payload[field] !== undefined) {
          state[field] = action.payload[field];
        }
      });
    },
    
    updatePricing: (state, action) => {
      const pricingFields = ['daily_rate', 'weekly_rate', 'monthly_rate'];
      
      pricingFields.forEach(field => {
        if (action.payload[field] !== undefined) {
          state[field] = action.payload[field];
        }
      });
    },
    
    updatePurchaseInfo: (state, action) => {
      const purchaseFields = ['purchase_date', 'purchase_price'];
      
      purchaseFields.forEach(field => {
        if (action.payload[field] !== undefined) {
          state[field] = action.payload[field];
        }
      });
    },
    
    updateMaintenanceInsurance: (state, action) => {
      const maintenanceFields = [
        'last_maintenance_date', 'next_maintenance_date',
        'insurance_number', 'insurance_company', 'insurance_start_date', 'insurance_expiry'
      ];
      
      maintenanceFields.forEach(field => {
        if (action.payload[field] !== undefined) {
          state[field] = action.payload[field];
        }
      });
    },
    
    // Reset form
    resetAddCarForm: (state) => {
      return {
        ...addCarSlice.getInitialState(),
        currentTab: state.currentTab // Preserve current tab
      };
    },
    
    // Load car data (for editing)
    loadCarData: (state, action) => {
      const carData = action.payload;
      Object.keys(carData).forEach(key => {
        if (state[key] !== undefined) {
          state[key] = carData[key];
        }
      });
    }
  }
});

export const {
  // Basic Info
  setPlateSource,
  setPlateNumber,
  setMake,
  setBrandId,
  setModel,
  setYear,
  setTransmissionType,
  setFuelType,
  setMileage,
  setSeatingCapacity,
  setExteriorColor,
  setInteriorColor,
  setDoorsCount,
  
  // Pricing
  setDailyRate,
  setWeeklyRate,
  setMonthlyRate,
  
  // Purchase Info
  setPurchaseDate,
  setPurchasePrice,
  
  // Maintenance & Insurance
  setLastMaintenanceDate,
  setNextMaintenanceDate,
  setInsuranceNumber,
  setInsuranceCompany,
  setInsuranceStartDate,
  setInsuranceExpiry,
  
  // Safety Specs
  setSafetySpecs,
  addSafetySpec,
  removeSafetySpec,
  updateSafetySpec,
  
  // Comfort Specs
  setComfortSpecs,
  addComfortSpec,
  removeComfortSpec,
  updateComfortSpec,
  
  // Images
  setCarImages,
  addCarImage,
  removeCarImage,
  
  // Form State
  setIsSubmitting,
  setErrors,
  setFieldError,
  clearFieldError,
  clearAllErrors,
  setCurrentTab,
  
  // Bulk Updates
  updateBasicInfo,
  updatePricing,
  updatePurchaseInfo,
  updateMaintenanceInsurance,
  
  // Utility
  resetAddCarForm,
  loadCarData
} = addCarSlice.actions;

export default addCarSlice.reducer;
