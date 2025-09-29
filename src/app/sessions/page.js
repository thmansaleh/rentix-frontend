'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  Scale
} from 'lucide-react';

const SessionsPage = () => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for court sessions
  const sessions = [
    {
      id: 1,
      caseTitle: "قضية عقد إيجار السيارة رقم 2024/001",
      caseNumber: "2024/001",
      sessionDate: "2024-02-10",
      sessionTime: "10:00 AM",
      courtRoom: "القاعة الأولى",
      judge: "القاضي أحمد محمد السلطان",
      status: "scheduled",
      attendees: ["المحامي سالم الكعبي", "العميل أحمد العلي"],
      sessionType: "جلسة مرافعة",
      notes: "مراجعة الأدلة والوثائق المقدمة"
    },
    {
      id: 2,
      caseTitle: "قضية مطالبة مالية رقم 2024/002",
      caseNumber: "2024/002",
      sessionDate: "2024-02-15",
      sessionTime: "2:00 PM",
      courtRoom: "القاعة الثانية",
      judge: "القاضية فاطمة النعيمي",
      status: "scheduled",
      attendees: ["المحامية عائشة الزهراني", "العميلة فاطمة النعيمي"],
      sessionType: "جلسة صلح",
      notes: "محاولة الوصول إلى تسوية ودية"
    },
    {
      id: 3,
      caseTitle: "قضية إنهاء عقد رقم 2024/003",
      caseNumber: "2024/003",
      sessionDate: "2024-01-28",
      sessionTime: "11:30 AM",
      courtRoom: "القاعة الثالثة",
      judge: "القاضي محمد الكعبي",
      status: "completed",
      attendees: ["المحامي خالد السلطان", "العميل محمد الكعبي"],
      sessionType: "جلسة حكم",
      notes: "تم إصدار الحكم النهائي في القضية"
    },
    {
      id: 4,
      caseTitle: "قضية تأمين السيارة رقم 2024/004",
      caseNumber: "2024/004",
      sessionDate: "2024-02-12",
      sessionTime: "9:00 AM",
      courtRoom: "القاعة الأولى",
      judge: "القاضي سعد الراشد",
      status: "postponed",
      attendees: ["المحامي يوسف الهاجري", "العميلة عائشة الزهراني"],
      sessionType: "جلسة استماع",
      notes: "تأجيل الجلسة لتقديم مستندات إضافية"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { 
        label: 'مجدولة', 
        variant: 'default',
        icon: <Calendar className="w-3 h-3" />
      },
      completed: { 
        label: 'مكتملة', 
        variant: 'secondary',
        icon: <CheckCircle className="w-3 h-3" />
      },
      postponed: { 
        label: 'مؤجلة', 
        variant: 'destructive',
        icon: <AlertCircle className="w-3 h-3" />
      },
      cancelled: { 
        label: 'ملغية', 
        variant: 'outline',
        icon: <AlertCircle className="w-3 h-3" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getSessionTypeBadge = (type) => {
    const typeColors = {
      'جلسة مرافعة': 'bg-blue-100 text-blue-800',
      'جلسة صلح': 'bg-green-100 text-green-800',
      'جلسة حكم': 'bg-purple-100 text-purple-800',
      'جلسة استماع': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.judge.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title={t('navigation.sessions')} 
          description="إدارة ومتابعة جلسات المحاكم والمواعيد القضائية"
        />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الجلسات
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات المجدولة
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                الأسبوع القادم
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات المكتملة
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات المؤجلة
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                هذا الشهر
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="البحث في الجلسات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="scheduled">مجدولة</option>
                  <option value="completed">مكتملة</option>
                  <option value="postponed">مؤجلة</option>
                  <option value="cancelled">ملغية</option>
                </select>
              </div>
              
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إضافة جلسة جديدة
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Sessions List */}
        <div className="grid gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{session.caseTitle}</CardTitle>
                    <CardDescription>{session.notes}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(session.status)}
                    {getSessionTypeBadge(session.sessionType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">رقم القضية: {session.caseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(session.sessionDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{session.sessionTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{session.courtRoom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{session.judge}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{session.attendees.length} حاضر</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">الحاضرون:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.attendees.map((attendee, index) => (
                      <Badge key={index} variant="outline">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد جلسات</h3>
              <p className="text-muted-foreground">لم يتم العثور على جلسات تطابق معايير البحث</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;