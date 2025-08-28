"use client"
import React from "react";
import { Car, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "@/hooks/useTranslations";
import { useCarBrands } from "@/hooks/useCarBrands";
import { useEmirates, useFuelTypes } from "@/hooks/useApiData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDispatch, useSelector } from 'react-redux'
import {
  setPlateSource,
  setPlateNumber,
  setMake,
  setModel,
  setYear,
  setTransmissionType,
  setFuelType,
  setMileage,
  setSeatingCapacity,
  setExteriorColor,
  setInteriorColor,
  setDoorsCount,
} from '@/redux/slices/addCarSlice'

export default function BasicInfoSection() {
  const t = useTranslations();
  const { brands: carBrands, isLoading: brandsLoading, isError: brandsError } = useCarBrands();
  const { emirates, isLoading: emiratesLoading, isError: emiratesError } = useEmirates();
  const { fuelTypes, isLoading: fuelTypesLoading, isError: fuelTypesError } = useFuelTypes();
  
  const doorsCountOptions = [1, 2, 3, 4, 5, 6, 7];
  const seatingOptions = [2,3,4,5,6,7,8,9,10,11,12];
        const { isRTL, language } = useLanguage();

  const dispatch = useDispatch()
  const addCar = useSelector(state => state.addCar || {})


  return (
    <div className="  rounded-lg p-2">
      <h3 className="text-xl font-semibold mb-4  flex items-center gap-2">
        <Info className="w-5 h-5" />
        {t('cars.carAddForm.basicInfo.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 gap-y-12">
        <div className="space-y-2">
          <Label htmlFor="plate_source" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.plateSource')} *
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.plate_source || ""}
            onValueChange={(v) => dispatch(setPlateSource(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('cars.carAddForm.basicInfo.placeholders.selectEmirate')} />
            </SelectTrigger>
            <SelectContent dir={isRTL ? "rtl" : "ltr"}>
              {(emirates || []).map(emirate => (
                <SelectItem key={emirate.id} value={emirate.id}>
                  <div className={isRTL ? "px-6" : "text-left"}>
                    {language === 'ar' ? emirate.name_ar : emirate.name_en}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plate_number" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.plateNumber')} *
          </Label>
          <div className="relative">
            <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="plate_number"
              name="plate_number"
              placeholder={t('cars.carAddForm.basicInfo.placeholders.enterPlateNumber')}
              value={addCar.plate_number || ''}
              onChange={(e) => dispatch(setPlateNumber(e.target.value))}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.make')} *
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.make || ''}
            onValueChange={(v) => dispatch(setMake(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                brandsLoading 
                  ? t('common.loading') 
                  : brandsError 
                    ? t('common.error')
                    : t('cars.carAddForm.basicInfo.placeholders.selectMake')
              } />
            </SelectTrigger>
            <SelectContent>
              {(carBrands || []).map(brand => (
                // carBrands in add flow are simple strings
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.model')} *
          </Label>
          <Input
            id="model"
            name="model"
            placeholder={t('cars.carAddForm.basicInfo.placeholders.modelExample')}
            value={addCar.model || ''}
            onChange={(e) => dispatch(setModel(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.year')}
          </Label>
          <Input
            id="year"
            name="year"
            type="number"
            min="1990"
            max="2030"
            value={addCar.year || ''}
            onChange={(e) => dispatch(setYear(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission_type" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.transmission')}
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.transmission_type || ''}
            onValueChange={(v) => dispatch(setTransmissionType(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('cars.carAddForm.basicInfo.placeholders.selectTransmission')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="أوتوماتيك">{t('cars.carAddForm.basicInfo.options.transmission.automatic')}</SelectItem>
              <SelectItem value="يدوي">{t('cars.carAddForm.basicInfo.options.transmission.manual')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuel_type" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.fuelType')}
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.fuel_type || ''}
            onValueChange={(v) => dispatch(setFuelType(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('cars.carAddForm.basicInfo.placeholders.selectFuelType')} />
            </SelectTrigger>
            <SelectContent>
              {(fuelTypes || []).map(fuelType => (
                <SelectItem key={fuelType.id} value={fuelType.id}>
                  {language === 'ar' ? fuelType.name_ar : fuelType.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.mileage')}
          </Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            min="0"
            value={addCar.mileage || ''}
            onChange={(e) => dispatch(setMileage(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seating_capacity" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.seatingCapacity')}
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.seating_capacity || ''}
            onValueChange={(v) => dispatch(setSeatingCapacity(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('cars.carAddForm.basicInfo.placeholders.selectSeating')} />
            </SelectTrigger>
            <SelectContent>
              {seatingOptions.map(num => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="exterior_color" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.exteriorColor')}
          </Label>
          <Input
            id="exterior_color"
            name="exterior_color"
            placeholder={t('cars.carAddForm.basicInfo.placeholders.exteriorColorExample')}
            value={addCar.exterior_color || ''}
            onChange={(e) => dispatch(setExteriorColor(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interior_color" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.interiorColor')}
          </Label>
          <Input
            id="interior_color"
            name="interior_color"
            placeholder={t('cars.carAddForm.basicInfo.placeholders.interiorColorExample')}
            value={addCar.interior_color || ''}
            onChange={(e) => dispatch(setInteriorColor(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doors_count" className="text-sm font-medium ">
            {t('cars.carAddForm.basicInfo.doorsCount')}
          </Label>
          <Select
            dir={isRTL ? "rtl" : "ltr"}
            value={addCar.doors_count || ''}
            onValueChange={(v) => dispatch(setDoorsCount(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('cars.carAddForm.basicInfo.placeholders.selectDoors')} />
            </SelectTrigger>
            <SelectContent>
              {doorsCountOptions.map((num) => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}




