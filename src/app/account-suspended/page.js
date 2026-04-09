'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShieldOff, CreditCard, AlertTriangle, Clock, Phone } from 'lucide-react';

const REASONS = {
  TENANT_INACTIVE: {
    icon: ShieldOff,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    en: {
      title: 'Account Suspended',
      description:
        'Your account has been suspended by the administrator. Please contact support to reactivate your account.',
    },
    ar: {
      title: 'الحساب موقوف',
      description:
        'تم إيقاف حسابك من قِبل المدير. يرجى التواصل مع الدعم لإعادة تفعيل حسابك.',
    },
  },
  NO_SUBSCRIPTION: {
    icon: CreditCard,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    en: {
      title: 'No Active Plan',
      description:
        'Your account does not have an active subscription plan. Please contact the administrator to assign a plan.',
    },
    ar: {
      title: 'لا توجد خطة نشطة',
      description:
        'حسابك لا يمتلك خطة اشتراك نشطة. يرجى التواصل مع المدير لتعيين خطة.',
    },
  },
  SUBSCRIPTION_EXPIRED: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    en: {
      title: 'Subscription Expired',
      description:
        'Your subscription plan has expired. Please renew your plan to continue using the system.',
    },
    ar: {
      title: 'انتهت صلاحية الاشتراك',
      description:
        'انتهت صلاحية خطة اشتراكك. يرجى تجديد خطتك لمواصلة استخدام النظام.',
    },
  },
  TRIAL_EXPIRED: {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    en: {
      title: 'Trial Period Ended',
      description:
        'Your free trial has ended. Please subscribe to a plan to continue using the system.',
    },
    ar: {
      title: 'انتهت فترة التجربة',
      description:
        'انتهت فترة التجربة المجانية. يرجى الاشتراك في خطة لمواصلة استخدام النظام.',
    },
  },
  SUBSCRIPTION_PAST_DUE: {
    icon: CreditCard,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    en: {
      title: 'Payment Overdue',
      description:
        'Your subscription payment is overdue. Please contact the administrator to settle the outstanding balance.',
    },
    ar: {
      title: 'الدفع متأخر',
      description:
        'دفع اشتراكك متأخر. يرجى التواصل مع المدير لتسوية الرصيد المستحق.',
    },
  },
};

const DEFAULT_REASON = {
  icon: ShieldOff,
  color: 'text-gray-500',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-200',
  en: {
    title: 'Access Restricted',
    description: 'Access to this account is currently restricted. Please contact support.',
  },
  ar: {
    title: 'الوصول مقيد',
    description: 'الوصول إلى هذا الحساب مقيد حالياً. يرجى التواصل مع الدعم.',
  },
};

function AccountSuspendedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || '';

  const config = REASONS[reason] || DEFAULT_REASON;
  const lang =
    typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
  const isAr = lang === 'ar';
  const text = isAr ? config.ar : config.en;
  const Icon = config.icon;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className={`max-w-md w-full rounded-2xl border ${config.borderColor} ${config.bgColor} shadow-lg p-8 text-center`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full bg-white shadow-sm`}>
            <Icon className={`w-10 h-10 ${config.color}`} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{text.title}</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">{text.description}</p>

        {/* Contact info */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <Phone className="w-4 h-4" />
          <span>{isAr ? 'للمساعدة تواصل مع مدير النظام' : 'Contact your system administrator for assistance'}</span>
        </div>


      </div>
    </div>
  );
}

export default function AccountSuspendedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
      <AccountSuspendedContent />
    </Suspense>
  );
}
