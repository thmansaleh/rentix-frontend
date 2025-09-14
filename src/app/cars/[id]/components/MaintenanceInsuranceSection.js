'use client'
import React, { useState } from "react";
import { Wrench, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector, useDispatch } from 'react-redux'
import {
  setLastMaintenanceDate,
  setNextMaintenanceDate,
  setInsuranceNumber,
  setInsuranceCompany,
  setInsuranceStartDate,
  setInsuranceExpiry
} from '@/redux/slices/editCarSlice'
import ButtonMaintenanceSend from './send-buttons/ButtonMaintenanceSend'



export default function MaintenanceInsuranceSection() {
  const t = useTranslations();
  
  const dispatch = useDispatch()
  const editCar = useSelector(state => state.editCar || {})
  const formatDate = (iso) => {
    try {
      return iso ? new Date(iso).toLocaleDateString() : null
    } catch (e) {
      return null
    }
  }
 
  return (
    <div className="  rounded-lg p-2">
      <h3 className="text-xl font-semibold mb-4  flex items-center gap-2">
        <Wrench className="w-5 h-5" />
        {t('cars.carAddForm.maintenance.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4">
        <div className="space-y-2">
          <Label htmlFor="last_maintenance_date" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.lastMaintenanceDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                <span className="ml-2">{formatDate(editCar.last_maintenance_date) || t('cars.carAddForm.maintenance.selectDate')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editCar.last_maintenance_date ? new Date(editCar.last_maintenance_date) : undefined}
                onSelect={(date) => dispatch(setLastMaintenanceDate(date ? date.toISOString() : null))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="next_maintenance_date" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.nextMaintenanceDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                <span className="ml-2">{formatDate(editCar.next_maintenance_date) || t('cars.carAddForm.maintenance.selectDate')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editCar.next_maintenance_date ? new Date(editCar.next_maintenance_date) : undefined}
                onSelect={(date) => dispatch(setNextMaintenanceDate(date ? date.toISOString() : null))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance_number" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.insuranceNumber')}
          </Label>
          <Input
            id="insurance_number"
            name="insurance_number"
            placeholder={t('cars.carAddForm.maintenance.insuranceNumberPlaceholder')}
            className="pl-10"
            value={editCar.insurance_number || ''}
            onChange={(e) => dispatch(setInsuranceNumber(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance_company" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.insuranceCompany')}
          </Label>
          <Input
            id="insurance_company"
            name="insurance_company"
            placeholder={t('cars.carAddForm.maintenance.insuranceCompanyPlaceholder')}
            value={editCar.insurance_company || ''}
            onChange={(e) => dispatch(setInsuranceCompany(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance_start_date" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.insuranceStartDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                <span className="ml-2">{formatDate(editCar.insurance_start_date) || t('cars.carAddForm.maintenance.selectDate')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editCar.insurance_start_date ? new Date(editCar.insurance_start_date) : undefined}
                onSelect={(date) => dispatch(setInsuranceStartDate(date ? date.toISOString() : null))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance_expiry" className="text-sm font-medium ">
            {t('cars.carAddForm.maintenance.insuranceExpiry')}
          </Label>
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  <span className="ml-2">{formatDate(editCar.insurance_expiry) || t('cars.carAddForm.maintenance.selectDate')}</span>
                </Button>
              </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editCar.insurance_expiry ? new Date(editCar.insurance_expiry) : undefined}
                onSelect={(date) => dispatch(setInsuranceExpiry(date ? date.toISOString() : null))}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ButtonMaintenanceSend />
    </div>
  );
}


