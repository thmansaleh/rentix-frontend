"use client";

import { TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from "@/hooks/useTranslations";

export function WalletTabTrigger({ value, translationKey }) {
  const { t } = useTranslations();
  
  return (
    <TabsTrigger value={value}>
      {t(translationKey)}
    </TabsTrigger>
  );
}
