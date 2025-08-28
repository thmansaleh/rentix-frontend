'use client';
import {
  Car,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

function StateCards() {
  const tCars = useTranslations('cars');
  const tDashboard = useTranslations('dashboard');
  const { isRTL } = useLanguage();
  
  return (
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className=" text-sm">{tCars('stats.totalCars')}</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 blue:bg-blue-100 p-3 rounded-full">
                  <Car className="text-blue-600 dark:text-blue-400 blue:text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className=" text-sm">{tCars('stats.availableCars')}</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className=" text-sm">{tCars('stats.rentedCars')}</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-white">3</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Car className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className=" text-sm">{tCars('stats.maintenanceCars')}</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-white">5</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Settings className="text-yellow-600" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>  )
}

export default StateCards