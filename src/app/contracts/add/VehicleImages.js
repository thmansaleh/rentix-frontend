'use client'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslations } from '@/hooks/useTranslations'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { setCarImages } from '../../../redux/slices/addContractSlice'

function VehicleImages() {
  const dispatch = useDispatch()
  const contractData = useSelector((state) => state.addContract)
  const { carImages } = contractData
  
  const t = useTranslations('contracts.vehicleImages');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxImages = 6;
    const remainingSlots = maxImages - carImages.length;
    
    if (remainingSlots <= 0) {
      alert(t('maxImagesReached'));
      event.target.value = '';
      return;
    }
    
    const filesToProcess = files.slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          };
          
          dispatch(setCarImages([...carImages, newImage]));
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    event.target.value = '';
  };

  const removeImage = (imageId) => {
    const updatedImages = carImages.filter(img => img.id !== imageId);
    dispatch(setCarImages(updatedImages));
  };

  const clearAllImages = () => {
    dispatch(setCarImages([]));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {carImages.length < 6 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <Label 
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm ">
                {t('uploadText')}
              </span>
              <span className="text-xs text-gray-500">
                {t('maxImagesLimit', { current: carImages.length, max: 6 })}
              </span>
              <Button variant="outline" type="button">
                {t('selectFiles')}
              </Button>
            </Label>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
            <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <span className="text-sm text-gray-500">
              {t('maxImagesReached')}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {t('removeToAddMore')}
            </p>
          </div>
        )}

        {/* Images Grid */}
        {carImages.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {t('uploadedImages')} ({carImages.length}/6)
              </h3>
              {carImages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllImages}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('clearAll') || 'Clear All'}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {carImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Remove button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  {/* Image info */}
                  <div className="mt-2 text-xs space-y-1">
                    <p className="truncate font-medium" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-gray-500">{formatFileSize(image.size)}</p>
                    {image.uploadedAt && (
                      <p className="text-gray-400">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>• {t('instruction1')}</p>
          <p>• {t('instruction2')}</p>
          <p>• {t('instruction3')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default VehicleImages;
