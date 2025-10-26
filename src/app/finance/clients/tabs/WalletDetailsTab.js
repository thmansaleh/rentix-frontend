"use client";

import { useState } from "react";
import useSWR from 'swr';
import { getWalletsByClientId, createWallet } from "@/app/services/api/wallets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, TrendingUp, TrendingDown, Calendar, Plus, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export function WalletDetailsTab({ client, isOpen, onWalletCreated }) {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch wallet info only when this tab is active
  const { data: walletData, error, isLoading } = useSWR(
    isOpen && client ? `/wallets/client/${client.id}` : null,
    () => getWalletsByClientId(client.id),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        // If wallet doesn't exist (404), handle gracefully
        if (err.response?.status === 404) {
          return null;
        }
      }
    }
  );

  // API returns { success: true, data: [wallet] }, get the first wallet from the array
  const walletInfo = walletData?.data?.[0] || null;

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateWallet = async () => {
    if (!client?.id || !user?.id) {
      toast.error(language === 'ar' ? 'بيانات غير صالحة' : 'Invalid data');
      return;
    }

    setIsCreating(true);
    try {
      const walletData = {
        client_id: client.id,
        currency: 'AED',
        status: 'active',
        created_by: user.id
      };

      const result = await createWallet(walletData);
      
      if (result.success) {
        toast.success(language === 'ar' ? 'تم إنشاء المحفظة بنجاح' : 'Wallet created successfully');
        // Refresh the wallet data
        if (onWalletCreated) {
          onWalletCreated();
        }
      } else {
        toast.error(result.message || (language === 'ar' ? 'فشل إنشاء المحفظة' : 'Failed to create wallet'));
      }
    } catch (error) {

      toast.error(language === 'ar' ? 'حدث خطأ أثناء إنشاء المحفظة' : 'Error creating wallet');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'ar' ? 'جاري تحميل بيانات المحفظة...' : 'Loading wallet data...'}
        </span>
      </div>
    );
  }

  if (!walletInfo) {
    return (
      <div className="text-center py-12">
        <Wallet className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {language === 'ar' ? 'لا توجد محفظة' : 'No Wallet Found'}
        </h3>
        <p className="text-gray-500 mb-6">
          {language === 'ar' 
            ? 'لم يتم إنشاء محفظة لهذا الموكل بعد. قم بإنشاء محفظة للبدء في تتبع الإيداعات والمصروفات' 
            : 'No wallet has been created for this client yet. Create a wallet to start tracking deposits and expenses'}
        </p>
        <Button
          onClick={handleCreateWallet}
          disabled={isCreating}
          className="flex items-center gap-2 mx-auto"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              {language === 'ar' ? 'إنشاء محفظة جديدة' : 'Create New Wallet'}
            </>
          )}
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'bg-green-100 text-green-800',
        label: language === 'ar' ? 'نشط' : 'Active'
      },
      suspended: {
        color: 'bg-yellow-100 text-yellow-800',
        label: language === 'ar' ? 'معلق' : 'Suspended'
      },
      closed: {
        color: 'bg-red-100 text-red-800',
        label: language === 'ar' ? 'مغلق' : 'Closed'
      }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(walletInfo.balance, walletInfo.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'الرصيد المتاح' : 'Available balance'}
            </p>
          </CardContent>
        </Card>

        {/* Wallet ID Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'رقم المحفظة' : 'Wallet ID'}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{walletInfo.id}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'معرّف المحفظة' : 'Wallet identifier'}
            </p>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'الحالة' : 'Status'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              {getStatusBadge(walletInfo.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'ar' ? 'حالة المحفظة' : 'Wallet status'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ar' ? 'معلومات المحفظة' : 'Wallet Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                {language === 'ar' ? 'معلومات الموكل' : 'Client Information'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'الاسم:' : 'Name:'}
                  </span>
                  <span className="text-sm font-medium">{client.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}
                  </span>
                  <span className="text-sm font-medium" dir="ltr">{client.phone || '-'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                  </span>
                  <span className="text-sm font-medium">{client.email || '-'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'الجنسية:' : 'Nationality:'}
                  </span>
                  <span className="text-sm font-medium">{client.nationality || '-'}</span>
                </div>
              </div>
            </div>

            {/* Wallet Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                {language === 'ar' ? 'تفاصيل المحفظة' : 'Wallet Details'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'العملة:' : 'Currency:'}
                  </span>
                  <span className="text-sm font-medium">{walletInfo.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'تاريخ الإنشاء:' : 'Created Date:'}
                  </span>
                  <span className="text-sm font-medium">{formatDate(walletInfo.created_at)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'أنشئت بواسطة:' : 'Created By:'}
                  </span>
                  <span className="text-sm font-medium">{walletInfo.created_by_name || '-'}</span>
                </div>

                {walletInfo.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'الوصف:' : 'Description:'}
                    </span>
                    <span className="text-sm font-medium">{walletInfo.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
