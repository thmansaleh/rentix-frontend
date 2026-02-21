"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, IdCard, FileText, MapPin, Phone, Mail, Calendar, Building, Download, ExternalLink, CreditCard, Globe, Plane, ArrowLeft, ShieldBan, ShieldCheck } from "lucide-react";
import { getCustomerById } from "../../services/api/customers";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function ClientDetailPage({ params }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const customerId = params.id;

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await getCustomerById(customerId);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error(t('clients.view.error'));
      router.push('/clients');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('clients.view.fields.na');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const InfoField = ({ label, value, icon: Icon }) => (
    <Card className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </Label>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1 break-words">
            {value || <span className="text-gray-400 italic">{t('clients.view.fields.notProvided')}</span>}
          </p>
        </div>
      </div>
    </Card>
  );

  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(t('clients.view.document.failedToDownload'));
    }
  };

  const DocumentField = ({ label, url }) => (
    <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {label}
        </Label>
      </div>
      {url ? (
        <div className="p-4 space-y-3">
          {isImageFile(url) ? (
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner">
              <img
                src={url}
                alt={label}
                className="w-full h-56 object-contain p-2"
                onError={(e) => {
                  e.target.src = '/placeholder-image.png';
                  e.target.onerror = null;
                }}
              />
              <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                {t('clients.view.document.image')}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('clients.view.document.documentFile')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('clients.view.document.clickToViewDownload')}
                </p>
              </div>
              <Badge variant="outline">{t('clients.view.document.pdf')}</Badge>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => window.open(url, '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('clients.view.document.view')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(url, label)}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('clients.view.document.download')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('clients.view.fields.noDocumentUploaded')}</p>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-20">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('clients.view.noData')}</p>
          <Button 
            onClick={() => router.push('/clients')} 
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.backToList')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/clients')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('clients.view.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {customer.full_name}
            </p>
          </div>
        </div>
      </div>

      {/* Blacklist Warning Banner */}
      {customer.is_blacklisted && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg flex items-center gap-3">
          <ShieldBan className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">{t('clients.blacklisted')}</p>
            <p className="text-sm text-red-600 dark:text-red-400/80">{t('clients.edit.fields.blacklistWarning')}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Card className="p-6">
        <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="basic">
              <User className="w-4 h-4 mr-2" />
              {t('clients.view.tabs.basic')}
            </TabsTrigger>
            <TabsTrigger value="emirates">
              <IdCard className="w-4 h-4 mr-2" />
              {t('clients.view.tabs.emirates')}
            </TabsTrigger>
            <TabsTrigger value="license">
              <IdCard className="w-4 h-4 mr-2" />
              {t('clients.view.tabs.license')}
            </TabsTrigger>
            <TabsTrigger value="passport">
              <FileText className="w-4 h-4 mr-2" />
              {t('clients.view.tabs.passport')}
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            {/* Header Section */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {customer.full_name}
                  </h3>
                  {customer.is_blacklisted ? (
                    <Badge variant="destructive" className="mt-2 flex items-center gap-1 w-fit">
                      <ShieldBan className="w-3 h-3" />
                      {t('clients.view.fields.blacklisted')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-600 flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      {t('clients.view.fields.notBlacklisted')}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t('clients.view.sections.contactInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.phoneNumber')} 
                  value={customer.phone} 
                  icon={Phone} 
                />
                <InfoField 
                  label={t('clients.view.fields.emailAddress')} 
                  value={customer.email} 
                  icon={Mail} 
                />
              </div>
            </div>

            {/* Location & Branch */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                {t('clients.view.sections.locationDetails')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.branch')} 
                  value={customer.branch_name} 
                  icon={Building} 
                />
                <InfoField 
                  label={t('clients.view.fields.nationality')} 
                  value={customer.nationality} 
                  icon={Globe} 
                />
                <InfoField 
                  label={t('clients.view.fields.dateOfBirth')} 
                  value={formatDate(customer.date_of_birth)} 
                  icon={Calendar} 
                />
                <div className="md:col-span-2">
                  <InfoField 
                    label={t('clients.view.fields.address')} 
                    value={customer.address} 
                    icon={MapPin} 
                  />
                </div>
              </div>
            </div>

            {/* System Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('clients.view.sections.systemInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.joinDate')} 
                  value={formatDate(customer.created_at)} 
                  icon={Calendar} 
                />
                <InfoField 
                  label={t('clients.view.fields.createdBy')} 
                  value={customer.created_by_name} 
                  icon={User} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Emirates ID Tab */}
          <TabsContent value="emirates" className="space-y-6">
            {/* ID Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {t('clients.view.sections.idInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.emiratesIdNumber')} 
                  value={customer.emirates_id} 
                  icon={CreditCard}
                />
                <InfoField 
                  label={t('clients.view.fields.expiryDate')} 
                  value={formatDate(customer.emirates_id_expiry)} 
                  icon={Calendar}
                />
              </div>
            </div>

            {/* ID Documents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('clients.view.sections.idDocuments')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentField 
                  label={t('clients.view.fields.emiratesIdFront')} 
                  url={customer.emirates_id_front} 
                />
                <DocumentField 
                  label={t('clients.view.fields.emiratesIdBack')} 
                  url={customer.emirates_id_back} 
                />
              </div>
            </div>
          </TabsContent>

          {/* License Tab */}
          <TabsContent value="license" className="space-y-6">
            {/* License Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <IdCard className="w-4 h-4" />
                {t('clients.view.sections.licenseInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.licenseNumber')} 
                  value={customer.driving_license_no} 
                  icon={IdCard}
                />
                <InfoField 
                  label={t('clients.view.fields.issuingCountry')} 
                  value={customer.driving_license_country} 
                  icon={Globe}
                />
                <InfoField 
                  label={t('clients.view.fields.expiryDate')} 
                  value={formatDate(customer.driving_license_expiry)} 
                  icon={Calendar}
                />
              </div>
            </div>

            {/* License Documents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('clients.view.sections.licenseDocuments')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentField 
                  label={t('clients.view.fields.licenseFront')} 
                  url={customer.license_front} 
                />
                <DocumentField 
                  label={t('clients.view.fields.licenseBack')} 
                  url={customer.license_back} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Passport Tab */}
          <TabsContent value="passport" className="space-y-6">
            {/* Passport Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Plane className="w-4 h-4" />
                {t('clients.view.sections.passportInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoField 
                  label={t('clients.view.fields.passportNumber')} 
                  value={customer.passport_number} 
                  icon={Plane}
                />
                <InfoField 
                  label={t('clients.view.fields.passportCountry')} 
                  value={customer.passport_country} 
                  icon={Globe}
                />
                <InfoField 
                  label={t('clients.view.fields.issueDate')} 
                  value={formatDate(customer.passport_issue_date)} 
                  icon={Calendar}
                />
                <InfoField 
                  label={t('clients.view.fields.expiryDate')} 
                  value={formatDate(customer.passport_expiry_date)} 
                  icon={Calendar}
                />
              </div>
            </div>

            {/* Passport Documents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('clients.view.sections.passportDocuments')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentField 
                  label={t('clients.view.fields.passportFront')} 
                  url={customer.passport_front} 
                />
                <DocumentField 
                  label={t('clients.view.fields.passportBack')} 
                  url={customer.passport_back} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
