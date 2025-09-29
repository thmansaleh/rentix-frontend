'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gavel, 
  Calendar, 
  FileText, 
  User, 
  Scale, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const JudgmentsPage = () => {
  const { isRTL } = useLanguage();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for judgments
  const judgments = [
    {
      id: 1,
      caseTitle: "قضية عقد إيجار السيارة رقم 2024/001",
      caseNumber: "2024/001",
      judgmentNumber: "ح/2024/001",
      judgmentDate: "2024-01-28",
      judge: "القاضي أحمد محمد السلطان",
      courtName: "محكمة الدرجة الأولى - الرياض",
      judgmentType: "حكم نهائي",
      status: "final",
      summary: "الحكم لصالح المدعي بالزام المدعى عليه بدفع مبلغ 15,000 ريال كتعويض عن الأضرار",
      executionStatus: "executed",
      appealDeadline: "2024-02-28",
      documentUrl: "/documents/judgment_001.pdf"
    },
    {
      id: 2,
      caseTitle: "قضية مطالبة مالية رقم 2024/002",
      caseNumber: "2024/002",
      judgmentNumber: "ح/2024/002",
      judgmentDate: "2024-02-05",
      judge: "القاضية فاطمة النعيمي",
      courtName: "محكمة الدرجة الأولى - جدة",
      judgmentType: "حكم ابتدائي",
      status: "pending_appeal",
      summary: "الحكم لصالح المدعية بالزام المدعى عليه بدفع مبلغ 25,000 ريال مع الفوائد القانونية",
      executionStatus: "pending",
      appealDeadline: "2024-03-05",
      documentUrl: "/documents/judgment_002.pdf"
    },
    {
      id: 3,
      caseTitle: "قضية إنهاء عقد رقم 2024/003",
      caseNumber: "2024/003",
      judgmentNumber: "ح/2024/003",
      judgmentDate: "2024-02-10",
      judge: "القاضي محمد الكعبي",
      courtName: "محكمة الدرجة الأولى - الدمام",
      judgmentType: "حكم نهائي",
      status: "final",
      summary: "رفض الدعوى لعدم توفر الأدلة الكافية",
      executionStatus: "not_applicable",
      appealDeadline: "انتهت مدة الاستئناف",
      documentUrl: "/documents/judgment_003.pdf"
    },
    {
      id: 4,
      caseTitle: "قضية تأمين السيارة رقم 2024/004",
      caseNumber: "2024/004",
      judgmentNumber: "ح/2024/004",
      judgmentDate: "2024-02-15",
      judge: "القاضي سعد الراشد",
      courtName: "محكمة الدرجة الأولى - مكة",
      judgmentType: "حكم ابتدائي",
      status: "appealed",
      summary: "الحكم لصالح المدعية بالزام شركة التأمين بدفع مبلغ 50,000 ريال",
      executionStatus: "suspended",
      appealDeadline: "تم الاستئناف",
      documentUrl: "/documents/judgment_004.pdf"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      final: { 
        label: 'نهائي', 
        variant: 'default',
        icon: <CheckCircle className="w-3 h-3" />
      },
      pending_appeal: { 
        label: 'قابل للاستئناف', 
        variant: 'secondary',
        icon: <Clock className="w-3 h-3" />
      },
      appealed: { 
        label: 'تم الاستئناف', 
        variant: 'destructive',
        icon: <AlertTriangle className="w-3 h-3" />
      },
      draft: { 
        label: 'مسودة', 
        variant: 'outline',
        icon: <FileText className="w-3 h-3" />
      }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getExecutionStatusBadge = (status) => {
    const statusConfig = {
      executed: { label: 'تم التنفيذ', className: 'bg-green-100 text-green-800' },
      pending: { label: 'قيد التنفيذ', className: 'bg-yellow-100 text-yellow-800' },
      suspended: { label: 'معلق', className: 'bg-red-100 text-red-800' },
      not_applicable: { label: 'غير قابل للتنفيذ', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getJudgmentTypeBadge = (type) => {
    const typeColors = {
      'حكم نهائي': 'bg-blue-100 text-blue-800',
      'حكم ابتدائي': 'bg-purple-100 text-purple-800',
      'حكم استئناف': 'bg-orange-100 text-orange-800',
      'حكم تمييز': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const filteredJudgments = judgments.filter(judgment => {
    const matchesSearch = judgment.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         judgment.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         judgment.judgmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         judgment.judge.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || judgment.status === filterStatus;
    
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
          title={t('navigation.issuedJudgments')} 
          description="إدارة ومتابعة الأحكام القضائية الصادرة وحالة تنفيذها"
        />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الأحكام
              </CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                منذ بداية العام
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الأحكام النهائية
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                50.5% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                قيد الاستئناف
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                13.4% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                تم التنفيذ
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                71% من الأحكام القابلة للتنفيذ
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
                    placeholder="البحث في الأحكام..."
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
                  <option value="final">نهائي</option>
                  <option value="pending_appeal">قابل للاستئناف</option>
                  <option value="appealed">تم الاستئناف</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
              
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إضافة حكم جديد
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Judgments List */}
        <div className="grid gap-6">
          {filteredJudgments.map((judgment) => (
            <Card key={judgment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{judgment.caseTitle}</CardTitle>
                    <CardDescription>{judgment.summary}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(judgment.status)}
                    {getJudgmentTypeBadge(judgment.judgmentType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">رقم القضية: {judgment.caseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">رقم الحكم: {judgment.judgmentNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(judgment.judgmentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{judgment.judge}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{judgment.courtName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">الاستئناف: {judgment.appealDeadline}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">حالة التنفيذ:</span>
                    {getExecutionStatusBadge(judgment.executionStatus)}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل الحكم
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJudgments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Gavel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد أحكام</h3>
              <p className="text-muted-foreground">لم يتم العثور على أحكام تطابق معايير البحث</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JudgmentsPage;