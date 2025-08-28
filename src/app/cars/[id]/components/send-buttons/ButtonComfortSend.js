"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonComfortSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendComfortInfo = async () => {
    setIsLoading(true)
    
    // Extract only ComfortSpecsSection data
    const comfortData = {
      comfortSpecs: editCar.comfortSpecs || []
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-comfort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comfortData)
      })

      if (!response.ok) {
        throw new Error('Failed to send comfort specs data')
      }

      const result = await response.json()
      console.log('Comfort specs sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Comfort specs sent successfully!')
      
    } catch (error) {
      console.error('Error sending comfort specs:', error)
      alert('Error sending comfort specs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendComfortInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ مواصفات الراحة'}
    </Button>
  )
}

export default ButtonComfortSend
