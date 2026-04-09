"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus, Car, Loader2, Eye, Edit, Trash2,
  CheckCircle2, KeyRound, Wrench, LayoutGrid,
  FileText,
} from 'lucide-react';
import { AddCarModal } from './AddCarModal';
import { AddContractModal } from '../contracts/AddContractModal';
import { ViewCarModal } from './ViewCarModal';
import { EditCarModal } from './EditCarModal';
import { DeleteCarModal } from './DeleteCarModal';
import { getCars } from '../services/api/cars';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { key: 'all',         labelKey: 'cars.filterAll',         icon: LayoutGrid,   color: 'text-gray-600',   activeBg: 'bg-gray-900 dark:bg-gray-100',    activeText: 'text-white dark:text-gray-900',  pillBg: 'bg-gray-100 dark:bg-gray-800' },
  { key: 'available',   labelKey: 'cars.filterAvailable',   icon: CheckCircle2, color: 'text-emerald-600', activeBg: 'bg-emerald-600',                  activeText: 'text-white',                     pillBg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { key: 'rented',      labelKey: 'cars.filterRented',      icon: KeyRound,     color: 'text-blue-600',   activeBg: 'bg-blue-600',                     activeText: 'text-white',                     pillBg: 'bg-blue-50 dark:bg-blue-900/30' },
  { key: 'maintenance', labelKey: 'cars.filterMaintenance', icon: Wrench,       color: 'text-orange-600', activeBg: 'bg-orange-500',                   activeText: 'text-white',                     pillBg: 'bg-orange-50 dark:bg-orange-900/30' },
];

const STATUS_STYLES = {
  available:   { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  rented:      { badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',                   dot: 'bg-blue-500' },
  maintenance: { badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',       dot: 'bg-orange-500' },
  sold:        { badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',                         dot: 'bg-red-500' },
};

function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.available;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', style.badge)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', style.dot)} />
      {label}
    </span>
  );
}

