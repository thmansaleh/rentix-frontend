"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonPricingSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendPricingInfo = async () => {
    setIsLoading(true)
    
    // Extract only PricingSection data
    const pricingData = {
      daily_rate: editCar.daily_rate,
      weekly_rate: editCar.weekly_rate,
      monthly_rate: editCar.monthly_rate
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingData)
      })

      if (!response.ok) {
        throw new Error('Failed to send pricing data')
      }

      const result = await response.json()
      console.log('Pricing info sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Pricing info sent successfully!')
      
    } catch (error) {
      console.error('Error sending pricing info:', error)
      alert('Error sending pricing info. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendPricingInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ الأسعار'}
    </Button>
  )
}

export default ButtonPricingSend
