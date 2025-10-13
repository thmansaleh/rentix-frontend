import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const PersonalInfoTab = ({ formData, handleInputChange }) => {
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
          <User className="w-5 h-5" />
          {t('employees.personalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-wrap gap-4">
        <FormField 
          label={t('employees.name')} 
          name="name" 
          value={formData.name}
          required 
        />
        <FormField 
          label={t('employees.jobId')} 
          name="job_id" 
          value={formData.job_id}
        />
        <FormField 
          label={t('employees.employeeId')} 
          name="eId" 
          value={formData.eId}
        />
        <FormField 
          label={t('employees.passportNumber')} 
          name="passport" 
          value={formData.passport}
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;