export default function CarsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: carsData, error, isLoading, mutate } = useSWR('cars', () => getCars(), {
    revalidateOnFocus: false,
  });

  const cars = carsData?.data || [];

  const counts = useMemo(() => ({
    all:         cars.length,
    available:   cars.filter((c) => c.status === 'available').length,
    rented:      cars.filter((c) => c.status === 'rented').length,
    maintenance: cars.filter((c) => c.status === 'maintenance').length,
    sold:        cars.filter((c) => c.status === 'sold').length,
  }), [cars]);

  const filteredCars = useMemo(() =>
    activeFilter === 'all' ? cars : cars.filter((c) => c.status === activeFilter),
  [cars, activeFilter]);

  const getStatusLabel = (status) => ({
    available:   t('cars.statusAvailable'),
    rented:      t('cars.statusRented'),
    maintenance: t('cars.statusMaintenance'),
    sold:        t('cars.statusSold'),
  })[status] || status;

  const handleViewCar    = (id) => { setSelectedCarId(id);  setIsViewModalOpen(true); };
  const handleEditCar    = (id) => { setSelectedCarId(id);  setIsEditModalOpen(true); };
  const handleDeleteCar  = (car) => { setSelectedCar(car);  setIsDeleteModalOpen(true); };
  const handleNewContract = (id) => { setSelectedCarId(id); setIsAddContractModalOpen(true); };

  return (
    <div className="container mx-auto py-6 px-4 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {t('cars.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('cars.description')}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('cars.addNewCar')}
        </Button>
      </div>

      {/* ── Filter Pills ── */}
      {!isLoading && !error && (
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive
                    ? `${f.activeBg} ${f.activeText} border-transparent shadow-sm`
                    : `bg-background border-border ${f.color} hover:border-current hover:bg-muted/50`
                )}
              >
                <Icon className="w-3 h-3" />
                {t(f.labelKey)}
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums',
                  isActive ? 'bg-white/20 text-inherit' : `${f.pillBg} ${f.color}`
                )}>
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Table Card ── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm text-red-500">{t('cars.failedToLoad')}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && filteredCars.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Car className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {cars.length === 0 ? t('cars.noCarsFound') : t('cars.noCarsInFilter')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cars.length === 0 ? t('cars.noCarsFoundDesc') : t('cars.tryAnotherFilter')}
                </p>
              </div>
              {cars.length === 0 && (
                <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="mt-1 gap-2">
                  <Plus className="w-4 h-4" />
                  {t('cars.addFirstCar')}
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && filteredCars.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.plateNumber')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.brand')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.model')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.year')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.color')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.status')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.dailyPrice')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('cars.mileage')}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">{t('cars.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCars.map((car) => (
                      <TableRow
                        key={car.id}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        {/* Plate */}
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-sm font-semibold tracking-wider">
                              {car.plate_number || <span className="text-muted-foreground">—</span>}
                            </span>
                            {(car.plate_source || car.plate_code) && (
                              <span className="text-xs text-muted-foreground">
                                {[car.plate_source, car.plate_code].filter(Boolean).join(' · ')}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Brand */}
                        <TableCell className="text-sm">{car.brand || <span className="text-muted-foreground">—</span>}</TableCell>

                        {/* Model */}
                        <TableCell className="text-sm">{car.model || <span className="text-muted-foreground">—</span>}</TableCell>

                        {/* Year */}
                        <TableCell className="text-sm tabular-nums">{car.year || <span className="text-muted-foreground">—</span>}</TableCell>

                        {/* Color */}
                        <TableCell>
                          {car.color ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-border/60 flex-shrink-0"
                                style={{ backgroundColor: car.color.toLowerCase() }}
                              />
                              <span className="text-sm">{car.color}</span>
                            </div>
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={car.status} label={getStatusLabel(car.status)} />
                        </TableCell>

                        {/* Daily Price */}
                        <TableCell className="text-sm tabular-nums">
                          {car.daily_price ? (
                            <span className="font-semibold text-primary">
                              AED {parseFloat(car.daily_price).toFixed(2)}
                              <span className="text-muted-foreground font-normal text-xs"> /day</span>
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>

                        {/* Mileage */}
                        <TableCell className="text-sm tabular-nums">
                          {car.mileage
                            ? <>{car.mileage.toLocaleString()} <span className="text-muted-foreground text-xs">km</span></>
                            : <span className="text-muted-foreground">0 km</span>
                          }
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* New Contract */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNewContract(car.id)}
                              disabled={car.status !== 'available'}
                              title={t('contracts.addContract')}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{t('contracts.addContract')}</span>
                            </Button>

                            {/* View */}
                            <Button
                              variant="outline"
                              size="icon"
                              title={t('cars.viewDetails')}
                              onClick={() => handleViewCar(car.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {/* Edit */}
                            <Button
                              variant="outline"
                              size="icon"
                              title={t('cars.editCar')}
                              onClick={() => handleEditCar(car.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8  text-red-500 hover:text-red-700"
                              title={t('cars.deleteCar')}
                              onClick={() => handleDeleteCar(car)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border/60 bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t('cars.showing')} <span className="font-semibold text-foreground">{filteredCars.length}</span> / <span className="font-semibold text-foreground">{cars.length}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{t('cars.available')}: <b className="text-foreground">{counts.available}</b></span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{t('cars.rented')}: <b className="text-foreground">{counts.rented}</b></span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{t('cars.maintenance')}: <b className="text-foreground">{counts.maintenance}</b></span>
                  </div>
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>

      {/* ── Modals ── */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newCar) => mutate(current => ({ ...current, data: [newCar, ...(current?.data || [])] }), { revalidate: false })}
      />
      <ViewCarModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setSelectedCarId(null); }} carId={selectedCarId} />
      <EditCarModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedCarId(null); }}
        onSuccess={(updatedCar) => mutate(current => ({ ...current, data: (current?.data || []).map(c => c.id === updatedCar.id ? updatedCar : c) }), { revalidate: false })}
        carId={selectedCarId}
      />
      <DeleteCarModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedCar(null); }}
        onSuccess={(id) => mutate(current => ({ ...current, data: (current?.data || []).filter(c => c.id !== id) }), { revalidate: false })}
        car={selectedCar}
      />
      <AddContractModal
        isOpen={isAddContractModalOpen}
        onClose={() => { setIsAddContractModalOpen(false); setSelectedCarId(null); }}
        onSuccess={(newContract) => mutate(current => ({ ...current, data: (current?.data || []).map(c => c.id === newContract.car_id ? { ...c, status: 'rented' } : c) }), { revalidate: false })}
        defaultCarId={selectedCarId}
      />
    </div>
  );
}