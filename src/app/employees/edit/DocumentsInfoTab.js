import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const DocumentsInfoTab = ({ formData, handleInputChange }) => {
  const { t } = useTranslations();

  const FormField = ({ label, name, type = "text", required = false, value, placeholder }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        value={value || ''}
        onChange={(e) => handleInputChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full"
        required={required}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t('employees.documentsInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-wrap gap-4">
        <FormField 
          label={t('employees.residenceEndDate')} 
          name="residence_end_date" 
          type="date"
          value={formData.residence_end_date}
        />
        <FormField 
          label={t('employees.idEndDate')} 
          name="id_end_date" 
          type="date"
          value={formData.id_end_date}
        />
        <FormField 
          label={t('employees.passportEndDate')} 
          name="passport_end_date" 
          type="date"
          value={formData.passport_end_date}
        />
        <FormField 
          label={t('employees.laborCardEndDate')} 
          name="labor_card_end_date" 
          type="date"
          value={formData.labor_card_end_date}
        />
        <FormField 
          label={t('employees.healthInsuranceEndDate')} 
          name="health_insurance_end_date" 
          type="date"
          value={formData.health_insurance_end_date}
        />
        <FormField 
          label={t('employees.contractEndDate')} 
          name="contract_end_date" 
          type="date"
          value={formData.contract_end_date}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsInfoTab;