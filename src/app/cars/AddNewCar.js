import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Car, Users, Settings, MapPin, Camera, Edit, Upload, Trash2, X,
  CheckCircle, XCircle, Calendar as CalendarIcon, DollarSign, Info, Wrench, Shield, Star
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const statusIcons = {
  available: CheckCircle,
  rented: Car,
  maintenance: Settings,
  unavailable: XCircle
};

const statusColors = {
  available: 'bg-green-50 text-green-700 border-green-200',
  rented: 'bg-blue-50 text-blue-700 border-blue-200',
  maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  unavailable: 'bg-red-50 text-red-700 border-red-200'
};

const statusLabels = {
  available: 'متاح',
  rented: 'مؤجر',
  maintenance: 'صيانة',
  unavailable: 'غير متاح'
};

export default function AddNewCar({ car, type, open, onClose, onSave, onEdit }) {
  const [formData, setFormData] = useState(car ? {
    ...car,
    last_maintenance_date: car.last_maintenance_date ? new Date(car.last_maintenance_date) : undefined,
    next_maintenance_date: car.next_maintenance_date ? new Date(car.next_maintenance_date) : undefined,
    purchase_date: car.purchase_date ? new Date(car.purchase_date) : undefined,
    insurance_expiry: car.insurance_expiry ? new Date(car.insurance_expiry) : undefined,
    features_input: car.features ? car.features.join(', ') : '',
  } : {
    vehicle_id: '',
    plate_number: '',
    make: '',
    model: '',
    year: 2024,
    color: '',
    transmission_type: 'أوتوماتيك',
    fuel_type: 'بنزين',
    mileage: 0,
    seating_capacity: 5,
    daily_rate: 0,
    hourly_rate: 0,
    weekly_rate: 0,
    monthly_rate: 0,
    status: 'available',
    last_maintenance_date: undefined,
    next_maintenance_date: undefined,
    purchase_date: undefined,
    purchase_price: 0,
    insurance_number: '',
    insurance_expiry: undefined,
    features: [],
    features_input: '',
    description: ''
  });

  // Generic handler for text/number inputs
  const handleInputChange = (field, parser = v => v) => e => {
    setFormData({ ...formData, [field]: parser(e.target.value) });
  };

  // Handler for calendar/date pickers
  const handleDateChange = field => date => {
    setFormData({ ...formData, [field]: date });
  };

  // Handler for select fields
  const handleSelectChange = field => value => {
    setFormData({ ...formData, [field]: value });
  };

  // Handler for features input
  const handleFeaturesChange = e => {
    const value = e.target.value;
    setFormData({
      ...formData,
      features_input: value,
      features: value.split(',').map(f => f.trim()).filter(Boolean)
    });
  };

  const handleSave = () => {
    const dataToSave = { ...formData };
    delete dataToSave.features_input;
    if (type === 'add' || type === 'edit') {
      onSave(dataToSave);
    }
    onClose();
  };

  if (type === 'view' && car) {
    const StatusIcon = statusIcons[car.status];
    return (
      <Dialog className='min-w-[80vw]'  open={open} onOpenChange={onClose}>
        <DialogContent className="min-w-[80vw] max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Car className="h-6 w-6 text-blue-600" />
              {car.make} {car.model} - {car.year}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="absolute left-4 top-4 h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto" dir="rtl">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  التفاصيل
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  الأسعار
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  الصيانة
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
                  <div  className="lg:col-span-1 ">
                    <Card dir="rtl">
                      <CardHeader>
                        <CardTitle className="text-lg">صورة السيارة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 aspect-square flex items-center justify-center border-2 border-dashed border-gray-200" dir="rtl">
                          <div className="text-center">
                            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">لا توجد صورة</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <StatusIcon className="h-5 w-5" />
                          معلومات السيارة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">الحالة</Label>
                            <Badge className={`${statusColors[car.status]} justify-center`}>
                              {statusLabels[car.status]}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">المعرف</Label>
                            <p className="font-semibold">{car.vehicle_id}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">رقم اللوحة</Label>
                            <p className="font-semibold">{car.plate_number}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">اللون</Label>
                            <p className="font-semibold">{car.color}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">ناقل الحركة</Label>
                            <p className="font-semibold">{car.transmission_type}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">نوع الوقود</Label>
                            <p className="font-semibold">{car.fuel_type}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">الكيلومترات</Label>
                            <p className="font-semibold">{car.mileage?.toLocaleString()} كم</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">عدد المقاعد</Label>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <p className="font-semibold">{car.seating_capacity}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {car.features && car.features.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            المميزات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {car.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">بالساعة</p>
                          <p className="text-2xl font-bold text-blue-800">{car.hourly_rate}</p>
                          <p className="text-sm text-blue-600">درهم</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">يومي</p>
                          <p className="text-2xl font-bold text-green-800">{car.daily_rate}</p>
                          <p className="text-sm text-green-600">درهم</p>
                        </div>
                        <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">أسبوعي</p>
                          <p className="text-2xl font-bold text-purple-800">{car.weekly_rate}</p>
                          <p className="text-sm text-purple-600">درهم</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">شهري</p>
                          <p className="text-2xl font-bold text-orange-800">{car.monthly_rate}</p>
                          <p className="text-sm text-orange-600">درهم</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-200 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="maintenance" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        معلومات الصيانة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">آخر صيانة</Label>
                        <p className="font-semibold">{car.last_maintenance_date ? new Date(car.last_maintenance_date).toLocaleDateString('ar-AE') : 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">الصيانة القادمة</Label>
                        <p className="font-semibold">{car.next_maintenance_date ? new Date(car.next_maintenance_date).toLocaleDateString('ar-AE') : 'غير محدد'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        معلومات التأمين
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-500">رقم التأمين</Label>
                        <p className="font-semibold">{car.insurance_number || 'غير محدد'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">انتهاء التأمين</Label>
                        <p className="font-semibold">{car.insurance_expiry ? new Date(car.insurance_expiry).toLocaleDateString('ar-AE') : 'غير محدد'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>معلومات الشراء</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-500">تاريخ الشراء</Label>
                          <p className="font-semibold">{car.purchase_date ? new Date(car.purchase_date).toLocaleDateString('ar-AE') : 'غير محدد'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">سعر الشراء</Label>
                          <p className="font-semibold">{car.purchase_price?.toLocaleString()} درهم</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onEdit(car)}>
              <Edit className="ml-2 h-4 w-4" />
              تعديل السيارة
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <Upload className="ml-2 h-4 w-4" />
              إضافة صور
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="ml-2 h-4 w-4" />
              حذف السيارة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit/Add Form
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Car className="h-6 w-6 text-blue-600" />
            {type === 'add' ? 'إضافة سيارة جديدة' : 'تعديل السيارة'}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="absolute left-4 top-4 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="pricing">الأسعار</TabsTrigger>
              <TabsTrigger value="details">التفاصيل الإضافية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {type === 'edit' && (
                      <div className="space-y-2">
                        <Label>المعرف</Label>
                        <Input value={formData.vehicle_id} disabled className="bg-gray-50" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>رقم اللوحة *</Label>
                      <Input
                        value={formData.plate_number}
                        onChange={handleInputChange('plate_number')}
                        placeholder="أدخل رقم اللوحة"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الماركة *</Label>
                      <Input
                        value={formData.make}
                        onChange={handleInputChange('make')}
                        placeholder="تويوتا، نيسان، إلخ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الموديل *</Label>
                      <Input
                        value={formData.model}
                        onChange={handleInputChange('model')}
                        placeholder="كامري، التيما، إلخ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>السنة</Label>
                      <Input
                        type="number"
                        value={formData.year}
                        onChange={handleInputChange('year', v => v === '' ? '' : parseInt(v))}
                        min="1990"
                        max="2030"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>اللون</Label>
                      <Input
                        value={formData.color}
                        onChange={handleInputChange('color')}
                        placeholder="أبيض، أسود، إلخ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نوع ناقل الحركة</Label>
                      <Select value={formData.transmission_type} onValueChange={handleSelectChange('transmission_type')}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع ناقل الحركة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="أوتوماتيك">أوتوماتيك</SelectItem>
                          <SelectItem value="يدوي">يدوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>نوع الوقود</Label>
                      <Select value={formData.fuel_type} onValueChange={handleSelectChange('fuel_type')}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الوقود" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="بنزين">بنزين</SelectItem>
                          <SelectItem value="ديزل">ديزل</SelectItem>
                          <SelectItem value="كهرباء">كهرباء</SelectItem>
                          <SelectItem value="هجين">هجين</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>عدد الكيلومترات</Label>
                      <Input
                        type="number"
                        value={formData.mileage}
                        onChange={handleInputChange('mileage', v => v === '' ? '' : parseInt(v))}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>عدد المقاعد</Label>
                      <Input
                        type="number"
                        value={formData.seating_capacity}
                        onChange={handleInputChange('seating_capacity', v => v === '' ? '' : parseInt(v))}
                        min="2"
                        max="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Select value={formData.status} onValueChange={handleSelectChange('status')}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">متاح</SelectItem>
                          <SelectItem value="rented">مؤجر</SelectItem>
                          <SelectItem value="maintenance">صيانة</SelectItem>
                          <SelectItem value="unavailable">غير متاح</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    أسعار التأجير
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>السعر بالساعة (درهم)</Label>
                      <Input
                        type="number"
                        value={formData.hourly_rate}
                        onChange={handleInputChange('hourly_rate', v => v === '' ? '' : parseFloat(v))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>السعر اليومي (درهم)</Label>
                      <Input
                        type="number"
                        value={formData.daily_rate}
                        onChange={handleInputChange('daily_rate', v => v === '' ? '' : parseFloat(v))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>السعر الأسبوعي (درهم)</Label>
                      <Input
                        type="number"
                        value={formData.weekly_rate}
                        onChange={handleInputChange('weekly_rate', v => v === '' ? '' : parseFloat(v))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>السعر الشهري (درهم)</Label>
                      <Input
                        type="number"
                        value={formData.monthly_rate}
                        onChange={handleInputChange('monthly_rate', v => v === '' ? '' : parseFloat(v))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      معلومات الصيانة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>تاريخ آخر صيانة</Label>
                      <Calendar
                        mode="single"
                        selected={formData.last_maintenance_date}
                        onSelect={handleDateChange('last_maintenance_date')}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تاريخ الصيانة القادمة</Label>
                      <Calendar
                        mode="single"
                        selected={formData.next_maintenance_date}
                        onSelect={handleDateChange('next_maintenance_date')}
                        className="rounded-md border"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      معلومات التأمين
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>رقم التأمين</Label>
                      <Input
                        value={formData.insurance_number}
                        onChange={handleInputChange('insurance_number')}
                        placeholder="رقم بوليصة التأمين"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>انتهاء التأمين</Label>
                      <Calendar
                        mode="single"
                        selected={formData.insurance_expiry}
                        onSelect={handleDateChange('insurance_expiry')}
                        className="rounded-md border"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الشراء</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>تاريخ الشراء</Label>
                      <Calendar
                        mode="single"
                        selected={formData.purchase_date}
                        onSelect={handleDateChange('purchase_date')}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>سعر الشراء (درهم)</Label>
                      <Input
                        type="number"
                        value={formData.purchase_price}
                        onChange={handleInputChange('purchase_price', v => v === '' ? '' : parseFloat(v))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      المميزات والوصف
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>المميزات (افصل بينها بفاصلة)</Label>
                      <Input
                        value={formData.features_input}
                        onChange={handleFeaturesChange}
                        placeholder="مثال: بلوتوث, كاميرا خلفية, حساسات"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>الوصف</Label>
                      <Textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="اكتب وصفاً مختصراً عن السيارة"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSave}>
            حفظ التغييرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

AddNewCar.propTypes = {
  car: PropTypes.object,
  type: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onEdit: PropTypes.func,
};