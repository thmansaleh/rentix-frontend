'use client';

import PageHeader from '@/components/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import FinancialReports from './FinancialReports';
import FleetReports from './FleetReports';
import CustomerReports from './CustomerReports';

export default function ReportsPage() {
  const t = useTranslations();



  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title={t('reports.title', 'التقارير والمصروفات')}
          description={t('reports.description', 'إدارة التقارير والمصروفات الخاصة بالمركبات والعملاء')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Reports Component */}
        <FinancialReports />

        {/* Fleet Reports Component */}
        <FleetReports />

        {/* Customer Reports Component */}
        <CustomerReports />
      </div>
    </div>
  );
}
