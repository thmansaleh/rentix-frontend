"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonSafetySend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendSafetyInfo = async () => {
    setIsLoading(true)
    
    // Extract only SafetySpecsSection data
    const safetyData = {
      safetySpecs: editCar.safetySpecs || []
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-safety', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(safetyData)
      })

      if (!response.ok) {
        throw new Error('Failed to send safety specs data')
      }

      const result = await response.json()
      console.log('Safety specs sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Safety specs sent successfully!')
      
    } catch (error) {
      console.error('Error sending safety specs:', error)
      alert('Error sending safety specs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendSafetyInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ مواصفات الأمان'}
    </Button>
  )
}

export default ButtonSafetySend
