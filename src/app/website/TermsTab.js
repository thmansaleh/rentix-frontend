'use client'

import React, { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Shield, 
  Eye,
  Plus, 
  Trash2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

function TermsTab() {
  const t = useTranslations();
  const [termsData, setTermsData] = useState({
    introduction: '',
    generalTerms: '',
    userRights: '',
    userResponsibilities: '',
    paymentTerms: '',
    cancellationPolicy: '',
    privacyPolicy: '',
    liabilityLimitation: '',
    disputeResolution: '',
    modifications: '',
    contactInfo: '',
    effectiveDate: '',
    lastUpdated: '',
    sections: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allData, setAllData] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/website-content')
      .then(r => r.json())
      .then(data => { 
        if (mounted) { 
          setAllData(data); 
          const terms = data.termsData || {};
          setTermsData({
            introduction: terms.introduction || '',
            generalTerms: terms.generalTerms || '',
            userRights: terms.userRights || '',
            userResponsibilities: terms.userResponsibilities || '',
            paymentTerms: terms.paymentTerms || '',
            cancellationPolicy: terms.cancellationPolicy || '',
            privacyPolicy: terms.privacyPolicy || '',
            liabilityLimitation: terms.liabilityLimitation || '',
            disputeResolution: terms.disputeResolution || '',
            modifications: terms.modifications || '',
            contactInfo: terms.contactInfo || '',
            effectiveDate: terms.effectiveDate || '',
            lastUpdated: terms.lastUpdated || new Date().toISOString().split('T')[0],
            sections: terms.sections || []
          });
        } 
      })
      .catch(() => { 
        if (mounted) {
          setMessage('فشل في تحميل البيانات');
          setMessageType('error');
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const updateField = (field, value) => {
    setTermsData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomSection = () => {
    setTermsData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const updateCustomSection = (index, field, value) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeCustomSection = (index) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const getCharacterCount = (text) => text?.length || 0;
  const getMaxLength = (field) => {
    switch (field) {
      case 'introduction': return 800;
      case 'generalTerms': return 1500;
      case 'userRights': return 1000;
      case 'userResponsibilities': return 1000;
      case 'paymentTerms': return 1200;
      case 'cancellationPolicy': return 800;
      case 'privacyPolicy': return 1500;
      case 'liabilityLimitation': return 1000;
      case 'disputeResolution': return 800;
      case 'modifications': return 500;
      case 'contactInfo': return 300;
      default: return 1000;
    }
  };

  const validateForm = () => {
    if (!termsData.introduction.trim()) {
      setMessage('المقدمة مطلوبة');
      setMessageType('error');
      return false;
    }
    if (!termsData.generalTerms.trim()) {
      setMessage('الشروط العامة مطلوبة');
      setMessageType('error');
      return false;
    }
    if (!termsData.effectiveDate) {
      setMessage('تاريخ السريان مطلوب');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validateForm() || !allData) return;
    
    setSaving(true); 
    setMessage(null);
    
    try {
      const updatedData = {
        ...allData,
        termsData: {
          ...termsData,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      };
      
      const res = await fetch('/api/website-content', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(updatedData) 
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'خطأ في الحفظ');
      
      setAllData(json.data);
      setMessage('تم حفظ الشروط والأحكام بنجاح');
      setMessageType('success');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage(e.message || 'فشل في الحفظ');
      setMessageType('error');
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) {
    return (
      <TabsContent value="terms">
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="terms">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('website.termsTab', 'الشروط والأحكام')}</h2>
            <p className="text-muted-foreground">إدارة الشروط والأحكام وسياسات الشركة</p>
          </div>
        </div>

        {message && (
          <Alert className={messageType === 'error' ? 'border-destructive bg-destructive/10' : 'border-green-500 bg-green-50'}>
            {messageType === 'error' ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={messageType === 'error' ? 'text-destructive' : 'text-green-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Document Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle>معلومات الوثيقة</CardTitle>
            </div>
            <CardDescription>تواريخ السريان والتحديث</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">تاريخ السريان *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={termsData.effectiveDate}
                  onChange={(e) => updateField('effectiveDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastUpdated">آخر تحديث</Label>
                <Input
                  id="lastUpdated"
                  type="date"
                  value={termsData.lastUpdated}
                  onChange={(e) => updateField('lastUpdated', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Introduction */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle>المقدمة</CardTitle>
              </div>
              <CardDescription>مقدمة عامة عن الشروط والأحكام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.introduction}
                onChange={(e) => updateField('introduction', e.target.value)}
                rows={5}
                maxLength={getMaxLength('introduction')}
                placeholder="مرحباً بكم في شركتنا. هذه الشروط والأحكام تحكم استخدامكم لخدماتنا..."
                className="resize-none"
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>مقدمة مطلوبة</span>
                <Badge variant={getCharacterCount(termsData.introduction) > getMaxLength('introduction') * 0.9 ? 'destructive' : 'secondary'}>
                  {getCharacterCount(termsData.introduction)}/{getMaxLength('introduction')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* General Terms */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                <CardTitle>الشروط العامة</CardTitle>
              </div>
              <CardDescription>الشروط والأحكام العامة للخدمة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.generalTerms}
                onChange={(e) => updateField('generalTerms', e.target.value)}
                rows={8}
                maxLength={getMaxLength('generalTerms')}
                placeholder="بإستخدام خدماتنا، فإنكم توافقون على الالتزام بهذه الشروط..."
                className="resize-none"
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>شروط عامة مطلوبة</span>
                <Badge variant={getCharacterCount(termsData.generalTerms) > getMaxLength('generalTerms') * 0.9 ? 'destructive' : 'secondary'}>
                  {getCharacterCount(termsData.generalTerms)}/{getMaxLength('generalTerms')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle>حقوق المستخدم</CardTitle>
              </div>
              <CardDescription>حقوق العملاء والمستخدمين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.userRights}
                onChange={(e) => updateField('userRights', e.target.value)}
                rows={6}
                maxLength={getMaxLength('userRights')}
                placeholder="لديكم الحق في الحصول على خدمة عالية الجودة..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.userRights)}/{getMaxLength('userRights')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle>مسؤوليات المستخدم</CardTitle>
              </div>
              <CardDescription>التزامات ومسؤوليات العملاء</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.userResponsibilities}
                onChange={(e) => updateField('userResponsibilities', e.target.value)}
                rows={6}
                maxLength={getMaxLength('userResponsibilities')}
                placeholder="يتعين عليكم الالتزام بالقوانين المحلية..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.userResponsibilities)}/{getMaxLength('userResponsibilities')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>شروط الدفع</CardTitle>
              <CardDescription>سياسات وشروط الدفع والرسوم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.paymentTerms}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
                rows={6}
                maxLength={getMaxLength('paymentTerms')}
                placeholder="الدفع مطلوب مقدماً، نقبل جميع وسائل الدفع..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.paymentTerms)}/{getMaxLength('paymentTerms')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <CardHeader>
              <CardTitle>سياسة الإلغاء</CardTitle>
              <CardDescription>شروط وأحكام إلغاء الحجوزات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.cancellationPolicy}
                onChange={(e) => updateField('cancellationPolicy', e.target.value)}
                rows={6}
                maxLength={getMaxLength('cancellationPolicy')}
                placeholder="يمكن إلغاء الحجز قبل 24 ساعة..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.cancellationPolicy)}/{getMaxLength('cancellationPolicy')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <CardTitle>سياسة الخصوصية</CardTitle>
              </div>
              <CardDescription>كيفية جمع واستخدام وحماية البيانات الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.privacyPolicy}
                onChange={(e) => updateField('privacyPolicy', e.target.value)}
                rows={8}
                maxLength={getMaxLength('privacyPolicy')}
                placeholder="نحترم خصوصيتكم ونحمي بياناتكم الشخصية..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.privacyPolicy)}/{getMaxLength('privacyPolicy')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Liability Limitation */}
          <Card>
            <CardHeader>
              <CardTitle>تحديد المسؤولية</CardTitle>
              <CardDescription>حدود مسؤولية الشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.liabilityLimitation}
                onChange={(e) => updateField('liabilityLimitation', e.target.value)}
                rows={6}
                maxLength={getMaxLength('liabilityLimitation')}
                placeholder="مسؤولية الشركة محدودة بقيمة الخدمة..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.liabilityLimitation)}/{getMaxLength('liabilityLimitation')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle>تسوية النزاعات</CardTitle>
              <CardDescription>كيفية حل الخلافات والنزاعات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.disputeResolution}
                onChange={(e) => updateField('disputeResolution', e.target.value)}
                rows={6}
                maxLength={getMaxLength('disputeResolution')}
                placeholder="في حالة حدوث نزاع، سيتم حله عبر التحكيم..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.disputeResolution)}/{getMaxLength('disputeResolution')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>التعديلات</CardTitle>
              <CardDescription>كيفية تعديل الشروط والأحكام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.modifications}
                onChange={(e) => updateField('modifications', e.target.value)}
                rows={4}
                maxLength={getMaxLength('modifications')}
                placeholder="نحتفظ بالحق في تعديل هذه الشروط في أي وقت..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.modifications)}/{getMaxLength('modifications')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
              <CardDescription>كيفية التواصل لاستفسارات الشروط والأحكام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={termsData.contactInfo}
                onChange={(e) => updateField('contactInfo', e.target.value)}
                rows={3}
                maxLength={getMaxLength('contactInfo')}
                placeholder="للاستفسارات حول هذه الشروط، يرجى التواصل معنا على..."
                className="resize-none"
              />
              <div className="text-right">
                <Badge variant="outline">
                  {getCharacterCount(termsData.contactInfo)}/{getMaxLength('contactInfo')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>أقسام إضافية</CardTitle>
                <CardDescription>إضافة أقسام مخصصة للشروط والأحكام</CardDescription>
              </div>
              <Button variant="outline" onClick={addCustomSection}>
                <Plus className="mr-2 h-4 w-4" />
                إضافة قسم
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {termsData.sections.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                لا توجد أقسام إضافية. انقر على "إضافة قسم" لإنشاء قسم جديد.
              </div>
            ) : (
              termsData.sections.map((section, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">القسم {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomSection(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>عنوان القسم</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                        placeholder="عنوان القسم"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>محتوى القسم</Label>
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                        rows={5}
                        placeholder="محتوى القسم..."
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            آخر تحديث: {new Date(termsData.lastUpdated).toLocaleDateString('ar-SA')}
          </div>
          <Button 
            onClick={save} 
            disabled={saving || loading}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

export default TermsTab;
