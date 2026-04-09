'use client'

import React, { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPublicCars } from '@/app/services/api/cars'
import { createPublicBooking } from '@/app/services/api/bookings'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  CalendarCheck, CheckCircle2, AlertCircle, Car,
  User, Phone, MapPin, FileText, Calendar, ArrowLeft
} from 'lucide-react'

/* ─── helpers ─── */
function diffDays(a, b) {
  if (!a || !b) return 0
  const diff = Math.ceil((new Date(b) - new Date(a)) / 86400000)
  return diff > 0 ? diff : 0
}

/* ─── Car Summary Panel ─── */
function CarSummary({ car, startDate, endDate, isRTL }) {
  const dailyPrice = car?.daily_price ?? car?.daily_rate
  const days = diffDays(startDate, endDate)
  const total = dailyPrice && days ? Number(dailyPrice) * days : null

  return (
    <div className="rounded-2xl border bg-muted/30 p-5 space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{isRTL ? 'ملخص الحجز' : 'Booking Summary'}</h3>

      {car ? (
        <>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold">{car.brand} {car.model}</p>
              {car.year && <p className="text-sm text-muted-foreground">{car.year}</p>}
            </div>
          </div>

          {dailyPrice && (
            <div className="flex justify-between items-center text-sm border-t pt-3">
              <span className="text-muted-foreground">{isRTL ? 'السعر اليومي' : 'Daily price'}</span>
              <span className="font-semibold">{dailyPrice} {isRTL ? 'د.إ' : 'AED'}</span>
            </div>
          )}

          {days > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{isRTL ? 'عدد الأيام' : 'Number of days'}</span>
              <span className="font-semibold">{days} {isRTL ? 'يوم' : 'days'}</span>
            </div>
          )}

          {total && (
            <div className="flex justify-between items-center rounded-xl bg-primary/10 px-4 py-3">
              <span className="font-semibold text-primary text-sm">{isRTL ? 'الإجمالي المتوقع' : 'Estimated total'}</span>
              <span className="font-bold text-primary text-lg">{total.toLocaleString()} {isRTL ? 'د.إ' : 'AED'}</span>
            </div>
          )}

          {(!days || !dailyPrice) && (
            <p className="text-xs text-muted-foreground">{isRTL ? 'حدد تواريخ الحجز لعرض السعر الإجمالي' : 'Select booking dates to see total price'}</p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{isRTL ? 'اختر سيارة لعرض التفاصيل' : 'Choose a car to view details'}</p>
      )}
    </div>
  )
}

/* ─── Field wrapper ─── */
function Field({ label, icon: Icon, required, children }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

/* ─── Main form ─── */
function BookingFormInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const { isRTL } = useLanguage()

  const preCarId   = searchParams.get('car_id')   || ''
  const preCarName = searchParams.get('car_name') || ''

  const [cars, setCars]           = useState([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState(null)

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
    getPublicCars()
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        setCars(list)
      })
      .catch(() => {})
      .finally(() => setLoadingCars(false))
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const selectedCar = useMemo(
    () => cars.find(c => String(c.id) === String(form.car_id)) || null,
    [cars, form.car_id]
  )

  const today = new Date().toISOString().split('T')[0]

  const validate = () => {
    if (!form.car_id)        return isRTL ? 'يرجى اختيار سيارة' : 'Please choose a car'
    if (!form.customer_name) return isRTL ? 'يرجى إدخال اسمك الكامل' : 'Please enter your full name'
    if (!form.phone)         return isRTL ? 'يرجى إدخال رقم هاتفك' : 'Please enter your phone number'
    if (!form.start_date)    return isRTL ? 'يرجى تحديد تاريخ البدء' : 'Please select start date'
    if (!form.end_date)      return isRTL ? 'يرجى تحديد تاريخ الانتهاء' : 'Please select end date'
    if (new Date(form.end_date) <= new Date(form.start_date))
      return isRTL ? 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء' : 'End date must be after start date'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const err = validate()
    if (err) { setError(err); return }

    setSubmitting(true)
    try {
      const res = await createPublicBooking({
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
        setError(res.message || (isRTL ? 'حدث خطأ أثناء الحجز' : 'An error occurred while booking'))
      }
    } catch (e) {
      setError(e?.response?.data?.message || (isRTL ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  /* ─── Success screen ─── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{isRTL ? 'تم الإرسال بنجاح!' : 'Submitted successfully!'}</h2>
            <p className="text-muted-foreground">
              {isRTL ? 'سنتواصل معك قريباً لتأكيد الحجز. شكراً لاختيارك لنا.' : 'We will contact you soon to confirm your booking. Thank you!'}
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/30 p-5 text-sm space-y-2 text-start">
            {selectedCar && <p><span className="text-muted-foreground">{isRTL ? 'السيارة' : 'Car'}: </span><span className="font-semibold">{selectedCar.brand} {selectedCar.model}</span></p>}
            {form.customer_name && <p><span className="text-muted-foreground">{isRTL ? 'الاسم' : 'Name'}: </span><span className="font-semibold">{form.customer_name}</span></p>}
            {form.start_date && form.end_date && (
              <p><span className="text-muted-foreground">{isRTL ? 'الفترة' : 'Period'}: </span><span className="font-semibold">{form.start_date} → {form.end_date}</span></p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setSuccess(false)
                setForm({ car_id: '', customer_name: '', phone: '', start_date: '', end_date: '', pickup_from: '', notes: '' })
              }}
            >
              <CalendarCheck className="h-4 w-4 ml-2" />
              {isRTL ? 'حجز آخر' : 'Book another'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/website/cars')}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              {isRTL ? 'تصفح السيارات' : 'Browse cars'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Form ─── */
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 ring-8 ring-primary/5">
            <CalendarCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{isRTL ? 'احجز سيارتك' : 'Book Your Car'}</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {isRTL ? 'أكمل البيانات أدناه وسنتواصل معك لتأكيد الحجز' : 'Fill in the form below and we will contact you to confirm'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* Form panel */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
            <h2 className="font-semibold text-lg border-b pb-4">{isRTL ? 'بيانات الحجز' : 'Booking Details'}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Car */}
                {!preCarId && (
                  <Field label={isRTL ? 'السيارة' : 'Car'} icon={Car} required>
                    {loadingCars ? (
                      <Skeleton className="h-10 w-full rounded-xl" />
                    ) : (
                      <select
                        value={form.car_id}
                        onChange={e => set('car_id', e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
                        required
                      >
                        <option value="">{isRTL ? '-- اختر سيارة متاحة --' : '-- Select an available car --'}</option>
                        {cars.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.brand} {c.model}{c.year ? ` (${c.year})` : ''}
                            {(c.daily_price || c.daily_rate) ? ` — ${c.daily_price || c.daily_rate} ${isRTL ? 'د.إ/يوم' : 'AED/day'}` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                )}

              {/* Name */}
              <Field label={isRTL ? 'الاسم الكامل' : 'Full Name'} icon={User} required>
                <Input
                  className="rounded-xl"
                  placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  value={form.customer_name}
                  onChange={e => set('customer_name', e.target.value)}
                  required
                />
              </Field>

              {/* Phone */}
              <Field label={isRTL ? 'رقم الهاتف' : 'Phone Number'} icon={Phone} required>
                <Input
                  className="rounded-xl"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  required
                />
              </Field>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <Field label={isRTL ? 'تاريخ البدء' : 'Start Date'} icon={Calendar} required>
                  <Input
                    className="rounded-xl"
                    type="date"
                    min={today}
                    value={form.start_date}
                    onChange={e => set('start_date', e.target.value)}
                    required
                  />
                </Field>
                <Field label={isRTL ? 'تاريخ الانتهاء' : 'End Date'} icon={Calendar} required>
                  <Input
                    className="rounded-xl"
                    type="date"
                    min={form.start_date || today}
                    value={form.end_date}
                    onChange={e => set('end_date', e.target.value)}
                    required
                  />
                </Field>
              </div>

              {/* Pickup */}
              <Field label={isRTL ? 'موقع الاستلام' : 'Pickup Location'} icon={MapPin}>
                <Input
                  className="rounded-xl"
                  placeholder={isRTL ? 'مثال: مطار دبي، وسط المدينة...' : 'Example: Dubai Airport, Downtown...'}
                  value={form.pickup_from}
                  onChange={e => set('pickup_from', e.target.value)}
                />
              </Field>

              {/* Notes */}
              <Field label={isRTL ? 'ملاحظات إضافية' : 'Additional Notes'} icon={FileText}>
                <textarea
                  rows={3}
                  placeholder={isRTL ? 'أي تفاصيل إضافية تود مشاركتها...' : 'Any extra details you want to share...'}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow resize-none"
                />
              </Field>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ml-2" />
                    {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-5 w-5 ml-2" />
                    {isRTL ? 'إرسال طلب الحجز' : 'Submit Booking Request'}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Sidebar summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <CarSummary car={selectedCar} startDate={form.start_date} endDate={form.end_date} isRTL={isRTL} />

            <div className="mt-4 rounded-2xl border bg-muted/20 p-4 space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground text-sm">{isRTL ? '💡 كيف يعمل الحجز؟' : '💡 How booking works'}</p>
              <p>{isRTL ? '١. أكمل نموذج الحجز أدناه' : '1. Fill out the booking form below'}</p>
              <p>{isRTL ? '٢. سيتواصل معك فريقنا خلال ٢٤ ساعة' : '2. Our team will contact you within 24 hours'}</p>
              <p>{isRTL ? '٣. نؤكد الحجز ونرسل لك التفاصيل' : '3. We confirm your booking and send details'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function BookingPublicPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b py-20 text-center">
          <Skeleton className="h-20 w-20 rounded-2xl mx-auto mb-6" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="rounded-2xl border bg-card p-8 space-y-5">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <BookingFormInner />
    </Suspense>
  )
}
