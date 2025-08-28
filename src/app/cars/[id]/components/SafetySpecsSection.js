"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSelector, useDispatch } from 'react-redux'
import { addSafetySpec, removeSafetySpec } from '@/redux/slices/editCarSlice'
import ButtonSafetySend from './send-buttons/ButtonSafetySend'

export default function SafetySpecsSection() {

  const t = useTranslations();
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  const specs = useSelector(state => state.editCar?.safetySpecs || [])

  const [newAr, setNewAr] = useState('')
  const [newEn, setNewEn] = useState('')

  const handleAddSpec = () => {
    // Check if at least one field has content
    if (!newAr.trim() && !newEn.trim()) {
      console.log('No content to add');
      return;
    }
    
    const newSpec = { 
      name_ar: newAr.trim() || newEn.trim(), 
      name_en: newEn.trim() || newAr.trim() 
    };
    
    console.log('Adding spec:', newSpec);
    console.log('Current specs count:', specs.length);
    
    // Add the new spec
    dispatch(addSafetySpec(newSpec));
    
    // Clear the inputs
    setNewAr('');
    setNewEn('');
  };

  const handleRemoveSpec = (index) => {
    console.log('Removing spec at index:', index);
    console.log('Current specs count:', specs.length);
    console.log('Spec to remove:', specs[index]);
    dispatch(removeSafetySpec(index));
  };

  return (
    <div className="rounded-lg p-2">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {t('cars.carAddForm.safety.title')}
      </h3>
      <div className="space-y-2 mb-4">
        {specs.length === 0 ? (
          <div className="text-gray-500 text-sm">{t('cars.carAddForm.safety.noSpecs')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-orange-100  rounded px-2 py-1"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl text-gray-400">•</span>
                  <span className="">{isRTL ? spec.name_ar : spec.name_en}</span>
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-2 cursor-pointer"
                    >
                      {t('cars.carAddForm.safety.deleteButton')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader >
                      <AlertDialogTitle className='text-right'>{t('cars.carAddForm.safety.deleteButton')}</AlertDialogTitle>
                      <AlertDialogDescription className='text-right'>
                        {t('common.confirmDelete') || 'Are you sure you want to delete this item?'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
                      <AlertDialogAction className='bg-red-500 text-white' onClick={() => handleRemoveSpec(idx)}>{t('buttons.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-x-3">
        <Input
          dir={isRTL ? 'rtl' : 'ltr'}
          placeholder={t('cars.carAddForm.safety.addPlaceholderAr')}
          value={newAr}
          onChange={(e) => setNewAr(e.target.value)}
        />
        <Input
          dir={isRTL ? 'rtl' : 'ltr'}
          placeholder={t('cars.carAddForm.safety.addPlaceholderEn')}
          value={newEn}
          onChange={(e) => setNewEn(e.target.value)}
        />
        <Button type="button" onClick={handleAddSpec}>
          {t('cars.carAddForm.safety.addButton')}
        </Button>
      </div>
      <ButtonSafetySend />
    </div>
  );
}

