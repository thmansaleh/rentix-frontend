"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonPurchaseSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendPurchaseInfo = async () => {
    setIsLoading(true)
    
    // Extract only PurchaseInfoSection data
    const purchaseData = {
      purchase_date: editCar.purchase_date,
      purchase_price: editCar.purchase_price
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData)
      })

      if (!response.ok) {
        throw new Error('Failed to send purchase data')
      }

      const result = await response.json()
      console.log('Purchase info sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Purchase info sent successfully!')
      
    } catch (error) {
      console.error('Error sending purchase info:', error)
      alert('Error sending purchase info. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendPurchaseInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ معلومات الشراء'}
    </Button>
  )
}

export default ButtonPurchaseSend
