'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, Calendar, Car, CreditCard, MoreVertical, Eye, Edit, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const ClientTableRow = ({ customer }) => {
  const router = useRouter();
  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle text-right">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm flex items-center justify-center">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className='mr-2'>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 ml-1" />
            {customer.phone}
          </div>
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        <Badge className={`${getStatusColor(customer.status)}`}>
          {customer.status === 'active' ? 'نشط' : customer.status === 'inactive' ? 'غير نشط' : 'قيد الانتظار'}
        </Badge>
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 ml-1" />
          {new Date(customer.joinDate).toLocaleDateString('en')}
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex items-center">
          <Car className="h-4 w-4 ml-1" />
          {customer.totalRentals}
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex items-center font-medium">
          <CreditCard className="h-4 w-4 ml-1" />
          {customer.totalSpent} درهم
        </div>
      </td>
      <td className="p-4 align-middle text-right">
        {customer.lastRental ? (
          <div className="text-sm">
            {new Date(customer.lastRental).toLocaleDateString('en')}
          </div>
        ) : (
          <span className="text-gray-400">لم يؤجر بعد</span>
        )}
      </td>
      <td className="p-4 align-middle text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/clients/${customer.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/clients/${customer.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              تعديل العميل
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              حذف العميل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default ClientTableRow;