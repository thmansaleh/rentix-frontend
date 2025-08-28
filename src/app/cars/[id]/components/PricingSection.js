'use client'
import React, { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector, useDispatch } from 'react-redux'
import { setDailyRate, setWeeklyRate, setMonthlyRate } from '@/redux/slices/editCarSlice'
import ButtonPricingSend from './send-buttons/ButtonPricingSend'

export default function PricingSection() {
  const t = useTranslations();
  const dispatch = useDispatch()
  const pricing = useSelector(state => state.editCar || {})
  


  return (
    <div className="  rounded-lg p-2 x">
      <h3 className="text-xl font-semibold mb-4  flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        {t('cars.carAddForm.pricing.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
      
        <div className="space-y-2">
          <Label htmlFor="daily_rate" className="text-sm font-medium ">
            {t('cars.carAddForm.pricing.dailyRate')}
          </Label>
          <Input
            id="daily_rate"
            name="daily_rate"
            type="number"
            min="0"
            step="0.01"
            className="pl-10"
            value={pricing.daily_rate || ''}
            onChange={(e) => dispatch(setDailyRate(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekly_rate" className="text-sm font-medium ">
            {t('cars.carAddForm.pricing.weeklyRate')}
          </Label>
          <Input
            id="weekly_rate"
            name="weekly_rate"
            type="number"
            min="0"
            step="0.01"
            className="pl-10"
            value={pricing.weekly_rate || ''}
            onChange={(e) => dispatch(setWeeklyRate(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_rate" className="text-sm font-medium ">
            {t('cars.carAddForm.pricing.monthlyRate')}
          </Label>
          <Input
            id="monthly_rate"
            name="monthly_rate"
            type="number"
            min="0"
            step="0.01"
            className="pl-10"
            value={pricing.monthly_rate || ''}
            onChange={(e) => dispatch(setMonthlyRate(e.target.value))}
          />
        </div>
      </div>
      <ButtonPricingSend />
    </div>
  );
}


