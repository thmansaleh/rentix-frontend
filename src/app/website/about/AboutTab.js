'use client'

import React, { useEffect, useState } from 'react';
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
import { Save, AlertCircle, CheckCircle2, Building2, Target, Eye, Heart, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getTenantSettings, updateTenantSettings } from '@/app/services/api/tenantSettings';

function AboutTab() {
  const {t} = useTranslations();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

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

  // Validation schema
  const validationSchema = Yup.object({
    company_overview_ar: Yup.string().max(1000, 'Maximum 1000 characters'),
    company_overview_en: Yup.string().max(1000, 'Maximum 1000 characters'),
    mission_ar: Yup.string().max(500, 'Maximum 500 characters'),
    mission_en: Yup.string().max(500, 'Maximum 500 characters'),
    vision_ar: Yup.string().max(500, 'Maximum 500 characters'),
    vision_en: Yup.string().max(500, 'Maximum 500 characters'),
    values_ar: Yup.string().max(800, 'Maximum 800 characters'),
    values_en: Yup.string().max(800, 'Maximum 800 characters'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      company_overview_ar: '',
      company_overview_en: '',
      mission_ar: '',
      mission_en: '',
      vision_ar: '',
      vision_en: '',
      values_ar: '',
      values_en: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setMessage(null);
      try {
        const response = await updateTenantSettings(values);
        
        if (response.success) {
          setMessage(t('website.aboutSection.saveSuccess'));
          setMessageType('success');
          setTimeout(() => setMessage(null), 3000);
        }
      } catch (error) {
        console.error('Error saving about us:', error);
        setMessage(error.response?.data?.error || t('website.aboutSection.saveError'));
        setMessageType('error');
      }
    }
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTenantSettings();
        if (response.success && response.data) {
          const data = response.data;
          formik.setValues({
            company_overview_ar: data.company_overview_ar || '',
            company_overview_en: data.company_overview_en || '',
            mission_ar: data.mission_ar || '',
            mission_en: data.mission_en || '',
            vision_ar: data.vision_ar || '',
            vision_en: data.vision_en || '',
            values_ar: data.values_ar || '',
            values_en: data.values_en || ''
          });
        }
      } catch (error) {
        console.error('Error fetching about us:', error);
        setMessage(t('website.aboutSection.loadError') || 'Failed to load data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
            <div>
              <h2 className="text-2xl font-bold">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{t('website.aboutSection.title')}</h2>
              <p className="text-muted-foreground">{t('website.aboutSection.description')}</p>
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
                  name="company_overview_ar"
                  value={formik.values.company_overview_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={6}
                  maxLength={getMaxLength('companyOverview')}
                  placeholder={t('website.aboutSection.companyOverview.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span></span>
                  <Badge variant={getCharacterCount(formik.values.company_overview_ar) > getMaxLength('companyOverview') * 0.9 ? 'destructive' : 'secondary'}>
                    {getCharacterCount(formik.values.company_overview_ar)}/{getMaxLength('companyOverview')}
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
                  name="company_overview_en"
                  value={formik.values.company_overview_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={6}
                  maxLength={getMaxLength('companyOverview')}
                  placeholder={t('website.aboutSection.companyOverview.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t('website.aboutSection.companyOverview.required')}</span>
                  <Badge variant={getCharacterCount(formik.values.company_overview_en) > getMaxLength('companyOverview') * 0.9 ? 'destructive' : 'secondary'}>
                    {getCharacterCount(formik.values.company_overview_en)}/{getMaxLength('companyOverview')}
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
                  name="mission_ar"
                  value={formik.values.mission_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  maxLength={getMaxLength('mission')}
                  placeholder={t('website.aboutSection.mission.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.mission_ar)}/{getMaxLength('mission')}
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
                  name="mission_en"
                  value={formik.values.mission_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  maxLength={getMaxLength('mission')}
                  placeholder={t('website.aboutSection.mission.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.mission_en)}/{getMaxLength('mission')}
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
                  name="vision_ar"
                  value={formik.values.vision_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  maxLength={getMaxLength('vision')}
                  placeholder={t('website.aboutSection.vision.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.vision_ar)}/{getMaxLength('vision')}
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
                  name="vision_en"
                  value={formik.values.vision_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  maxLength={getMaxLength('vision')}
                  placeholder={t('website.aboutSection.vision.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.vision_en)}/{getMaxLength('vision')}
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
                  name="values_ar"
                  value={formik.values.values_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={5}
                  maxLength={getMaxLength('values')}
                  placeholder={t('website.aboutSection.values.placeholder')}
                  className="resize-none"
                  dir="rtl"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.values_ar)}/{getMaxLength('values')}
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
                  name="values_en"
                  value={formik.values.values_en}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={5}
                  maxLength={getMaxLength('values')}
                  placeholder={t('website.aboutSection.values.placeholder')}
                  className="resize-none"
                  dir="ltr"
                />
                <div className="text-right">
                  <Badge variant="outline">
                    {getCharacterCount(formik.values.values_en)}/{getMaxLength('values')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('website.aboutSection.lastUpdated')}: {new Date().toLocaleDateString('ar-AE')}
            </div>
            <Button 
              type="submit"
              disabled={formik.isSubmitting}
              className="min-w-[120px]"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </form>
    </div>
  );
}

export default AboutTab;
