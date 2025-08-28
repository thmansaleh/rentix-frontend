"use client"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTranslations } from "@/hooks/useTranslations"

function ButtonImagesSend() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false)
  const editCar = useSelector(state => state.editCar || {})

  const handleSendImagesInfo = async () => {
    setIsLoading(true)
    
    // Extract only ImageUploader data
    const imagesData = {
      carImages: editCar.carImages || []
    }

    try {
      // For images, we might need to handle file upload differently
      // This could be a FormData for actual file upload or just metadata
      const formData = new FormData()
      
      // Add image files to FormData
      if (editCar.carImages && editCar.carImages.length > 0) {
        editCar.carImages.forEach((image, index) => {
          if (image.file) {
            formData.append(`images`, image.file)
            formData.append(`imageData_${index}`, JSON.stringify({
              id: image.id,
              name: image.name,
              order: index + 1,
              isPrimary: index === 0
            }))
          }
        })
      }

      // Replace with your actual API endpoint
      const response = await fetch('/api/cars/update-images', {
        method: 'POST',
        body: formData // Using FormData for file upload
      })

      if (!response.ok) {
        throw new Error('Failed to send images data')
      }

      const result = await response.json()
      console.log('Images sent successfully:', result)
      
      // You can add a toast notification here if needed
      alert('Images sent successfully!')
      
    } catch (error) {
      console.error('Error sending images:', error)
      alert('Error sending images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      className="w-44 my-5 text-center"
      onClick={handleSendImagesInfo}
      disabled={isLoading}
    >
      {isLoading ? t('common.loading') || 'Sending...' : 'حفظ الصور'}
    </Button>
  )
}

export default ButtonImagesSend
