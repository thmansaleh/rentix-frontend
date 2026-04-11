'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  Save,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMyBranchSettings, updateMyBranchSettings } from '@/app/services/api/branchSettings';
import { toast } from 'react-toastify';

const BranchSettingsPage = () => {
  const { isRTL, language } = useLanguage();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    salik_key: '',
    traffic_number: '',
    trn_number: '',
  });

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const t = (key) => {
    const translations = {
      ar: {
        title: 'إعدادات الفرع',
        description: 'إدارة إعدادات الفرع الحالي (سالك، المرور، الرقم الضريبي)',
        salikKey: 'مفتاح سالك',
        salikKeyPlaceholder: 'أدخل مفتاح سالك',
        trafficNumber: 'رقم المرور',
        trafficNumberPlaceholder: 'أدخل رقم المرور',
        trnNumber: 'الرقم الضريبي (TRN)',
        trnNumberPlaceholder: 'أدخل الرقم الضريبي',
        saveChanges: 'حفظ التغييرات',
        saving: 'جاري الحفظ...',
        settingsUpdated: 'تم تحديث إعدادات الفرع بنجاح',
        errorUpdating: 'فشل في تحديث إعدادات الفرع',
        errorLoading: 'فشل في تحميل إعدادات الفرع',
        branchSettingsInfo: 'هذه الإعدادات خاصة بالفرع الحالي وتستخدم لاستعلامات المخالفات ورصيد سالك والفواتير',
        noBranch: 'لم يتم اختيار فرع',
        noBranchDescription: 'يرجى اختيار فرع عند تسجيل الدخول',
      },
      en: {
        title: 'Branch Settings',
        description: 'Manage current branch settings (Salik, Traffic, TRN)',
        salikKey: 'Salik Key',
        salikKeyPlaceholder: 'Enter Salik key',
        trafficNumber: 'Traffic Number',
        trafficNumberPlaceholder: 'Enter traffic number',
        trnNumber: 'TRN Number',
        trnNumberPlaceholder: 'Enter TRN number',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        settingsUpdated: 'Branch settings updated successfully',
        errorUpdating: 'Failed to update branch settings',
        errorLoading: 'Failed to load branch settings',
        branchSettingsInfo: 'These settings are for the current branch and used for fines queries, Salik balance, and invoices',
        noBranch: 'No branch selected',
        noBranchDescription: 'Please select a branch when logging in',
      },
    };
    return translations[language]?.[key] || key;
  };

  // Fetch settings for the selected branch (auto from token)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getMyBranchSettings();
        if (response.success && response.data) {
          setFormData({
            salik_key: response.data.salik_key || '',
            traffic_number: response.data.traffic_number || '',
            trn_number: response.data.trn_number || '',
          });
        }
      } catch (error) {
        if (error?.response?.status !== 400) {
          toast.error(t('errorLoading'));
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateMyBranchSettings(formData);
      if (response.success) {
        toast.success(t('settingsUpdated'));
      } else {
        toast.error(response.message || t('errorUpdating'));
      }
    } catch (error) {
      toast.error(t('errorUpdating'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <BackIcon className="h-4 w-4" />
          {language === 'ar' ? 'رجوع' : 'Back'}
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('branchSettingsInfo')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Salik Key */}
            {/* <div className="space-y-2">
              <Label htmlFor="salik_key">{t('salikKey')}</Label>
              <Input
                id="salik_key"
                value={formData.salik_key}
                onChange={(e) => handleInputChange('salik_key', e.target.value)}
                placeholder={t('salikKeyPlaceholder')}
                dir="ltr"
              />
            </div> */}

            {/* Traffic Number */}
            <div className="space-y-2">
              <Label htmlFor="traffic_number">{t('trafficNumber')}</Label>
              <Input
                id="traffic_number"
                value={formData.traffic_number}
                onChange={(e) => handleInputChange('traffic_number', e.target.value)}
                placeholder={t('trafficNumberPlaceholder')}
                dir="ltr"
              />
            </div>

            {/* TRN Number */}
            <div className="space-y-2">
              <Label htmlFor="trn_number">{t('trnNumber')}</Label>
              <Input
                id="trn_number"
                value={formData.trn_number}
                onChange={(e) => handleInputChange('trn_number', e.target.value)}
                placeholder={t('trnNumberPlaceholder')}
                dir="ltr"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
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
                  <>
                    <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('saveChanges')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchSettingsPage;
