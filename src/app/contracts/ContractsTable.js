'use client';
import { useState } from 'react';
import {
  Calendar,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Filter,
  User,
  Phone,
  CreditCard,
  Search,
  FileText,
  Clock,
  DollarSign,
  MapPin,
  Fuel,
  Gauge,
  MoreHorizontal
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatusBadge from '../home/StatusBadge';
const mockContracts = [
  {
    reservation_id: 'RES001',
    contract_number: 'CT001',
    customer_name: 'أحمد محمد الأحمد',
    customer_phone: '+971501234567',
    vehicle_model: 'تويوتا كامري 2024',
    vehicle_plate: 'Dubai A 12345',
    start_date: '2025-07-01',
    end_date: '2025-07-10',
    actual_start_date: '2025-07-01',
    actual_end_date: '2025-07-10',
    daily_rate: 200,
    total_estimated_amount: 2000,
    total_actual_amount: 2000,
    deposit_amount: 500,
    deposit_returned: true,
    mileage_at_start: 10000,
    mileage_at_end: 10200,
    fuel_level_at_start: 'Full',
    fuel_level_at_end: 'Half',
    status: 'completed',
    terms_and_conditions: 'Standard rental terms apply.',
    signed_by_customer: true,
    signed_by_employee: true,
    signature_date: '2025-07-01',
    pickup_location: 'فرع دبي الرئيسي',
    return_location: 'فرع دبي الرئيسي',
    created_at: '2025-06-30' // تاريخ انشاء العقد
  },
  {
    reservation_id: 'RES002',
    contract_number: 'CT002',
    customer_name: 'فاطمة علي السعيد',
    customer_phone: '+971507654321',
    vehicle_model: 'نيسان التيما 2023',
    vehicle_plate: 'Dubai B 67890',
    start_date: '2025-07-05',
    end_date: '2025-07-12',
    actual_start_date: '2025-07-05',
    actual_end_date: null,
    daily_rate: 180,
    total_estimated_amount: 1260,
    total_actual_amount: null,
    deposit_amount: 400,
    deposit_returned: false,
    mileage_at_start: 15000,
    mileage_at_end: null,
    fuel_level_at_start: 'Full',
    fuel_level_at_end: null,
    status: 'active',
    terms_and_conditions: 'Standard rental terms apply.',
    signed_by_customer: true,
    signed_by_employee: true,
    signature_date: '2025-07-05',
    pickup_location: 'فرع أبوظبي',
    return_location: 'فرع أبوظبي',
    created_at: '2025-07-04' // تاريخ انشاء العقد
  },
  {
    reservation_id: 'RES003',
    contract_number: 'CT003',
    customer_name: 'محمد خالد البلوشي',
    customer_phone: '+971509876543',
    vehicle_model: 'هونداي إلنترا 2024',
    vehicle_plate: 'Dubai C 1111',
    start_date: '2025-06-28',
    end_date: '2025-07-02',
    actual_start_date: '2025-06-28',
    actual_end_date: '2025-07-02',
    daily_rate: 150,
    total_estimated_amount: 750,
    total_actual_amount: 750,
    deposit_amount: 300,
    deposit_returned: true,
    mileage_at_start: 8000,
    mileage_at_end: 8150,
    fuel_level_at_start: 'Full',
    fuel_level_at_end: 'Quarter',
    status: 'cancelled',
    terms_and_conditions: 'Standard rental terms apply.',
    signed_by_customer: true,
    signed_by_employee: true,
    signature_date: '2025-06-28',
    pickup_location: 'فرع الشارقة',
    return_location: 'فرع الشارقة',
    created_at: '2025-06-27' // تاريخ انشاء العقد
  }
];
const AEDIcon = () => (
  <svg className='w-3 h-3 text-muted-foreground dark:fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 870" >
    <path d="m88.3 1c0.4 0.6 2.6 3.3 4.7 5.9 15.3 18.2 26.8 47.8 33 85.1 4.1 24.5 4.3 32.2 4.3 125.6v87h-41.8c-38.2 0-42.6-0.2-50.1-1.7-11.8-2.5-24-9.2-32.2-17.8-6.5-6.9-6.3-7.3-5.9 13.6 0.5 17.3 0.7 19.2 3.2 28.6 4 14.9 9.5 26 17.8 35.9 11.3 13.6 22.8 21.2 39.2 26.3 3.5 1 10.9 1.4 37.1 1.6l32.7 0.5v43.3 43.4l-46.1-0.3-46.3-0.3-8-3.2c-9.5-3.8-13.8-6.6-23.1-14.9l-6.8-6.1 0.4 19.1c0.5 17.7 0.6 19.7 3.1 28.7 8.7 31.8 29.7 54.5 57.4 61.9 6.9 1.9 9.6 2 38.5 2.4l30.9 0.4v89.6c0 54.1-0.3 94-0.8 100.8-0.5 6.2-2.1 17.8-3.5 25.9-6.5 37.3-18.2 65.4-35 83.6l-3.4 3.7h169.1c101.1 0 176.7-0.4 187.8-0.9 19.5-1 63-5.3 72.8-7.4 3.1-0.6 8.9-1.5 12.7-2.1 8.1-1.2 21.5-4 40.8-8.9 27.2-6.8 52-15.3 76.3-26.1 7.6-3.4 29.4-14.5 35.2-18 3.1-1.8 6.8-4 8.2-4.7 3.9-2.1 10.4-6.3 19.9-13.1 4.7-3.4 9.4-6.7 10.4-7.4 4.2-2.8 18.7-14.9 25.3-21 25.1-23.1 46.1-48.8 62.4-76.3 2.3-4 5.3-9 6.6-11.1 3.3-5.6 16.9-33.6 18.2-37.8 0.6-1.9 1.4-3.9 1.8-4.3 2.6-3.4 17.6-50.6 19.4-60.9 0.6-3.3 0.9-3.8 3.4-4.3 1.6-0.3 24.9-0.3 51.8-0.1 53.8 0.4 53.8 0.4 65.7 5.9 6.7 3.1 8.7 4.5 16.1 11.2 9.7 8.7 8.8 10.1 8.2-11.7-0.4-12.8-0.9-20.7-1.8-23.9-3.4-12.3-4.2-14.9-7.2-21.1-9.8-21.4-26.2-36.7-47.2-44l-8.2-3-33.4-0.4-33.3-0.5 0.4-11.7c0.4-15.4 0.4-45.9-0.1-61.6l-0.4-12.6 44.6-0.2c38.2-0.2 45.3 0 49.5 1.1 12.6 3.5 21.1 8.3 31.5 17.8l5.8 5.4v-14.8c0-17.6-0.9-25.4-4.5-37-7.1-23.5-21.1-41-41.1-51.8-13-7-13.8-7.2-58.5-7.5-26.2-0.2-39.9-0.6-40.6-1.2-0.6-0.6-1.1-1.6-1.1-2.4 0-0.8-1.5-7.1-3.5-13.9-23.4-82.7-67.1-148.4-131-197.1-8.7-6.7-30-20.8-38.6-25.6-3.3-1.9-6.9-3.9-7.8-4.5-4.2-2.3-28.3-14.1-34.3-16.6-3.6-1.6-8.3-3.6-10.4-4.4-35.3-15.3-94.5-29.8-139.7-34.3-7.4-0.7-17.2-1.8-21.7-2.2-20.4-2.3-48.7-2.6-209.4-2.6-135.8 0-169.9 0.3-169.4 1zm330.7 43.3c33.8 2 54.6 4.6 78.9 10.5 74.2 17.6 126.4 54.8 164.3 117 3.5 5.8 18.3 36 20.5 42.1 10.5 28.3 15.6 45.1 20.1 67.3 1.1 5.4 2.6 12.6 3.3 16 0.7 3.3 1 6.4 0.7 6.7-0.5 0.4-100.9 0.6-223.3 0.5l-222.5-0.2-0.3-128.5c-0.1-70.6 0-129.3 0.3-130.4l0.4-1.9h71.1c39 0 78 0.4 86.5 0.9zm297.5 350.3c0.7 4.3 0.7 77.3 0 80.9l-0.6 2.7-227.5-0.2-227.4-0.3-0.2-42.4c-0.2-23.3 0-42.7 0.2-43.1 0.3-0.5 97.2-0.8 227.7-0.8h227.2zm-10.2 171.7c0.5 1.5-1.9 13.8-6.8 33.8-5.6 22.5-13.2 45.2-20.9 62-3.8 8.6-13.3 27.2-15.6 30.7-1.1 1.6-4.3 6.7-7.1 11.2-18 28.2-43.7 53.9-73 72.9-10.7 6.8-32.7 18.4-38.6 20.2-1.2 0.3-2.5 0.9-3 1.3-0.7 0.6-9.8 4-20.4 7.8-19.5 6.9-56.6 14.4-86.4 17.5-19.3 1.9-22.4 2-96.7 2h-76.9v-129.7-129.8l220.9-0.4c121.5-0.2 221.6-0.5 222.4-0.7 0.9-0.1 1.8 0.5 2.1 1.2z" />
  </svg>
);
function ContractsTable() {
  return <>
    <Card className="shadow-lg border border-border bg-card backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-right font-semibold text-foreground">رقم العقد</TableHead>
                <TableHead className="text-right font-semibold text-foreground">تاريخ انشاء العقد</TableHead>
                <TableHead className="text-right font-semibold text-foreground">العميل</TableHead>
                <TableHead className="text-right font-semibold text-foreground">المركبة</TableHead>
                <TableHead className="text-right font-semibold text-foreground">تاريخ البدء</TableHead>
                <TableHead className="text-right font-semibold text-foreground">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right font-semibold text-foreground">المبلغ</TableHead>
                <TableHead className="text-right font-semibold text-foreground">الحالة</TableHead>
                <TableHead className="text-center font-semibold text-foreground">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContracts.map((contract) => (
                <TableRow
                  key={contract.contract_number}
                  className="hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-muted rounded-md">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{contract.contract_number}</p>
                        <p className="text-xs text-muted-foreground">{contract.reservation_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">{contract.created_at}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{contract.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{contract.customer_phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{contract.vehicle_model}</p>
                        <p className="text-xs text-muted-foreground">{contract.vehicle_plate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">{contract.start_date}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-foreground">{contract.end_date}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">{contract.total_estimated_amount} </span>
                      <AEDIcon />
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contract.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <Link href={`/contracts/${contract.contract_number}`}>

                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setSelectedContract(contract)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                          </Link>

                          <Link href={`/contracts/${contract.contract_number}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل العقد
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem className="cursor-pointer">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            تأكيد العقد
                          </DropdownMenuItem>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف العقد
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف العقد</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف العقد {contract.contract_number}؟ هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteContract(contract.contract_number)}
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    {mockContracts.length === 0 && (
      <Card className="shadow-md border border-border bg-card backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد عقود</h3>
          <p className="text-muted-foreground mb-6">لم يتم العثور على عقود تطابق البحث المحدد</p>
          <Link href="/contracts/new-contract">
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              إضافة عقد جديد
            </Button>
          </Link>
        </CardContent>
      </Card>
    )}
  </>
}

export default ContractsTable