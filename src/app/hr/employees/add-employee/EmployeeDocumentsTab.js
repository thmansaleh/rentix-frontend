import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, CircleX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import useSWR from 'swr';
import { getEmployees } from '@/app/services/api/employees';

export default function EmployeeDocumentsTab() {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();


  return <></>
}
