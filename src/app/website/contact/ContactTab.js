'use client'

import React, { useState } from 'react';
import useSWR from 'swr';
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
import { getContactData, updateContactData } from '@/app/services/api/contact';
import { 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
  Globe,
  ExternalLink
} from 'lucide-react';

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
  { value: 'website', label: 'Website', icon: Globe, color: 'text-gray-600' },
];

function ContactTab() {
  const {t} = useTranslations();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Fetch contact data using SWR
  const { data: contactResponse, error, isLoading, mutate } = useSWR('contact-data', getContactData);

  // Debug logging
  React.useEffect(() => {
    console.log('Contact Response:', contactResponse);
  }, [contactResponse]);

  // Process the contact data from API response
  const contactData = React.useMemo(() => {
    if (!contactResponse || !contactResponse.success) {
      return {
        phones: [''],
        emails: [''],
        addresses: [{ title: '', address: '', city: '', country: '' }],
        workingHours: [{ day: '', hours: '' }],
        socials: []
      };
    }

    const data = contactResponse.data;
    console.log('Processing contact data:', data);
    return {
      phones: data.phones?.length ? data.phones.map(p => p.phone) : [''],
      emails: data.emails?.length ? data.emails.map(e => e.email) : [''],
      addresses: data.addresses?.length ? data.addresses.map(a => ({
        title: a.title || '',
        address: a.address || '',
        city: a.city || '',
        country: a.country || ''
      })) : [{ title: '', address: '', city: '', country: '' }],
      workingHours: data.workingHours?.length ? data.workingHours.map(w => ({
        day: w.day || '',
        hours: w.hours || ''
      })) : [{ day: '', hours: '' }],
      socials: data.socials?.length ? data.socials.map(s => ({
        platform: s.platform || '',
        url: s.url || ''
      })) : []
    };
  }, [contactResponse]);

  // Local state for editing
  const [editData, setEditData] = React.useState(contactData);

  // Update editData when contactData changes
  React.useEffect(() => {
    setEditData(contactData);
  }, [contactData]);

  // Show error message if data fetch fails
  React.useEffect(() => {
    if (error) {
      console.error('Error loading contact data:', error);
      console.error('Error details:', error.message, error.response);
      setMessage(t('website.contactSection.messages.loadError', 'فشل في تحميل البيانات') + ': ' + (error.message || 'Unknown error'));
      setMessageType('error');
    }
  }, [error, t]);

  const updatePhone = (index, value) => {
    setEditData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }));
  };

  const addPhone = () => {
    setEditData(prev => ({ ...prev, phones: [...prev.phones, ''] }));
  };

  const removePhone = (index) => {
    setEditData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }));
  };

  const updateEmail = (index, value) => {
    setEditData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }));
  };

  const addEmail = () => {
    setEditData(prev => ({ ...prev, emails: [...prev.emails, ''] }));
  };

  const removeEmail = (index) => {
    setEditData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  const updateAddress = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => 
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const addAddress = () => {
    setEditData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { title: '', address: '', city: '', country: '' }]
    }));
  };

  const removeAddress = (index) => {
    setEditData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const updateWorkingHours = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((wh, i) => 
        i === index ? { ...wh, [field]: value } : wh
      )
    }));
  };

  const addWorkingHours = () => {
    setEditData(prev => ({
      ...prev,
      workingHours: [...prev.workingHours, { day: '', hours: '' }]
    }));
  };

  const removeWorkingHours = (index) => {
    setEditData(prev => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index)
    }));
  };

  const updateSocial = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      socials: prev.socials.map((s, i) => i === index ? { ...s, [field]: value } : s)
    }));
  };

  const addSocial = () => {
    setEditData(prev => ({
      ...prev,
      socials: [...prev.socials, { platform: '', url: '' }]
    }));
  };

  const removeSocial = (index) => {
    setEditData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const validPhones = editData.phones.filter(phone => phone.trim());
    if (validPhones.length === 0) {
      setMessage(t('website.contactSection.validation.phoneRequired', 'يجب إضافة رقم هاتف واحد على الأقل'));
      setMessageType('error');
      return false;
    }

    const validEmails = editData.emails.filter(email => email.trim());
    if (validEmails.length === 0) {
      setMessage(t('website.contactSection.validation.emailRequired', 'يجب إضافة بريد إلكتروني واحد على الأقل'));
      setMessageType('error');
      return false;
    }

    return true;
  };

  const save = async () => {
    if (!validateForm()) return;
    
    setSaving(true); 
    setMessage(null);
    
    try {
      // Clean up empty fields
      const cleanedData = {
        phones: editData.phones.filter(phone => phone.trim()),
        emails: editData.emails.filter(email => email.trim()),
        addresses: editData.addresses.filter(addr => addr.address.trim()),
        workingHours: editData.workingHours.filter(wh => wh.day && wh.hours),
        socials: editData.socials.filter(s => s.platform && s.url.trim())
      };
      
      const response = await updateContactData(cleanedData);
      
      if (!response.success) {
        throw new Error(response.error || t('website.contactSection.messages.saveError', 'خطأ في الحفظ'));
      }
      
      // Revalidate the data
      await mutate();
      
      setMessage(t('website.contactSection.messages.saveSuccess', 'تم حفظ معلومات الاتصال بنجاح'));
      setMessageType('success');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage(e.message || t('website.contactSection.messages.saveError', 'فشل في الحفظ'));
      setMessageType('error');
    } finally { 
      setSaving(false); 
    }
  };

  const getSocialIcon = (platform) => {
    const socialPlatform = socialPlatforms.find(p => p.value === platform);
    if (socialPlatform) {
      const Icon = socialPlatform.icon;
      return <Icon className={`h-4 w-4 ${socialPlatform.color}`} />;
    }
    return <Globe className="h-4 w-4 text-gray-600" />;
  };

  if (isLoading) {
    return (
      <div>
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
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Phone className="h-7 w-7 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('website.contactSection.title', 'معلومات الاتصال')}</h2>
            <p className="text-muted-foreground">{t('website.contactSection.description', 'إدارة معلومات الاتصال والتواصل مع العملاء')}</p>
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
          {/* Phone Numbers */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                <CardTitle>{t('website.contactSection.phoneNumbers.title', 'أرقام الهاتف')}</CardTitle>
              </div>
              <CardDescription>{t('website.contactSection.phoneNumbers.description', 'أرقام هواتف التواصل مع الشركة')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editData.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder={t('website.contactSection.phoneNumbers.placeholder', '+971 50 123 4567')}
                    className="flex-1"
                  />
                  {editData.phones.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePhone(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addPhone} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('website.contactSection.phoneNumbers.addPhone', 'إضافة رقم هاتف')}
              </Button>
            </CardContent>
          </Card>

          {/* Email Addresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <CardTitle>{t('website.contactSection.emailAddresses.title', 'عناوين البريد الإلكتروني')}</CardTitle>
              </div>
              <CardDescription>{t('website.contactSection.emailAddresses.description', 'عناوين البريد الإلكتروني للتواصل')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editData.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder={t('website.contactSection.emailAddresses.placeholder', 'info@company.com')}
                    className="flex-1"
                  />
                  {editData.emails.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeEmail(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addEmail} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('website.contactSection.emailAddresses.addEmail', 'إضافة بريد إلكتروني')}
              </Button>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <CardTitle>{t('website.contactSection.addresses.title', 'العناوين')}</CardTitle>
              </div>
              <CardDescription>{t('website.contactSection.addresses.description', 'عناوين مقرات الشركة')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editData.addresses.map((address, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{t('website.contactSection.addresses.addressNumber', 'العنوان')} {index + 1}</h4>
                    {editData.addresses.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAddress(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('website.contactSection.addresses.addressTitle', 'عنوان المقر')}</Label>
                      <Input
                        value={address.title}
                        onChange={(e) => updateAddress(index, 'title', e.target.value)}
                        placeholder={t('website.contactSection.addresses.addressTitlePlaceholder', 'المقر الرئيسي')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('website.contactSection.addresses.city', 'المدينة')}</Label>
                      <Input
                        value={address.city}
                        onChange={(e) => updateAddress(index, 'city', e.target.value)}
                        placeholder={t('website.contactSection.addresses.cityPlaceholder', 'دبي')}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t('website.contactSection.addresses.detailedAddress', 'العنوان التفصيلي')}</Label>
                      <Textarea
                        value={address.address}
                        onChange={(e) => updateAddress(index, 'address', e.target.value)}
                        rows={2}
                        placeholder={t('website.contactSection.addresses.detailedAddressPlaceholder', 'شارع الشيخ زايد، برج...')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('website.contactSection.addresses.country', 'البلد')}</Label>
                      <Input
                        value={address.country}
                        onChange={(e) => updateAddress(index, 'country', e.target.value)}
                        placeholder={t('website.contactSection.addresses.countryPlaceholder', 'الإمارات العربية المتحدة')}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addAddress} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('website.contactSection.addresses.addAddress', 'إضافة عنوان')}
              </Button>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <CardTitle>{t('website.contactSection.workingHours.title', 'أوقات العمل')}</CardTitle>
              </div>
              <CardDescription>{t('website.contactSection.workingHours.description', 'أوقات عمل الشركة')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editData.workingHours.map((wh, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={wh.day}
                      onChange={(e) => updateWorkingHours(index, 'day', e.target.value)}
                      placeholder={t('website.contactSection.workingHours.dayPlaceholder', 'الأحد - الخميس')}
                      className="flex-1"
                    />
                    {editData.workingHours.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeWorkingHours(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={wh.hours}
                    onChange={(e) => updateWorkingHours(index, 'hours', e.target.value)}
                    placeholder={t('website.contactSection.workingHours.hoursPlaceholder', '9:00 ص - 6:00 م')}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addWorkingHours} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('website.contactSection.workingHours.addWorkingHours', 'إضافة ساعات عمل')}
              </Button>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>{t('website.contactSection.socialMedia.title', 'روابط التواصل الاجتماعي')}</CardTitle>
              <CardDescription>{t('website.contactSection.socialMedia.description', 'حسابات الشركة على منصات التواصل')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editData.socials.map((social, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSocialIcon(social.platform)}
                      <span className="font-medium">
                        {socialPlatforms.find(p => p.value === social.platform)?.label || t('website.contactSection.socialMedia.platform', 'منصة')}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Select value={social.platform} onValueChange={(value) => updateSocial(index, 'platform', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('website.contactSection.socialMedia.selectPlatform', 'اختر المنصة')} />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center gap-2">
                              <platform.icon className={`h-4 w-4 ${platform.color}`} />
                              {platform.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        value={social.url}
                        onChange={(e) => updateSocial(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      {social.url && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(social.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addSocial} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('website.contactSection.socialMedia.addSocialLink', 'إضافة رابط تواصل')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('website.contactSection.common.lastUpdated', 'آخر تحديث')}: {new Date().toLocaleDateString('ar-SA')}
          </div>
          <Button 
            onClick={save} 
            disabled={saving || isLoading}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('website.contactSection.common.saving', 'جارٍ الحفظ...')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('website.contactSection.common.saveChanges', 'حفظ التغييرات')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContactTab;
