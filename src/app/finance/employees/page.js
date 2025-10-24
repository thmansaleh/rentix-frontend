"use client";

import { useState } from "react";
import useSWR from "swr";
import { getEmployees } from "@/app/services/api/employees";
import { usePermission } from "@/hooks/usePermission";
import { EmployeeAccountStatementModal } from "./EmployeeAccountStatementModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Users, Search } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { is } from "date-fns/locale";

function EmployeesFinancePage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const { hasPermission: canView } = usePermission('View Employee');
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employees
  const { data: employeesResponse, error, isLoading } = useSWR(
    '/employees',
    getEmployees,
    {
      revalidateOnFocus: false,
    }
  );

  const employees = employeesResponse?.data || [];

  // Filter employees by search query
  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.name?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      employee.department?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewStatement = (employee) => {
    setSelectedEmployee(employee);
    setIsStatementModalOpen(true);
  };

  const handleCloseStatementModal = () => {
    setIsStatementModalOpen(false);
    setSelectedEmployee(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        label: language === 'ar' ? 'نشط' : 'Active' 
      },
      inactive: { 
        color: "bg-red-100 text-red-800 border-red-200", 
        label: language === 'ar' ? 'غير نشط' : 'Inactive' 
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">
                {language === 'ar' ? 'كشوف حسابات الموظفين' : 'Employee Account Statements'}
              </CardTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'ar' 
              ? 'عرض وإدارة كشوف حسابات الموظفين المالية' 
              : 'View and manage employee financial account statements'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'بحث بالاسم، البريد الإلكتروني، أو القسم...' : 'Search by name, email, or department...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
                </span>
              </div>
              <p className="text-2xl font-bold">{filteredEmployees.length}</p>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2">
                  {language === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p>{language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'لا يوجد موظفين' : 'No employees found'}
                </p>
                <p className="text-sm">
                  {searchQuery 
                    ? (language === 'ar' ? 'لا توجد نتائج للبحث' : 'No search results found')
                    : (language === 'ar' ? 'لم يتم العثور على موظفين' : 'No employees available')
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ar' ? 'الرقم الوظيفي' : 'Employee ID'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                    <TableHead>{language === 'ar' ? 'القسم' : 'Department'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الوظيفة' : 'Job Title'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">#{employee.id}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{ employee.department_ar || employee.department_en || "-"}</TableCell>
                      <TableCell>{employee.role_ar || employee.role_en || "-"}</TableCell>
                      <TableCell>
                        {getStatusBadge(employee.status)}
                      </TableCell>
                      <TableCell>
                        {canView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewStatement(employee)}
                            title={language === 'ar' ? 'عرض كشف الحساب' : 'View Account Statement'}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Results info */}
          {filteredEmployees.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {language === 'ar' 
                ? `عرض ${filteredEmployees.length} موظف`
                : `Showing ${filteredEmployees.length} employee(s)`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Account Statement Modal */}
      <EmployeeAccountStatementModal
        isOpen={isStatementModalOpen}
        onClose={handleCloseStatementModal}
        employee={selectedEmployee}
      />
    </div>
  );
}

export default EmployeesFinancePage;
