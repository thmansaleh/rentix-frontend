'use client'
import React, { useState } from "react";
import { Shield, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector, useDispatch } from 'react-redux'
import { setPurchaseDate, setPurchasePrice } from '@/redux/slices/addCarSlice'


export default function PurchaseInfoSection() {
  const t = useTranslations();
  const dispatch = useDispatch()
  const addCar = useSelector(state => state.addCar || {})
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
        <Shield className="w-5 h-5" />
        {t('cars.carAddForm.purchase.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase_date" className="text-sm font-medium ">
            {t('cars.carAddForm.purchase.purchaseDate')}
          </Label>
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  <span className="ml-2">{formatDate(addCar.purchase_date) || t('cars.carAddForm.purchase.selectDate')}</span>
                </Button>
              </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                  selected={addCar.purchase_date ? new Date(addCar.purchase_date) : undefined}
                  onSelect={(date) => dispatch(setPurchaseDate(date ? date.toISOString() : null))}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchase_price" className="text-sm font-medium ">
            {t('cars.carAddForm.purchase.purchasePrice')}
          </Label>
          <Input
            id="purchase_price"
            name="purchase_price"
            type="number"
            min="0"
            step="0.01"
            className="pl-10"
            value={addCar.purchase_price || ''}
            onChange={(e) => dispatch(setPurchasePrice(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}


