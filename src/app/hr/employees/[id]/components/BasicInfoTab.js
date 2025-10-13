"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  IdCard, 
  Loader2, 
  AlertCircle, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  FileText
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { useSelector } from 'react-redux';
import { getEmployeeById } from "@/app/services/api/employees";
import EditEmployeeModal from "./EditEmployeeModal";

const BasicInfoTab = ({ employeeId }) => {
  // Get employee role from Redux to check if user is admin
  const employeeRole = useSelector((state) => state.auth.roleEn);
  const isAdmin = employeeRole?.toLowerCase() === 'admin';
  
  const { data, error, isLoading } = useSWR(
    employeeId ? `/employees/${employeeId}` : null,
    () => getEmployeeById(employeeId),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  const employee = data?.data;

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">لا توجد بيانات</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('ar-AE');
    } catch (error) {
      return null;
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">غير محدد</Badge>;
    const variant = status === 'active' ? 'default' : 'secondary';
    const text = status === 'active' ? 'نشط' : 'غير نشط';
    return <Badge variant={variant}>{text}</Badge>;
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b last:border-0">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "غير محدد"}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with name and status */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <h3 className="text-xl font-semibold">{employee.name || "غير محدد"}</h3>
          <p className="text-muted-foreground">
            {employee.role_ar || "غير محدد"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(employee.status)}
          <EditEmployeeModal 
            employeeId={employeeId}
            onUpdate={() => {
              // Revalidate the data after update
              mutate(`/employees/${employeeId}`);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="الاسم" value={employee.name} />
            <InfoRow label="الرقم الوظيفي" value={employee.job_id} />
            <InfoRow label="رقم الهوية" value={employee.eId} />
            <InfoRow label="رقم جواز السفر" value={employee.passport} />
            <InfoRow label="المدير" value={employee.managerName} />
            <InfoRow label="الدور الوظيفي" value={employee.role_ar} />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="البريد الإلكتروني" value={employee.email} />
            <InfoRow label="رقم الهاتف" value={employee.phone} />
            <InfoRow label="اسم المستخدم" value={employee.username} />
            {isAdmin && (
              <InfoRow label="كلمة المرور" value={employee.password} />
            )}
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5" />
              معلومات العمل
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="القسم" value={employee.department_ar} />
            <InfoRow label="الحالة" value={getStatusBadge(employee.status)} />
            <InfoRow label="نوع العقد" value={employee.contract_type} />
            <InfoRow label="أول يوم عمل" value={formatDate(employee.fisrt_day_of_work)} />
            <InfoRow label="آخر تسجيل دخول" value={formatDate(employee.last_login)} />
            <InfoRow label="تاريخ تفعيل الحساب" value={formatDate(employee.account_activation_date)} />
            <InfoRow label="تاريخ إغلاق الحساب" value={formatDate(employee.account_close_date)} />
          </CardContent>
        </Card>

        {/* Salary & Allowances */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5" />
              الراتب والبدلات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="الراتب الأساسي" value={employee.basic_salary ? `${employee.basic_salary} AED` : null} />
            <InfoRow label="بدل السكن" value={employee.housing_allowance ? `${employee.housing_allowance} AED` : null} />
            <InfoRow label="بدل المواصلات" value={employee.trnsportation_allownce ? `${employee.trnsportation_allownce} AED` : null} />
            <InfoRow label="بدل آخر" value={employee.another_allownce ? `${employee.another_allownce} AED` : null} />
          </CardContent>
        </Card>

        {/* Bank Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5" />
              المعلومات البنكية
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="اسم البنك" value={employee.bank_name} />
            <InfoRow label="رقم الآيبان" value={employee.iban} />
            <InfoRow label="رقم الحساب" value={employee.account_number} />
            <InfoRow label="طريقة الدفع" value={employee.pay_type} />
          </CardContent>
        </Card>

        {/* Documents Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              معلومات الوثائق
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InfoRow label="تاريخ انتهاء الإقامة" value={formatDate(employee.residence_end_date)} />
            <InfoRow label="تاريخ انتهاء الهوية" value={formatDate(employee.id_end_date)} />
            <InfoRow label="تاريخ انتهاء جواز السفر" value={formatDate(employee.passport_end_date)} />
            <InfoRow label="تاريخ انتهاء بطاقة العمل" value={formatDate(employee.labor_card_end_date)} />
            <InfoRow label="تاريخ انتهاء التأمين الصحي" value={formatDate(employee.health_insurance_end_date)} />
            <InfoRow label="تاريخ انتهاء العقد" value={formatDate(employee.contract_end_date)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfoTab;
