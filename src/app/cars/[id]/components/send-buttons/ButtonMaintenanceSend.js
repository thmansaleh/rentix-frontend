"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonMaintenanceSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendMaintenanceInfo = async () => {
    setIsLoading(true)
    
    // Extract only MaintenanceInsuranceSection data
    const maintenanceData = {
      last_maintenance_date: editCar.last_maintenance_date,
      next_maintenance_date: editCar.next_maintenance_date,
      insurance_number: editCar.insurance_number,
      insurance_company: editCar.insurance_company,
      insurance_expiry: editCar.insurance_expiry
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceData)
      })

      if (!response.ok) {
        throw new Error('Failed to send maintenance data')
      }

      const result = await response.json()
      console.log('Maintenance info sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Maintenance info sent successfully!')
      
    } catch (error) {
      console.error('Error sending maintenance info:', error)
      alert('Error sending maintenance info. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendMaintenanceInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ الصيانة والتأمين'}
    </Button>
  )
}

export default ButtonMaintenanceSend
