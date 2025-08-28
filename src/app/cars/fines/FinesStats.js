import { Card, CardContent } from '@/components/ui/card';
import { Files } from 'lucide-react';

export default function FinesStats({ fines }) {
    return (
        <Card className="mb-6">
            <CardContent className="p-4 flex flex-col md:flex-row gap-3 justify-between">
                {/* Total fines */}
                <div className="flex flex-col items-center  rounded px-4 py-3 min-w-[120px]">
                    <Files className="text-blue-600 mb-1" size={20} />
                    <span className="text-sm  font-medium">إجمالي المخالفات</span>
                    <span className="text-2xl font-extrabold text-gray-900">{fines.length}</span>
                </div>
                {/* Paid fines */}
                <div className="flex flex-col items-center  rounded px-4 py-3 min-w-[120px]">
                    <Files className="text-green-600 mb-1" size={20} />
                    <span className="text-sm  font-medium">المخالفات المدفوعة</span>
                    <span className="text-2xl font-extrabold text-green-600">{fines.filter(f => f.status === 'paid').length}</span>
                </div>
                {/* Unpaid fines */}
                <div className="flex flex-col items-center  rounded px-4 py-3 min-w-[120px]">
                    <Files className="text-red-600 mb-1" size={20} />
                    <span className="text-sm  font-medium">المخالفات غير المدفوعة</span>
                    <span className="text-2xl font-extrabold text-red-600">{fines.filter(f => f.status === 'unpaid').length}</span>
                </div>
                {/* Unpaid fines value */}
                <div className="flex flex-col items-center  rounded px-4 py-3 min-w-[120px]">
                    <Files className="text-yellow-600 mb-1" size={20} />
                    <span className="text-sm  font-medium">قيمة المخالفات غير المدفوعة</span>
                    <span className="text-2xl font-extrabold text-yellow-600">
                        {fines.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0)} درهم
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}