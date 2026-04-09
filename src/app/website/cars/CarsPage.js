'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPublicCars } from '@/app/services/api/cars'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Car, Search, CalendarCheck, Fuel, Users, Star, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function CarCard({ car, isRTL }) {
  const statusConfig = {
    available: { label: isRTL ? 'متاحة' : 'Available', className: 'bg-emerald-500 hover:bg-emerald-600 text-white border-0' },
    rented: { label: isRTL ? 'مؤجرة' : 'Rented', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-0' },
    maintenance: { label: isRTL ? 'صيانة' : 'Maintenance', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0' },
  }
  const isAvailable = car.status === 'available'
  const status = statusConfig[car.status] || statusConfig.maintenance
  const firstImage = car.images && car.images.length > 0 ? car.images[0] : null

  return (
    <div className="group rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center overflow-hidden">
        {firstImage?.file_url ? (
          <img
            src={firstImage.file_url}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
            <Car className="h-16 w-16" />
          </div>
        )}
        {/* Status badge */}
        {/* <Badge className={`absolute top-3 start-3 text-xs font-semibold ${status.className}`}>
          {status.label}
        </Badge> */}
        {/* Daily rate chip */}
        {car.daily_price && (
          <div className="absolute bottom-3 end-3 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-sm font-bold text-primary shadow-sm">
            {car.daily_price} <span className="text-xs font-normal text-muted-foreground">{isRTL ? 'د.إ/يوم' : 'AED/day'}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-base leading-tight">{car.brand} {car.model}</h3>
          {car.year && <p className="text-xs text-muted-foreground mt-0.5">{car.year}</p>}
        </div>

        {/* Specs pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {car.color && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
              🎨 {car.color}
            </span>
          )}
          {car.fuel_type && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
              <Fuel className="h-3 w-3" /> {car.fuel_type}
            </span>
          )}
          {car.seats && (
            <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
              <Users className="h-3 w-3" /> {car.seats} {isRTL ? 'مقاعد' : 'seats'}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/website/bookings?car_id=${car.id}&car_name=${encodeURIComponent(`${car.brand} ${car.model}`)}`}
            className={`flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
              isAvailable
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow'
                : 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
            }`}
            aria-disabled={!isAvailable}
            tabIndex={isAvailable ? 0 : -1}
          >
            {isAvailable ? (
              <>
                <CalendarCheck className="h-4 w-4" />
                {isRTL ? 'احجز الآن' : 'Book now'}
                <ChevronRight className="h-4 w-4 opacity-70" />
              </>
            ) : (
              isRTL ? 'غير متاحة للحجز' : 'Not available for booking'
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}

function CarsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CarsPage() {
  const { isRTL } = useLanguage()
  const [cars, setCars]               = useState([])
  const [filtered, setFiltered]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const filterOptions = [
    { value: 'all', label: isRTL ? 'الكل' : 'All' },
    // { value: 'available', label: isRTL ? 'متاحة' : 'Available' },
  ]

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await getPublicCars()
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        setCars(data)
        setFiltered(data)
      } catch {
        setError(isRTL ? 'تعذر تحميل السيارات. يرجى المحاولة لاحقاً.' : 'Could not load cars. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [isRTL])

  useEffect(() => {
    let result = cars
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        `${c.brand} ${c.model} ${c.year ?? ''} ${c.color ?? ''}`.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, cars])

  const availableCount = cars.filter(c => c.status === 'available').length

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 ring-8 ring-primary/5">
              <Car className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{isRTL ? 'أسطولنا من السيارات' : 'Our Car Fleet'}</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              {isRTL ? 'اختر سيارتك المفضلة واحجزها بكل سهولة وراحة' : 'Choose your preferred car and book it easily.'}
            </p>

            {/* Stats strip */}
            {!loading && !error && (
              <div className="inline-flex items-center gap-6 bg-background/80 backdrop-blur-sm border rounded-2xl px-6 py-3 shadow-sm text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  <span className="font-semibold text-foreground">{availableCount}</span>
                  <span className="text-muted-foreground">{isRTL ? 'سيارة متاحة' : 'Available cars'}</span>
                </span>
                <span className="h-4 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-muted-foreground">{isRTL ? 'أفضل أسعار الإيجار' : 'Best rental rates'}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pr-9 h-10 rounded-xl"
              placeholder={isRTL ? 'ابحث حسب الماركة أو الموديل...' : 'Search by brand or model...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  statusFilter === opt.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <CarsSkeleton />
        ) : error ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
              <Car className="h-10 w-10 text-destructive/50" />
            </div>
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <Car className="h-10 w-10 opacity-30" />
            </div>
            <p className="text-lg font-medium">{isRTL ? 'لا توجد سيارات مطابقة' : 'No matching cars found'}</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-sm text-primary hover:underline">
                {isRTL ? 'مسح البحث' : 'Clear search'}
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-5">
              {filtered.length} {isRTL ? 'سيارة' : 'cars'} {statusFilter !== 'all' ? `— ${filterOptions.find(f => f.value === statusFilter)?.label}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(car => <CarCard key={car.id} car={car} isRTL={isRTL} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
