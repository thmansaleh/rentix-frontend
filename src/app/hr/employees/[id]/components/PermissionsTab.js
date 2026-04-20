"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import useSWR, { mutate } from "swr";
import { getEmployeeById, getEmployeePermissions, assignPermissionsToEmployee } from "@/app/services/api/employees";
import { toast } from 'react-toastify';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

const PermissionsTab = ({ employeeId }) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [localPermissions, setLocalPermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch employee data for role info
  const { data: employeeData, error: employeeError, isLoading: employeeLoading } = useSWR(
    employeeId ? `/employees/${employeeId}` : null,
    () => getEmployeeById(employeeId),
    {
      revalidateOnFocus: false,
    }
  );

  // Fetch employee permissions
  const { data: permissionsData, error: permissionsError, isLoading: permissionsLoading } = useSWR(
    employeeId ? `/permissions/employee/${employeeId}` : null,
    () => getEmployeePermissions(employeeId),
    {
      revalidateOnFocus: false,
    }
  );

  const isLoading = employeeLoading || permissionsLoading;
  const error = employeeError || permissionsError;

  const employee = employeeData?.data;
  const permissions = permissionsData?.data || [];

  // Initialize local permissions when data is loaded
  React.useEffect(() => {
    if (permissions.length > 0) {
      setLocalPermissions(permissions);
    }
  }, [permissions]);

  // Group permissions by permission_parent_name, then by permission_group_name
  const groupedPermissions = useMemo(() => {
    const parents = {};
    permissions.forEach((permission) => {
      const parentName = permission.permission_parent_name;
      const groupName = permission.permission_group_name;
      
      if (!parents[parentName]) {
        parents[parentName] = {};
      }
      if (!parents[parentName][groupName]) {
        parents[parentName][groupName] = [];
      }
      parents[parentName][groupName].push(permission);
    });
    return parents;
  }, [permissions]);

  // Helper function to get translated parent name
  const getParentNameTranslation = (parentName) => {
    const translations = {
      'hr': { ar: 'الموارد البشرية', en: 'Human Resources' },
      'cases': { ar: 'القضايا', en: 'Cases' },
      'parties': { ar: 'الموكلين', en: 'Parties' },
      'finance': { ar: 'المالية', en: 'Finance' },
      'settings': { ar: 'الإعدادات', en: 'Settings' },
    };

    const translation = translations[parentName];
    if (translation) {
      return isRTL ? translation.ar : translation.en;
    }
    
    // Fallback to formatted name if no translation found
    return parentName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get translated group name
  const getGroupNameTranslation = (groupName) => {
    const translations = {
      'annual_leaves': { ar: 'الإجازات السنوية', en: 'Annual Leaves' },
      'attendance': { ar: 'الحضور', en: 'Attendance' },
      'case_classifications': { ar: 'تصنيفات القضايا', en: 'Case Classifications' },
      'case_degrees': { ar: 'درجات التقاضي', en: 'Court Degrees' },
      'case_documents': { ar: 'مستندات القضايا', en: 'Case Documents' },
      'case_parties': { ar: 'أطراف القضية', en: 'Case Parties' },
      'case_types': { ar: 'أنواع القضايا', en: 'Case Types' },
      'cases': { ar: 'القضايا', en: 'Cases' },
      'client_deals': { ar: 'الاتفاقيات', en: 'Deals' },
      'courts': { ar: 'المحاكم', en: 'Courts' },
      'deductions': { ar: 'الخصومات', en: 'Deductions' },
      'employee_documents': { ar: 'مستندات الموظفين', en: 'Employee Documents' },
      'employee_requests': { ar: 'طلبات الموظفين', en: 'Employee Requests' },
      'executions': { ar: 'التنفيذات', en: 'Executions' },
      'forms': { ar: 'النماذج', en: 'Forms' },
      'hr_notifications': { ar: 'تنبيهات الموارد البشرية', en: 'HR Notifications' },
      'judicial_notices': { ar: 'الإشعارات القضائية', en: 'Judicial Notices' },
      'meetings': { ar: 'الاجتماعات', en: 'Meetings' },
      'memos': { ar: 'المذكرات', en: 'Memos' },
      'other_leaves': { ar: 'إجازات أخرى', en: 'Other Leaves' },
      'parties': { ar: 'الموكلين', en: 'Parties' },
      'party_documents': { ar: 'مستندات الموكلين', en: 'Party Documents' },
      'party_orders': { ar: 'طلبات الموكلين', en: 'Party Orders' },
      'performance': { ar: 'الأداء', en: 'Performance' },
      'petitions': { ar: 'العرائض', en: 'Petitions' },
      'reviews': { ar: 'التقييمات', en: 'Reviews' },
      'sessions': { ar: 'الجلسات', en: 'Sessions' },
      'sick_leaves': { ar: 'الإجازات المرضية', en: 'Sick Leaves' },
      'tasks': { ar: 'المهام', en: 'Tasks' },
      'trainings': { ar: 'التدريبات', en: 'Trainings' },
    };

    const translation = translations[groupName];
    if (translation) {
      return isRTL ? translation.ar : translation.en;
    }
    
    // Fallback to formatted name if no translation found
    return groupName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleTogglePermission = (permissionId) => {
    setLocalPermissions((prev) =>
      prev.map((permission) =>
        permission.id === permissionId
          ? { ...permission, isPermissionForThisUser: permission.isPermissionForThisUser === 1 ? 0 : 1 }
          : permission
      )
    );
  };

  const handleUpdate = async () => {
    if (isSaving) return; // Prevent multiple submissions
    
    // Get only the IDs of permissions that are set to true (checked)
    const updatedPermissions = localPermissions
      .filter(permission => permission.isPermissionForThisUser === 1)
      .map(permission => permission.id);
    
    setIsSaving(true);
    
    try {
      await assignPermissionsToEmployee(employeeId, updatedPermissions);
      
      toast.success(t('messages.permissionsSavedSuccessfully'));
      
      // Revalidate the permissions data
      mutate(`/permissions/employee/${employeeId}`);
    } catch (error) {
      toast.error(t('messages.errorSavingPermissions'));
    } finally {
      setIsSaving(false);
    }
  };

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
        <p>{t('common.errorLoading')}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Role + Save row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>{t('employees.role')}:</span>
          <span className="font-medium text-foreground">
            {isRTL ? employee.role_ar : employee.role_en}
          </span>
        </div>
        <Button size="sm" onClick={handleUpdate} disabled={isSaving} className="cursor-pointer h-8">
          {isSaving && <Loader2 className={isRTL ? "ml-1.5 h-3 w-3 animate-spin" : "mr-1.5 h-3 w-3 animate-spin"} />}
          {isSaving ? t('common.saving') : t('common.update')}
        </Button>
      </div>

      {/* Permissions */}
      {localPermissions.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          {t('common.noData')}
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedPermissions).map(([parentName, groups]) => (
            <div key={parentName} className="border border-border rounded-lg overflow-hidden">
              {/* Parent Header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-semibold">{getParentNameTranslation(parentName)}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4 ml-auto">
                  {Object.values(groups).flat().length}
                </Badge>
              </div>

              {/* Groups */}
              <div className="divide-y divide-border/50">
                {Object.entries(groups).map(([groupName, groupPermissions]) => (
                  <div key={groupName} className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      {getGroupNameTranslation(groupName)}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-1">
                      {groupPermissions.map((permission) => {
                        const localPermission = localPermissions.find(p => p.id === permission.id);
                        return (
                          <label
                            key={permission.id}
                            className="flex items-center gap-1.5 cursor-pointer py-0.5 group"
                          >
                            <Checkbox
                              checked={localPermission?.isPermissionForThisUser === 1}
                              onCheckedChange={() => handleTogglePermission(permission.id)}
                              id={`permission-${permission.id}`}
                              className="h-3.5 w-3.5"
                            />
                            <span className="text-xs text-foreground group-hover:text-primary transition-colors truncate">
                              {isRTL ? permission.permission_ar : permission.permission_en}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsTab;
