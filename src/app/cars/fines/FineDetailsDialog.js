import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { User, Calendar, MapPin, FileText, DollarSign, CreditCard, Hash, Car } from 'lucide-react';

// Status configuration for better maintainability
const STATUS_CONFIG = {
  paid: {
    label: 'مدفوع',
    className: 'text-green-600 bg-green-50 border border-green-200',
    icon: '✓'
  },
  unpaid: {
    label: 'غير مدفوع',
    className: 'text-red-600 bg-red-50 border border-red-200',
    icon: '✗'
  }
};

// Field configuration with icons and formatting
const FIELD_CONFIG = [
  {
    key: 'id',
    label: 'رقم المخالفة',
    icon: Hash,
    render: (value) => value
  },
  {
    key: 'carPlate',
    label: 'رقم اللوحة',
    icon: Car,
    render: (value) => (
      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm border">
        {value}
      </span>
    )
  },
  {
    key: 'clientName',
    label: 'اسم العميل',
    icon: User,
    render: (value, fine, router) => (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium">{value}</span>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-2"
          onClick={() => router.push(`/clients/${fine.clientId}`)}
        >
          عرض العميل
        </Button>
      </div>
    )
  },
  {
    key: 'amount',
    label: 'المبلغ',
    icon: DollarSign,
    render: (value) => (
      <span className="text-green-700 font-bold text-lg">
        {Number(value).toLocaleString('ar-AE')} درهم
      </span>
    )
  },
  {
    key: 'date',
    label: 'التاريخ',
    icon: Calendar,
    render: (value) => (
      <span className="font-mono text-sm">
        {new Date(value).toLocaleDateString('ar-AE')}
      </span>
    )
  },
  {
    key: 'reason',
    label: 'السبب',
    icon: FileText,
    render: (value) => (
      <span className="text-gray-800 leading-relaxed">{value}</span>
    )
  },
  {
    key: 'emirate',
    label: 'الإمارة',
    icon: MapPin,
    render: (value) => value
  },
  {
    key: 'source',
    label: 'المصدر',
    icon: CreditCard,
    render: (value) => value
  }
];

export default function FineDetailsDialog({ open, onOpenChange, fine }) {
  const router = useRouter();
  
  if (!fine) return null;

  const statusConfig = STATUS_CONFIG[fine.status] || STATUS_CONFIG.unpaid;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleClientView = (e) => {
    e.preventDefault();
    router.push(`/clients/${fine.clientId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        dir="rtl" 
        className="text-right max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby="fine-details-description"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5" />
            تفاصيل المخالفة
          </DialogTitle>
          <p id="fine-details-description" className="text-sm text-gray-600 sr-only">
            عرض تفاصيل المخالفة رقم {fine.id}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-start">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${statusConfig.className}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <tbody>
                {FIELD_CONFIG.map((field, index) => {
                  const Icon = field.icon;
                  const value = fine[field.key];
                  
                  if (!value) return null;

                  return (
                    <tr 
                      key={field.key} 
                      className={`border-b last:border-b-0 hover:bg-gray-25 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="font-semibold text-gray-700 p-4 w-1/3 align-top">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span>{field.label}</span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        {field.render(value, fine, router)}
                      </td>
                    </tr>
                  );
                })}
                
                {/* Status Row */}
                <tr className={`border-b last:border-b-0 hover:bg-gray-25 transition-colors ${
                  FIELD_CONFIG.length % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}>
                  <td className="font-semibold text-gray-700 p-4 w-1/3 align-top">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span>الحالة</span>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm font-medium ${statusConfig.className}`}>
                      <span>{statusConfig.icon}</span>
                      <span>{statusConfig.label}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="flex flex-row-reverse gap-2 pt-4 border-t">
          <Button 
            onClick={handleClose}
            className="min-w-[100px]"
          >
            إغلاق
          </Button>
          {fine.clientId && (
            <Button 
              variant="outline" 
              onClick={handleClientView}
              className="min-w-[120px]"
            >
              <User className="w-4 h-4 ml-2" />
              عرض العميل
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}