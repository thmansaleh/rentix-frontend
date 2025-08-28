"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonInfoSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendBasicInfo = async () => {
    setIsLoading(true)
    
    // Extract only BasicInfoSection data
    const basicInfoData = {
      plate_source: editCar.plate_source,
      plate_number: editCar.plate_number,
      brand_id: editCar.brand_id,
      model: editCar.model,
      year: editCar.year,
      transmission_type: editCar.transmission_type,
      fuel_type: editCar.fuel_type,
      mileage: editCar.mileage,
      seating_capacity: editCar.seating_capacity,
      exterior_color: editCar.exterior_color,
      interior_color: editCar.interior_color,
      doors_count: editCar.doors_count
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicInfoData)
      })

      if (!response.ok) {
        throw new Error('Failed to send basic info data')
      }

      const result = await response.json()
      console.log('Basic info sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Basic info sent successfully!')
      
    } catch (error) {
      console.error('Error sending basic info:', error)
      alert('Error sending basic info. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-44 my-5 text-center "
      onClick={handleSendBasicInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ التعديلات'}
      
    </Button>
  )
}

export default ButtonInfoSend