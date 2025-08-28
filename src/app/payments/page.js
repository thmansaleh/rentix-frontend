'use client';
import { DollarSign, PlusCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const payments = [
  {
    id: 'PAY-001',
    client: 'أحمد علي',
    date: '2025-07-01',
    amount: 1200,
    status: 'تم الدفع',
  },
  {
    id: 'PAY-002',
    client: 'سارة محمد',
    date: '2025-07-03',
    amount: 850,
    status: 'قيد الانتظار',
  },
];

const statusColor = {
  'تم الدفع': 'success',
  'قيد الانتظار': 'secondary',
};

export default function PaymentsPage() {
  return (
    <div className="p-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <DollarSign size={22} className="text-blue-700" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900">المدفوعات</h2>
        </div>
        <Button className="gap-2" variant="default">
          <PlusCircle size={18} />
          إضافة دفعة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الدفعة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.amount} ر.س</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[payment.status]}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="text-blue-600 p-0 h-auto">عرض</Button>
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    لا توجد مدفوعات حالياً.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}