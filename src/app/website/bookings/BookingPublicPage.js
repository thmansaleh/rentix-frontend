'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getCars } from '@/app/services/api/cars'
import { createBooking } from '@/app/services/api/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarCheck, CheckCircle2, AlertCircle, Car } from 'lucide-react'

function BookingFormInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const preCarId   = searchParams.get('car_id')   || ''
  const preCarName = searchParams.get('car_name') || ''

  const [cars, setCars] = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    car_id:        preCarId,
    customer_name: '',
    phone:         '',
    start_date:    '',
    end_date:      '',
    pickup_from:   '',
    notes:         '',
  })

  useEffect(() => {
    getCars()
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        setCars(list.filter(c => c.status === 'available'))
      })
      .catch(() => {})
      .finally(() => setLoadingCars(false))
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    if (!form.car_id)         return 'يرجى اختيار سيارة'
    if (!form.customer_name)  return 'يرجى إدخال اسمك'
    if (!form.phone)          return 'يرجى إدخال رقم هاتفك'
    if (!form.start_date)     return 'يرجى تحديد تاريخ البدء'
    if (!form.end_date)       return 'يرجى تحديد تاريخ الانتهاء'
    if (new Date(form.end_date) <= new Date(form.start_date))
      return 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const err = validate()
    if (err) { setError(err); return }

    setSubmitting(true)
    try {
      const res = await createBooking({
        car_id:        Number(form.car_id),
        customer_name: form.customer_name,
        phone:         form.phone,
        start_date:    form.start_date,
        end_date:      form.end_date,
        pickup_from:   form.pickup_from,
        notes:         form.notes,
      })
      if (res.success || res.id || res.data) {
        setSuccess(true)
      } else {
        setError(res.message || 'حدث خطأ أثناء الحجز')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-3">تم إرسال طلب الحجز!</h2>
        <p className="text-muted-foreground mb-8">
          سنتواصل معك قريباً لتأكيد الحجز. شكراً لاختيارك لنا.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setSuccess(false); setForm({ car_id:'', customer_name:'', phone:'', start_date:'', end_date:'', pickup_from:'', notes:'' }) }}>
            حجز آخر
          </Button>
          <Button variant="outline" onClick={() => router.push('/website/cars')}>
            تصفح السيارات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <CalendarCheck className="h-12 w-12 mx-auto text-primary mb-3" />
        <h1 className="text-4xl font-bold mb-2">احجز سيارتك</h1>
        <p className="text-muted-foreground">أكمل البيانات التالية وسنتواصل معك لتأكيد الحجز</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">بيانات الحجز</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Car selection */}
            <div className="space-y-2">
              <Label htmlFor="car_id">السيارة *</Label>
              {loadingCars ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  id="car_id"
                  value={form.car_id}
                  onChange={e => set('car_id', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">-- اختر سيارة --</option>
                  {cars.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.model} {c.year && `(${c.year})`}
                      {c.daily_rate ? ` — ${c.daily_rate} درهم/يوم` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="customer_name">الاسم الكامل *</Label>
              <Input
                id="customer_name"
                placeholder="أدخل اسمك الكامل"
                value={form.customer_name}
                onChange={e => set('customer_name', e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">تاريخ البدء *</Label>
                <Input
                  id="start_date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.start_date}
                  onChange={e => set('start_date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">تاريخ الانتهاء *</Label>
                <Input
                  id="end_date"
                  type="date"
                  min={form.start_date || new Date().toISOString().split('T')[0]}
                  value={form.end_date}
                  onChange={e => set('end_date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Pickup location */}
            <div className="space-y-2">
              <Label htmlFor="pickup_from">موقع الاستلام</Label>
              <Input
                id="pickup_from"
                placeholder="مثال: مطار دبي، وسط المدينة..."
                value={form.pickup_from}
                onChange={e => set('pickup_from', e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="أي تفاصيل إضافية..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <Alert className="border-destructive bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <CalendarCheck className="h-5 w-5 ml-2" />
                  إرسال طلب الحجز
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingPublicPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-10 w-64 mx-auto mb-6" />
        <Card><CardContent className="p-6 space-y-5">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent></Card>
      </div>
    }>
      <BookingFormInner />
    </Suspense>
  )
}
