"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  IdCard, 
  BadgeCheck, 
  Globe, 
  Landmark,
  User,
  Car,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Ban,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ClientHeaderCard from "./ClientHeaderCard";
import StatsCards from "./StatsCards";
import PersonalTab from "./PersonalTab";
import DocumentsTab from "./DocumentsTab";
import BookingsTab from "./BookingsTab";
import HistoryTab from "./HistoryTab";

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id;
  
  // Mock client data - in real app, this would come from an API
  const [client, setClient] = useState({
    id: clientId,
    name_en: "othman saleh",
    name_ar: "عثمان صالح",
    email: "thman@email.com",
    phone: "+971 50 123 4567",
    address: " dubai",
    city: "Dubai",
    country: "UAE",
    id_number: "784-1990-1234567-1",
    id_expiry: "2028-12-31",
    driver_license_number: "DJ123456789",
    driver_license_expiry: "2026-06-15",
    driver_license_issue: "2021-06-15",
    license_country: "UAE",
    license_city: "Dubai",
    date_of_birth: "1990-05-15",
    registration_date: "2024-01-15",
    membership_level: "Gold",
    blacklisted: false,
    blacklist_reason: "",
    avatar: null,
    total_bookings: 12,
    active_bookings: 2,
    total_spent: 15750,
    last_booking: "2024-12-01"
  });

  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEdit = () => {
    router.push(`/clients/${clientId}/edit`);
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Delete client:', clientId);
    router.push('/clients');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center cursor-pointer gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </Button>
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">تفاصيل العميل</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} className="flex items-center cursor-pointer gap-2">
            <Edit className="w-4 h-4 " />
            تعديل
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex cursor-pointer items-center gap-2">
            <Trash2 className="w-4 h-4 " />
            حذف
          </Button>
        </div>
      </div>

      {/* Client Header Card */}
      <ClientHeaderCard client={client} getInitials={getInitials} formatDate={formatDate} />

      {/* Stats Cards */}
      <StatsCards client={client} formatDate={formatDate} />

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="personal" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-4" dir="rtl">
          <TabsTrigger value="personal" className="text-right">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="documents" className="text-right">الوثائق</TabsTrigger>
          <TabsTrigger value="bookings" className="text-right">الحجوزات</TabsTrigger>
          <TabsTrigger value="history" className="text-right">السجل</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" dir="rtl">
          <PersonalTab client={client} formatDate={formatDate} />
        </TabsContent>
        <TabsContent value="documents" dir="rtl">
          <DocumentsTab client={client} formatDate={formatDate} />
        </TabsContent>
        <TabsContent value="bookings" dir="rtl">
          <BookingsTab />
        </TabsContent>
        <TabsContent value="history" dir="rtl">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
