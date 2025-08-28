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
import { useTranslations } from '@/hooks/useTranslations';
import { useAboutContent } from '@/hooks/useAboutContent';
import { Save, AlertCircle, CheckCircle2, Building2, Target, Eye, Heart } from 'lucide-react';

function AboutTab() {
  const t = useTranslations();
  const { data: aboutData, error, isLoading, updateAboutContent } = useAboutContent();
  const [localData, setLocalData] = useState(aboutData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Update local state when SWR data changes
  useEffect(() => {
    if (aboutData) {
      setLocalData(aboutData);
    }
  }, [aboutData]);

  const updateField = (field, lang, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  const getCharacterCount = (text) => text?.length || 0;
  const getMaxLength = (field) => {
    switch (field) {
      case 'companyOverview': return 1000;
      case 'mission': return 500;
      case 'vision': return 500;
      case 'values': return 800;
      default: return 100;
    }
  };

  const validateForm = () => {
    if (!localData?.companyOverview?.ar?.trim() && !localData?.companyOverview?.en?.trim()) {
      setMessage(t('website.aboutSection.validationError'));
      setMessageType('error');
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validateForm() || !localData) return;
    
    setSaving(true); 
    setMessage(null);
    
    try {
      const result = await updateAboutContent(localData);
      
      if (result.success) {
        setMessage(t('website.aboutSection.saveSuccess'));
        setMessageType('success');
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(result.error || t('website.aboutSection.saveError'));
      }
    } catch (e) {
      setMessage(e.message || t('website.aboutSection.saveError'));
      setMessageType('error');
    } finally { 
      setSaving(false); 
    }
  };

  if (isLoading || !localData) {
    return (
      <TabsContent value="about">
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
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
    <TabsContent value="about">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('website.aboutSection.title')}</h2>
            <p className="text-muted-foreground">{t('website.aboutSection.description')}</p>
          </div>
          {error && (
            <Badge variant="destructive" className="mr-auto">
              <AlertCircle className="h-4 w-4 mr-1" />
              {t('website.aboutSection.loadingError')}
            </Badge>
          )}
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Company Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{t('website.aboutSection.companyOverview.title')}</CardTitle>
              </div>
              <CardDescription>{t('website.aboutSection.companyOverview.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.arabicText')}</Label>
                  <Badge variant="secondary">AR</Badge>
                </div>
                <Textarea
                  value={localData?.companyOverview?.ar || ''}
                  onChange={(e) => updateField('companyOverview', 'ar', e.target.value)}
                  rows={6}
                  maxLength={getMaxLength('companyOverview')}
                  placeholder={t('website.aboutSection.companyOverview.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span></span>
                  <Badge variant={getCharacterCount(localData?.companyOverview?.ar) > getMaxLength('companyOverview') * 0.9 ? 'destructive' : 'secondary'}>
                    {getCharacterCount(localData?.companyOverview?.ar)}/{getMaxLength('companyOverview')}
                  </Badge>
                </div>
              </div>

              {/* English Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.englishText')}</Label>
                  <Badge variant="outline">EN</Badge>
                </div>
                <Textarea
                  value={localData?.companyOverview?.en}
                  onChange={(e) => updateField('companyOverview', 'en', e.target.value)}
                  rows={6}
                  maxLength={getMaxLength('companyOverview')}
                  placeholder={t('website.aboutSection.companyOverview.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t('website.aboutSection.companyOverview.required')}</span>
                  <Badge variant={getCharacterCount(localData?.companyOverview?.en) > getMaxLength('companyOverview') * 0.9 ? 'destructive' : 'secondary'}>
                    {getCharacterCount(localData?.companyOverview?.en)}/{getMaxLength('companyOverview')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>{t('website.aboutSection.mission.title')}</CardTitle>
              </div>
              <CardDescription>{t('website.aboutSection.mission.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.arabicText')}</Label>
                  <Badge variant="secondary">AR</Badge>
                </div>
                <Textarea
                  value={localData?.mission?.ar}
                  onChange={(e) => updateField('mission', 'ar', e.target.value)}
                  rows={4}
                  maxLength={getMaxLength('mission')}
                  placeholder={t('website.aboutSection.mission.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.mission?.ar)}/{getMaxLength('mission')}
                  </Badge>
                </div>
              </div>

              {/* English Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.englishText')}</Label>
                  <Badge variant="outline">EN</Badge>
                </div>
                <Textarea
                  value={localData?.mission?.en}
                  onChange={(e) => updateField('mission', 'en', e.target.value)}
                  rows={4}
                  maxLength={getMaxLength('mission')}
                  placeholder={t('website.aboutSection.mission.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.mission?.en)}/{getMaxLength('mission')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <CardTitle>{t('website.aboutSection.vision.title')}</CardTitle>
              </div>
              <CardDescription>{t('website.aboutSection.vision.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">النص العربي</Label>
                  <Badge variant="secondary">AR</Badge>
                </div>
                <Textarea
                  value={localData?.vision?.ar}
                  onChange={(e) => updateField('vision', 'ar', e.target.value)}
                  rows={4}
                  maxLength={getMaxLength('vision')}
                  placeholder={t('website.aboutSection.vision.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.vision?.ar)}/{getMaxLength('vision')}
                  </Badge>
                </div>
              </div>

              {/* English Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.englishText')}</Label>
                  <Badge variant="outline">EN</Badge>
                </div>
                <Textarea
                  value={localData?.vision?.en}
                  onChange={(e) => updateField('vision', 'en', e.target.value)}
                  rows={4}
                  maxLength={getMaxLength('vision')}
                  placeholder={t('website.aboutSection.vision.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.vision?.en)}/{getMaxLength('vision')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                <CardTitle>{t('website.aboutSection.values.title')}</CardTitle>
              </div>
              <CardDescription>{t('website.aboutSection.values.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">النص العربي</Label>
                  <Badge variant="secondary">AR</Badge>
                </div>
                <Textarea
                  value={localData?.values?.ar}
                  onChange={(e) => updateField('values', 'ar', e.target.value)}
                  rows={5}
                  maxLength={getMaxLength('values')}
                  placeholder={t('website.aboutSection.values.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.values?.ar)}/{getMaxLength('values')}
                  </Badge>
                </div>
              </div>

              {/* English Version */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">{t('website.aboutSection.englishText')}</Label>
                  <Badge variant="outline">EN</Badge>
                </div>
                <Textarea
                  value={localData?.values?.en}
                  onChange={(e) => updateField('values', 'en', e.target.value)}
                  rows={5}
                  maxLength={getMaxLength('values')}
                  placeholder={t('website.aboutSection.values.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(localData?.values?.en)}/{getMaxLength('values')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('website.aboutSection.lastUpdated')}: {new Date().toLocaleDateString('ar-SA')}
          </div>
          <Button 
            onClick={save} 
            disabled={saving || isLoading || !localData}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('website.aboutSection.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('website.aboutSection.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

export default AboutTab;
