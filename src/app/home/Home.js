'use client';
import React, { useState } from 'react';
import {
  Car,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCards from './StatsCards';
import RecentRentals from './RecentRentals';
import FleetOverview from './FleetOverview';
import { Chart } from './Chart';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import PageHeader from '@/components/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';



const mockRecentRentals = [
  {
    id: 1,
    customer: "خالد المنصوري",
    vehicle: "تويوتا كامري 2023",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    status: "available",
    amount: 450,
    phone: "+971 50 123 4567",
    email: "khalid.mansouri@email.com"
  },
  {
    id: 2,
    customer: "فاطمة الشامسي",
    vehicle: "بي إم دبليو X5 2022",
    startDate: "2024-01-14",
    endDate: "2024-01-18",
    status: "rented",
    amount: 720,
    phone: "+971 55 234 5678",
    email: "fatima.shamsi@email.com"
  },
  {
    id: 3,
    customer: "سعيد المهيري",
    vehicle: "هوندا سيفيك 2023",
    startDate: "2024-01-16",
    endDate: "2024-01-22",
    status: "active",
    amount: 380,
    phone: "+971 52 345 6789",
    email: "saeed.almehairi@email.com"
  },
  {
    id: 4,
    customer: "مريم السويدي",
    vehicle: "مرسيدس C-Class 2022",
    startDate: "2024-01-13",
    endDate: "2024-01-17",
    status: "completed",
    amount: 650,
    phone: "+971 56 456 7890",
    email: "maryam.suwaidi@email.com"
  }
];

const mockVehicles = [
  {
    id: 1,
    make: "تويوتا",
    model: "كامري",
    year: 2023,
    status: "rented",
    dailyRate: 85,
    location: "وسط المدينة",
    mileage: 15420
  },
  {
    id: 2,
    make: "بي إم دبليو",
    model: "X5",
    year: 2022,
    status: "available",
    dailyRate: 150,
    location: "المطار",
    mileage: 28540
  },
  {
    id: 3,
    make: "هوندا",
    model: "سيفيك",
    year: 2023,
    status: "maintenance",
    dailyRate: 65,
    location: "مركز الخدمة",
    mileage: 12880
  },
  {
    id: 4,
    make: "مرسيدس",
    model: "C-Class",
    year: 2022,
    status: "rented",
    dailyRate: 120,
    location: "مركز المدينة",
    mileage: 22150
  }
];




export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const t = useTranslations();
  const tDashboard = useTranslations('dashboard');
  const { isRTL } = useLanguage();

  const filteredRentals = mockRecentRentals.filter(rental =>
    rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || rental.status === filterStatus)
  );

  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isRTL ? 'text-right' : 'text-left'}`} >
      {/* العنوان */}
      <PageHeader 
        title={tDashboard('title')}
        description={isRTL ? "مرحباً بعودتك! إليك ملخص ما يحدث في أعمال تأجير السيارات الخاصة بك." : "Welcome back! Here's what's happening with your car rental business."}
      />

      {/* بطاقات الإحصائيات */}
      <StatsCards />

    
      <Chart/>

      {/* الإيجارات الأخيرة */}
      {/* <RecentRentals rentals={filteredRentals} /> */}

      {/* نظرة عامة على الأسطول */}
      {/* <FleetOverview vehicles={filteredVehicles} /> */}
    </div>
  );
}