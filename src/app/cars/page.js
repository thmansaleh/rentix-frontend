"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Car, Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import { AddCarModal } from './AddCarModal';
import { ViewCarModal } from './ViewCarModal';
import { EditCarModal } from './EditCarModal';
import { DeleteCarModal } from './DeleteCarModal';
import { getCars, deleteCar } from '../services/api/cars';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useTranslations } from '@/hooks/useTranslations';

export default function CarsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // Fetch cars data
  const { data: carsData, error, isLoading, mutate } = useSWR('cars', getCars, {
    revalidateOnFocus: false,
  });

  const cars = carsData?.data || [];

  // Handle view car
  const handleViewCar = (carId) => {
    setSelectedCarId(carId);
    setIsViewModalOpen(true);
  };

  // Handle edit car
  const handleEditCar = (carId) => {
    setSelectedCarId(carId);
    setIsEditModalOpen(true);
  };

  // Handle delete car
  const handleDeleteCar = (car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      available: 'default',
      rented: 'secondary',
      maintenance: 'outline',
      sold: 'destructive',
    };
    return variants[status] || 'default';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      available: t('cars.statusAvailable'),
      rented: t('cars.statusRented'),
      maintenance: t('cars.statusMaintenance'),
      sold: t('cars.statusSold'),
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('cars.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('cars.description')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('cars.addNewCar')}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{t('cars.failedToLoad')}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('cars.noCarsFound')}
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('cars.addFirstCar')}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('cars.plateNumber')}</TableHead>
                  <TableHead>{t('cars.brand')}</TableHead>
                  <TableHead>{t('cars.model')}</TableHead>
                  <TableHead>{t('cars.year')}</TableHead>
                  <TableHead>{t('cars.color')}</TableHead>
                  <TableHead>{t('cars.status')}</TableHead>
                  <TableHead>{t('cars.dailyPrice')}</TableHead>
                  <TableHead>{t('cars.mileage')}</TableHead>
                  <TableHead className="text-right">{t('cars.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">
                      {car.plate_number}
                    </TableCell>
                    <TableCell>{car.brand || '-'}</TableCell>
                    <TableCell>{car.model || '-'}</TableCell>
                    <TableCell>{car.year || '-'}</TableCell>
                    <TableCell>
                      {car.color ? (
                        <Badge variant="outline">{car.color}</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(car.status)}>
                        {getStatusLabel(car.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {car.daily_price
                        ? `$${parseFloat(car.daily_price).toFixed(2)}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {car.mileage ? `${car.mileage.toLocaleString()} km` : '0 km'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t('cars.viewDetails')}
                          onClick={() => handleViewCar(car.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t('cars.editCar')}
                          onClick={() => handleEditCar(car.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t('cars.deleteCar')}
                          onClick={() => handleDeleteCar(car)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Stats Footer */}
        {cars.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{t('cars.totalCars')}: {cars.length}</span>
              <div className="flex items-center gap-4">
                <span>
                  {t('cars.available')}: {cars.filter((c) => c.status === 'available').length}
                </span>
                <span>
                  {t('cars.rented')}: {cars.filter((c) => c.status === 'rented').length}
                </span>
                <span>
                  {t('cars.maintenance')}: {cars.filter((c) => c.status === 'maintenance').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => mutate()}
      />

      {/* View Car Modal */}
      <ViewCarModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCarId(null);
        }}
        carId={selectedCarId}
      />

      {/* Edit Car Modal */}
      <EditCarModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCarId(null);
        }}
        onSuccess={() => mutate()}
        carId={selectedCarId}
      />

      {/* Delete Car Modal */}
      <DeleteCarModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCar(null);
        }}
        onSuccess={() => mutate()}
        car={selectedCar}
      />
    </div>
  );
}