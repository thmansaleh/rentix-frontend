'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Car,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Settings,
  XCircle,
  MoreHorizontal,
  Info,        // Add for "تفاصيل"
  CalendarPlus,// Add for "حجز"
  Pencil,      // Add for "تعديل"
  Trash2       // Add for "حذف"
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CarRow from './CarRow';
import PageHeader from '@/components/PageHeader';
import StateCards from './StateCards';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch cars data');
  }
  return response.json();
};

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  rented: 'bg-blue-100 text-blue-800 border-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  unavailable: 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
  available: CheckCircle,
  rented: Car,
  maintenance: Settings,
  unavailable: XCircle
};

const statusLabels = {
  available: 'متاح',
  rented: 'مؤجر',
  maintenance: 'صيانة',
  unavailable: 'غير متاح'
};

const categoryLabels = {
  sedan: 'سيدان',
  suv: 'دفع رباعي',
  luxury: 'فاخرة',
  compact: 'مدمجة',
  coupe: 'كوبيه'
};

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const router = useRouter();
  const t = useTranslations();
  const tCars = useTranslations('cars');
  const tForms = useTranslations('forms');
  const { isRTL } = useLanguage();

  // Use SWR for data fetching
  const { data: cars, error, isLoading, mutate } = useSWR('/api/cars.json', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000
  });

  const filteredCars = cars ? cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || car.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

 

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-background p-4 md:p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <PageHeader 
                title={tCars('title')}
                description={tCars('description')}
              >
                <Button
                  onClick={() => router.push('/cars/add')}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus size={20} />
                  {tCars('addNew')}
                </Button>
              </PageHeader>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <StateCards/>

          {/* Loading State */}
          {isLoading && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Loading cars...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center text-red-600">
                <p>Error: {error.message}</p>
                <Button 
                  onClick={() => mutate()} 
                  className="mt-2"
                  variant="outline"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Filters - Only show when not loading */}
          {!isLoading && !error && (
            <Card className="mb-6">
              <CardContent className="p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
                  <Input
                    type="text"
                    placeholder={tCars('searchPlaceholder')}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <Select dir={isRTL ? "rtl" : "ltr"} value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder={tCars('allStatuses')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tCars('allStatuses')}</SelectItem>
                      <SelectItem value="available">{tCars('available')}</SelectItem>
                      <SelectItem value="rented">{tCars('rented')}</SelectItem>
                      <SelectItem value="maintenance">{tCars('maintenance')}</SelectItem>
                      <SelectItem value="unavailable">{tCars('unavailable')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select dir={isRTL ? "rtl" : "ltr"} value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder={tCars('allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tCars('allCategories')}</SelectItem>
                      <SelectItem value="sedan">{tCars('categories.sedan')}</SelectItem>
                      <SelectItem value="suv">{tCars('categories.suv')}</SelectItem>
                      <SelectItem value="luxury">{tCars('categories.luxury')}</SelectItem>
                      <SelectItem value="compact">{tCars('categories.compact')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cars List - Only show when not loading */}
          {!isLoading && !error && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-right">
                    <thead className=" border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.make')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.model')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.year')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.color')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.plateNumber')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.category')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.status')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.dailyRate')}</th>
                        <th className="px-4 py-3 font-semibold ">{tCars('tableHeaders.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                          <CarRow
                            key={car.id}
                            car={car}
                            router={router}
                            statusIcons={statusIcons}
                            statusColors={statusColors}
                            statusLabels={statusLabels}
                            categoryLabels={categoryLabels}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center py-8 ">
                            {tCars('noResults')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}