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
import { useSelector, useDispatch } from "react-redux";
import { addComfortSpec, removeComfortSpec } from '@/redux/slices/addCarSlice'

export default function ComfortSpecsSection() {
  const t = useTranslations();
  const {isRTL} = useLanguage();
  const dispatch = useDispatch();
  const specs = useSelector(state => state.addCar?.comfortSpecs || []);

  const [newAr, setNewAr] = useState('');
  const [newEn, setNewEn] = useState('');



  return (
    <div className="rounded-lg p-2">
      <h3 className="text-xl font-semibold mb-4 ">{t('cars.carAddForm.comfort.title')}</h3>
      <div className="space-y-2 mb-4">
        {specs.length === 0 ? (
          <div className="text-gray-500 text-sm">{t('cars.carAddForm.comfort.noSpecs')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                <span className="flex items-center gap-2">
                  <span className="text-xl ">•</span>
                  <span className="">{isRTL ? spec.name_ar : spec.name_en}</span>
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                    >
                      {t('cars.carAddForm.comfort.deleteButton')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('common.confirmDeleteMessage')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('buttons.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => dispatch(removeComfortSpec(idx))}>{t('buttons.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-3 ">
        <div className="flex-1 flex gap-x-3">
        <Input
          dir={isRTL ? "rtl" : "ltr"}
          placeholder={t('cars.carAddForm.comfort.addPlaceholderAr')}
          value={newAr}
          onChange={(e) => setNewAr(e.target.value)}
        />
        <Input
          dir={isRTL ? "rtl" : "ltr"}
          placeholder={t('cars.carAddForm.comfort.addPlaceholderEn')}
          value={newEn}
          onChange={(e) => setNewEn(e.target.value)}
        />
          </div>
        <Button type="button" onClick={() => {
          if (!newAr.trim() && !newEn.trim()) return;
          dispatch(addComfortSpec({ name_ar: newAr || newEn, name_en: newEn || newAr }));
          setNewAr(''); setNewEn('');
        }}>
          {t('cars.carAddForm.comfort.addButton')}
        </Button>
      </div>
    </div>
  );
}

