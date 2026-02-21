'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCars } from '@/app/services/api/cars'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Car, Search, CalendarCheck, Fuel, Users } from 'lucide-react'

function CarCard({ car }) {
  const isAvailable = car.status === 'available'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Car image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <Car className="h-20 w-20 text-muted-foreground/40" />
        )}
        <Badge
          className="absolute top-3 left-3"
          variant={isAvailable ? 'default' : 'secondary'}
        >
          {isAvailable ? 'متاحة' : car.status === 'rented' ? 'مؤجرة' : 'صيانة'}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg leading-tight">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground">{car.year}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {car.color && (
            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
              🎨 {car.color}
            </span>
          )}
          {car.fuel_type && (
            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
              <Fuel className="h-3 w-3" /> {car.fuel_type}
            </span>
          )}
          {car.seats && (
            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
              <Users className="h-3 w-3" /> {car.seats} مقاعد
            </span>
          )}
        </div>

        {car.daily_rate && (
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-primary">{car.daily_rate}</span>
            <span className="text-sm text-muted-foreground mb-0.5">درهم / يوم</span>
          </div>
        )}

        <Link href={`/website/bookings?car_id=${car.id}&car_name=${encodeURIComponent(`${car.brand} ${car.model}`)}`}>
          <Button
            className="w-full mt-1"
            disabled={!isAvailable}
            variant={isAvailable ? 'default' : 'outline'}
          >
            <CalendarCheck className="h-4 w-4 ml-2" />
            {isAvailable ? 'احجز الآن' : 'غير متاحة'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function CarsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCars()
        if (res.success || Array.isArray(res.data)) {
          const data = Array.isArray(res.data) ? res.data : []
          setCars(data)
          setFiltered(data)
        } else if (Array.isArray(res)) {
          setCars(res)
          setFiltered(res)
        }
      } catch (e) {
        setError('تعذر تحميل السيارات. يرجى المحاولة لاحقاً.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    let result = cars
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        `${c.brand} ${c.model} ${c.year} ${c.color || ''}`.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, cars])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">أسطولنا من السيارات</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          اختر سيارتك المفضلة واحجزها بكل سهولة
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder="ابحث عن سيارة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all',       label: 'الكل' },
            { value: 'available', label: 'متاحة' },
            { value: 'rented',    label: 'مؤجرة' },
          ].map(opt => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? 'default' : 'outline'}
              onClick={() => setStatusFilter(opt.value)}
              size="sm"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <CarsSkeleton />
      ) : error ? (
        <div className="text-center py-20 text-destructive">
          <p className="text-lg">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Car className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">لا توجد سيارات مطابقة</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} سيارة</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
