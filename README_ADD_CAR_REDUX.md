# Add Car Redux State Management

This document explains how to use the `addCarSlice` Redux state for managing the car addition form.

## Overview

The `addCarSlice` provides a centralized state management solution for the car addition form, handling all form fields, validation, and form state.

## Files Created

1. **`redux/slices/addCarSlice.js`** - Main Redux slice with all actions and state
2. **`hooks/useAddCarForm.js`** - Custom hook for easy access to form state and actions
3. **`components/BasicInfoSectionWithRedux.js`** - Example component using Redux directly
4. **`components/BasicInfoSectionSimplified.js`** - Example using the custom hook

## State Structure

```javascript
{
  // Basic Info
  plate_source: "",
  plate_number: "",
  make: "",
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
  insurance_expiry: null,
  
  // Safety & Comfort Specs
  safetySpecs: [],
  comfortSpecs: [],
  
  // Images
  carImages: [],
  
  // Form state
  isSubmitting: false,
  errors: {},
  currentTab: "info"
}
```

## Usage Options

### Option 1: Using the Custom Hook (Recommended)

```javascript
import { useAddCarForm } from "@/hooks/useAddCarForm";

export default function MyComponent() {
  const {
    // State values
    plate_number,
    make,
    model,
    errors,
    isSubmitting,
    
    // Generic handlers
    handleInputChange,
    handleSelectChange,
    
    // Grouped actions
    basicInfo: { setMake, setModel },
    utility: { resetForm },
    
    // Validation
    validateForm,
    isFormValid
  } = useAddCarForm();

  return (
    <div>
      <input
        name="plate_number"
        value={plate_number}
        onChange={handleInputChange}
      />
      
      <select
        value={make}
        onChange={(e) => handleSelectChange(e.target.value, 'make')}
      >
        <option value="">Select Make</option>
        {/* options */}
      </select>
      
      <button onClick={validateForm}>
        Submit
      </button>
    </div>
  );
}
```

### Option 2: Direct Redux Usage

```javascript
import { useSelector, useDispatch } from "react-redux";
import { setPlateNumber, setMake } from "@/redux/slices/addCarSlice";

export default function MyComponent() {
  const dispatch = useDispatch();
  const { plate_number, make, errors } = useSelector(state => state.addCar);

  return (
    <div>
      <input
        value={plate_number}
        onChange={(e) => dispatch(setPlateNumber(e.target.value))}
      />
      
      <input
        value={make}
        onChange={(e) => dispatch(setMake(e.target.value))}
      />
    </div>
  );
}
```

## Available Actions

### Basic Info Actions
- `setPlateSource(value)` - Set license plate source
- `setPlateNumber(value)` - Set license plate number  
- `setMake(value)` - Set car make/brand
- `setModel(value)` - Set car model
- `setYear(value)` - Set manufacturing year
- `setTransmissionType(value)` - Set transmission type
- `setFuelType(value)` - Set fuel type
- `setMileage(value)` - Set current mileage
- `setSeatingCapacity(value)` - Set seating capacity
- `setExteriorColor(value)` - Set exterior color
- `setInteriorColor(value)` - Set interior color
- `setDoorsCount(value)` - Set number of doors
- `updateBasicInfo(data)` - Bulk update basic info fields

### Pricing Actions
- `setDailyRate(value)` - Set daily rental rate
- `setWeeklyRate(value)` - Set weekly rental rate
- `setMonthlyRate(value)` - Set monthly rental rate
- `updatePricing(data)` - Bulk update pricing fields

### Purchase Info Actions
- `setPurchaseDate(date)` - Set purchase date
- `setPurchasePrice(value)` - Set purchase price
- `updatePurchaseInfo(data)` - Bulk update purchase info

### Maintenance & Insurance Actions
- `setLastMaintenanceDate(date)` - Set last maintenance date
- `setNextMaintenanceDate(date)` - Set next maintenance date
- `setInsuranceNumber(value)` - Set insurance policy number
- `setInsuranceCompany(value)` - Set insurance company
- `setInsuranceExpiry(date)` - Set insurance expiry date
- `updateMaintenanceInsurance(data)` - Bulk update maintenance/insurance

### Safety Specs Actions
- `setSafetySpecs(specs)` - Set all safety specifications
- `addSafetySpec(spec)` - Add a safety specification
- `removeSafetySpec(index)` - Remove safety spec by index
- `updateSafetySpec(index, value)` - Update existing safety spec

### Comfort Specs Actions
- `setComfortSpecs(specs)` - Set all comfort specifications
- `addComfortSpec(spec)` - Add a comfort specification
- `removeComfortSpec(index)` - Remove comfort spec by index
- `updateComfortSpec(index, value)` - Update existing comfort spec

### Image Actions
- `setCarImages(images)` - Set all car images
- `addCarImage(image)` - Add a car image
- `removeCarImage(index)` - Remove image by index

### Form State Actions
- `setIsSubmitting(boolean)` - Set submission state
- `setErrors(errors)` - Set form errors object
- `setFieldError(field, error)` - Set error for specific field
- `clearFieldError(field)` - Clear error for specific field
- `clearAllErrors()` - Clear all form errors
- `setCurrentTab(tab)` - Set active form tab

### Utility Actions
- `resetAddCarForm()` - Reset entire form to initial state
- `loadCarData(data)` - Load existing car data (for editing)

## Form Validation

The custom hook includes built-in validation:

```javascript
const { validateForm, isFormValid, errors } = useAddCarForm();

// Validate and get boolean result
const isValid = validateForm();

// Check if form is currently valid
const currentlyValid = isFormValid();

// Access validation errors
console.log(errors.plate_number); // "Plate number is required"
```

## Integration with Existing Components

To integrate with your existing components:

1. **Replace local state** with Redux state
2. **Replace setState calls** with Redux actions
3. **Add error display** from Redux errors state
4. **Use validation helpers** from the custom hook

## Example: Complete Form Submission

```javascript
const handleSubmit = async () => {
  const { validateForm, isSubmitting, formState, utility } = useAddCarForm();
  
  if (!validateForm()) {
    console.log('Validation failed');
    return;
  }

  formState.setIsSubmitting(true);
  
  try {
    // Get all form data
    const formData = useAddCarForm();
    
    // Submit to API
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        // exclude Redux-specific fields
        isSubmitting: undefined,
        errors: undefined,
        currentTab: undefined
      })
    });
    
    if (response.ok) {
      utility.resetForm();
      alert('Car added successfully!');
    }
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    formState.setIsSubmitting(false);
  }
};
```

## Benefits

1. **Centralized State** - All form data in one place
2. **Persistent State** - Data persists across tab switches
3. **Built-in Validation** - Form validation with error handling
4. **Easy Integration** - Custom hook simplifies component integration
5. **Type Safety** - Clear action types and state structure
6. **Scalable** - Easy to extend with new fields or features
7. **Debugging** - Redux DevTools support for state inspection

## Next Steps

1. Update your existing form components to use the Redux state
2. Replace local state management with the custom hook
3. Implement the API integration for form submission
4. Add any additional validation rules as needed
5. Consider adding optimistic updates for better UX
