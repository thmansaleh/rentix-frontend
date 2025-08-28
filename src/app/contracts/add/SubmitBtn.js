import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'

function SubmitBtn() {
  const contractData = useSelector((state) => state.addContract)
  const t = useTranslations('contracts.addForm.submit')
  const { language } = useLanguage()

  // Validation logic to check if all required data is complete
  const isFormValid = useMemo(() => {
    const requiredFields = [
      contractData.clientData, // Client must be selected
      contractData.vehicleData, // Vehicle must be selected
      contractData.startDate, // Start date is required
      contractData.endDate, // End date is required
      contractData.dayCount, // Day count is required
      contractData.pricePerDay, // Price per day is required
      contractData.pickUpTime, // Pickup time is required
      contractData.dropOffTime, // Drop-off time is required
      contractData.kmAtTheStart, // Starting mileage is required
      contractData.fuelLevelAtTheStart, // Starting fuel level is required
      contractData.allowKmPerDay, // Daily allowed km is required
      contractData.insuranceDeposit, // Insurance deposit is required
    ];

    // Check if all required fields are filled
    const allRequiredFieldsFilled = requiredFields.every(field => {
      if (typeof field === 'string') {
        return field.trim() !== '';
      }
      return field !== null && field !== undefined;
    });

    // Additional validations
    const hasValidDates = contractData.startDate && contractData.endDate && 
                         new Date(contractData.startDate) <= new Date(contractData.endDate);
    
    const hasValidNumbers = contractData.dayCount > 0 && 
                           contractData.pricePerDay > 0 && 
                           contractData.kmAtTheStart >= 0 &&
                           contractData.allowKmPerDay > 0 &&
                           contractData.insuranceDeposit >= 0;

    return allRequiredFieldsFilled && hasValidDates && hasValidNumbers;
  }, [contractData]);

  // Get missing fields for better user feedback
  const getMissingFields = () => {
    const missing = [];
    
    if (!contractData.clientData) missing.push(t('missingFields.client') || 'Client');
    if (!contractData.vehicleData) missing.push(t('missingFields.vehicle') || 'Vehicle');
    if (!contractData.startDate) missing.push(t('missingFields.startDate') || 'Start Date');
    if (!contractData.endDate) missing.push(t('missingFields.endDate') || 'End Date');
    if (!contractData.dayCount) missing.push(t('missingFields.dayCount') || 'Day Count');
    if (!contractData.pricePerDay) missing.push(t('missingFields.pricePerDay') || 'Price Per Day');
    if (!contractData.pickUpTime) missing.push(t('missingFields.pickUpTime') || 'Pickup Time');
    if (!contractData.dropOffTime) missing.push(t('missingFields.dropOffTime') || 'Drop-off Time');
    if (!contractData.kmAtTheStart) missing.push(t('missingFields.startingMileage') || 'Starting Mileage');
    if (!contractData.fuelLevelAtTheStart) missing.push(t('missingFields.startingFuelLevel') || 'Starting Fuel Level');
    if (!contractData.allowKmPerDay) missing.push(t('missingFields.dailyAllowedKM') || 'Daily Allowed KM');
    if (!contractData.insuranceDeposit && contractData.insuranceDeposit !== '0') missing.push(t('missingFields.insuranceDeposit') || 'Insurance Deposit');
    
    return missing;
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      const missingFields = getMissingFields();
      console.warn('Form is incomplete. Missing fields:', missingFields);
      const alertMessage = `${t('pleaseComplete') || 'Please fill in the following required fields'}:\n${missingFields.join(', ')}`;
      alert(alertMessage);
      return;
    }

    console.log('=== Complete Contract Data ===');
    console.log(JSON.stringify(contractData, null, 2));
    
    // Here you would typically submit the form
    console.log('Form is valid and ready for submission!');
  };

  return (
    <div className="flex items-center justify-center my-3 ">
      <Button 
        className={`cursor-pointer ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSubmit}
        disabled={!isFormValid}
        title={!isFormValid ? `${t('missing') || 'Missing'}: ${getMissingFields().join(', ')}` : (t('createContract') || 'Create Contract')}
      >
        {t('createContract') || 'انشاء عقد'}
      </Button>
      
     
    </div>
  )
}

export default SubmitBtn