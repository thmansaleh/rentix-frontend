'use client'
import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation'; // <-- Add this import
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Car, 
  CreditCard,
  MoreVertical,
  Download,
  Upload,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import ClientTableRow from './ClientTableRow';
import PageHeader from '@/components/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch clients data');
  }
  return response.json();
};

// Table components inline - shadcn/ui table components
const Table = ({ children, className = "" }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="border-b">
    {children}
  </thead>
);

const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">
    {children}
  </tbody>
);

const TableRow = ({ children }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    {children}
  </tr>
);

const TableHead = ({ children }) => (
  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="p-4 align-middle text-right">
    {children}
  </td>
);

const page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter(); // <-- Add this
  const t = useTranslations();
  const tClients = useTranslations('clients');
  const tForms = useTranslations('forms');
  const { isRTL } = useLanguage();

  // Use SWR for data fetching
  const { data: customers, error, isLoading, mutate } = useSWR('/api/clients.json', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000
  });

  const filteredCustomers = customers ? customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }) : [];

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

  const CustomerCard = ({ customer }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Avatar className="h-12 w-12">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className=" text-blue-600">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{customer.name}</h3>
              <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                {customer.status === 'active' ? 'نشط' : customer.status === 'inactive' ? 'غير نشط' : 'قيد الانتظار'}
              </Badge>
            </div>
          </div>
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
        </div>
        
        <div className="space-y-2 text-sm ">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            {customer.phone}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">عدد مرات التأجير</div>
            <div className="font-semibold flex items-center">
              <Car className="h-4 w-4 mr-1" />
              {customer.totalRentals}
            </div>
          </div>
          <div>
            <div className="text-gray-500">إجمالي الإنفاق</div>
            <div className="font-semibold flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              {customer.totalSpent}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`bg-background p-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="min-h-44 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <PageHeader 
            title={tClients('title')}
            description={isRTL ? "إدارة عملاء تأجير السيارات ومعلوماتهم" : "Manage car rental clients and their information"}
          >
            <Button onClick={() => router.push('clients/add')}>
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {tClients('addNew')}
            </Button>
          </PageHeader>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>جاري تحميل بيانات العملاء...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center text-red-600">
              <p>خطأ: {error.message}</p>
              <Button 
                onClick={() => mutate()} 
                className="mt-2"
                variant="outline"
              >
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Only show when not loading */}
        {!isLoading && !error && customers && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm ">إجمالي العملاء</p>
                    <p className="text-2xl font-bold">{customers.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm ">العملاء النشطون</p>
                    <p className="text-2xl font-bold">
                      {customers.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm ">إجمالي مرات التأجير</p>
                    <p className="text-2xl font-bold">
                      {customers.reduce((sum, c) => sum + c.totalRentals, 0)}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm ">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold">
                      {customers.reduce((sum, c) => sum + parseInt(c.totalSpent.replace(/[^\d]/g, '')), 0).toLocaleString()}  
                    </p>
                  </div>
                  <div className=" p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search - Only show when not loading */}
        {!isLoading && !error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
                    <Input
                      placeholder={isRTL ? "ابحث عن العملاء..." : "Search for clients..."}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10 text-left'} w-full sm:w-80`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus} dir={isRTL ? "rtl" : "ltr"}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <SelectValue placeholder={isRTL ? "تصفية حسب الحالة" : "Filter by status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isRTL ? "كل الحالات" : "All Status"}</SelectItem>
                      <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                      <SelectItem value="inactive">{isRTL ? "غير نشط" : "Inactive"}</SelectItem>
                      <SelectItem value="pending">{isRTL ? "قيد الانتظار" : "Pending"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer List - Only show when not loading */}
        {!isLoading && !error && (
          <Card>
            <CardHeader>
              <CardTitle>قائمة العملاء ({filteredCustomers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>التواصل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الانضمام</TableHead>
                    <TableHead>عدد مرات التأجير</TableHead>
                    <TableHead>إجمالي الإنفاق</TableHead>
                    <TableHead>آخر تأجير</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <ClientTableRow key={customer.id} customer={customer} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCustomers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد عملاء</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? "لا يوجد عملاء يطابقون الفلاتر الحالية."
                  : "ابدأ بإضافة أول عميل لك."
                }
              </p>
              <Link href="/add-new-client">
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عميل
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default page;