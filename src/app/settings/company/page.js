'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { getTenantSettings, updateTenantSettings } from '@/app/services/api/tenantSettings';
import { Building2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '../../../../utils/fileUpload';

const TenantSettingsPage = () => {
  const { isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [originalLogoUrl, setOriginalLogoUrl] = useState(null);

  const t = (key) => {
    const translations = {
      ar: {
        title: 'إعدادات الشركة',
        description: 'إدارة معلومات الشركة والشعار',
        companyNameAr: 'اسم الشركة بالعربية',
        companyNameArPlaceholder: 'أدخل اسم الشركة بالعربية',
        companyNameEn: 'اسم الشركة بالإنجليزية',
        companyNameEnPlaceholder: 'أدخل اسم الشركة بالإنجليزية',
        trafficNumber: 'رقم المرور',
        trafficNumberPlaceholder: 'أدخل رقم المرور',
        trnNumber: 'الرقم الضريبي (TRN)',
        trnNumberPlaceholder: 'أدخل الرقم الضريبي',
        logo: 'شعار الشركة',
        uploadLogo: 'تحميل شعار',
        changeLogo: 'تغيير الشعار',
        removeLogo: 'إزالة الشعار',
        saveChanges: 'حفظ التغييرات',
        saving: 'جاري الحفظ...',
        uploading: 'جاري التحميل...',
        loadingSettings: 'جاري تحميل الإعدادات...',
        companyNameArRequired: 'اسم الشركة بالعربية مطلوب',
        companyNameEnRequired: 'اسم الشركة بالإنجليزية مطلوب',
        settingsUpdated: 'تم تحديث إعدادات الشركة بنجاح',
        errorUpdating: 'فشل في تحديث الإعدادات',
        errorLoading: 'فشل في تحميل الإعدادات',
        logoUploadError: 'فشل في تحميل الشعار',
        logoUploadSuccess: 'تم تحميل الشعار بنجاح',
        noPermission: 'ليس لديك صلاحية لتحديث هذه الإعدادات'
      },
      en: {
        title: 'Company Settings',
        description: 'Manage company information and logo',
        companyNameAr: 'Company Name (Arabic)',
        companyNameArPlaceholder: 'Enter company name in Arabic',
        companyNameEn: 'Company Name (English)',
        companyNameEnPlaceholder: 'Enter company name in English',
        trafficNumber: 'Traffic Number',
        trafficNumberPlaceholder: 'Enter traffic number',
        trnNumber: 'TRN Number',
        trnNumberPlaceholder: 'Enter TRN number',
        logo: 'Company Logo',
        uploadLogo: 'Upload Logo',
        changeLogo: 'Change Logo',
        removeLogo: 'Remove Logo',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        uploading: 'Uploading...',
        loadingSettings: 'Loading settings...',
        companyNameArRequired: 'Company name in Arabic is required',
        companyNameEnRequired: 'Company name in English is required',
        settingsUpdated: 'Company settings updated successfully',
        errorUpdating: 'Failed to update settings',
        errorLoading: 'Failed to load settings',
        logoUploadError: 'Failed to upload logo',
        logoUploadSuccess: 'Logo uploaded successfully',
        noPermission: 'You do not have permission to update these settings'
      }
    };
    return translations[language]?.[key] || key;
  };

  const validationSchema = Yup.object({
    company_name_ar: Yup.string().required(t('companyNameArRequired')),
    company_name_en: Yup.string().required(t('companyNameEnRequired')),
    logo_url: Yup.string().nullable()
  });

  const formik = useFormik({
    initialValues: {
      company_name_ar: '',
      company_name_en: '',
      logo_url: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let logoUrl = values.logo_url;

        // Upload logo file if a new one was selected
        if (logoFile) {
          try {
            const uploadResult = await uploadFile(logoFile, 'company-logos');
            if (uploadResult && uploadResult.document_url) {
              logoUrl = uploadResult.document_url;
            }
          } catch (error) {
            toast.error(t('logoUploadError'));
            setIsLoading(false);
            return;
          }
        }

        const response = await updateTenantSettings({
          ...values,
          logo_url: logoUrl
        });
        
        if (response.success) {
          toast.success(t('settingsUpdated'));
          setOriginalLogoUrl(logoUrl);
          setLogoFile(null);
        } else {
          toast.error(response.message || t('errorUpdating'));
        }
      } catch (error) {
        const isPermissionError = error?.response?.status === 403;
        if (isPermissionError) {
          const permissionMessage = error?.response?.data?.message || t('noPermission');
          toast.error(permissionMessage);
        } else {
          toast.error(t('errorUpdating'));
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch company settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getTenantSettings();
        if (response.success && response.data) {
          const { company_name_ar, company_name_en, logo_url } = response.data;
          formik.setValues({
            company_name_ar: company_name_ar || '',
            company_name_en: company_name_en || '',
            logo_url: logo_url || ''
          });
          if (logo_url) {
            setLogoPreview(logo_url);
            setOriginalLogoUrl(logo_url);
          }
        }
      } catch (error) {
        toast.error(t('errorLoading'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'ar' ? 'يرجى اختيار ملف صورة' : 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' : 'File size must be less than 5MB');
      return;
    }

    // Store file and create preview
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    formik.setFieldValue('logo_url', '');
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('loadingSettings')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container max-w-4xl mx-auto py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
          </div>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label>{t('logo')}</Label>
              <div className="flex flex-col items-center gap-4">
                {logoPreview ? (
                  <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={logoPreview}
                      alt="Company Logo"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label htmlFor="logo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload').click()}
                      className="cursor-pointer"
                    >
                      <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {logoPreview ? t('changeLogo') : t('uploadLogo')}
                    </Button>
                  </label>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveLogo}
                    >
                      {t('removeLogo')}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Company Name Arabic */}
            <div className="space-y-2">
              <Label htmlFor="company_name_ar">{t('companyNameAr')} *</Label>
              <Input
                id="company_name_ar"
                name="company_name_ar"
                value={formik.values.company_name_ar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.company_name_ar && formik.errors.company_name_ar ? 'border-red-500' : ''}
                placeholder={t('companyNameArPlaceholder')}
                dir="rtl"
              />
              {formik.touched.company_name_ar && formik.errors.company_name_ar && (
                <p className="text-sm text-red-500">{formik.errors.company_name_ar}</p>
              )}
            </div>

            {/* Company Name English */}
            <div className="space-y-2">
              <Label htmlFor="company_name_en">{t('companyNameEn')} *</Label>
              <Input
                id="company_name_en"
                name="company_name_en"
                value={formik.values.company_name_en}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.company_name_en && formik.errors.company_name_en ? 'border-red-500' : ''}
                placeholder={t('companyNameEnPlaceholder')}
                dir="ltr"
              />
              {formik.touched.company_name_en && formik.errors.company_name_en && (
                <p className="text-sm text-red-500">{formik.errors.company_name_en}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('saving')}
                  </>
                ) : (
                  t('saveChanges')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSettingsPage;