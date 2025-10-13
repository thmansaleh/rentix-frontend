"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Group permissions by permission_group_name
  const groupedPermissions = useMemo(() => {
    const groups = {};
    permissions.forEach((permission) => {
      const groupName = permission.permission_group_name;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });
    return groups;
  }, [permissions]);

  // Helper function to get translated group name
  const getGroupNameTranslation = (groupName) => {
    const translations = {
      'case_parties': { ar: 'أطراف القضية', en: 'Case Parties' },
      'case_stages': { ar: 'مراحل القضية', en: 'Case Stages' },
      'case_team': { ar: 'فريق القضية', en: 'Case Team' },
      'clients': { ar: 'العملاء', en: 'Clients' },
      'client_requests': { ar: 'طلبات العملاء', en: 'Client Requests' },
      'employees': { ar: 'الموظفين', en: 'Employees' },
      'executions': { ar: 'التنفيذات', en: 'Executions' },
      'judicial_notices': { ar: 'الإشعارات القضائية', en: 'Judicial Notices' },
      'meetings': { ar: 'الاجتماعات', en: 'Meetings' },
      'memos': { ar: 'المذكرات', en: 'Memos' },
      'petitions': { ar: 'العرائض', en: 'Petitions' },
      'police_stations': { ar: 'مراكز الشرطة', en: 'Police Stations' },
      'sessions': { ar: 'الجلسات', en: 'Sessions' },
      'tasks': { ar: 'المهام', en: 'Tasks' },
      'cases': { ar: 'القضايا', en: 'Cases' },
      'courts': { ar: 'المحاكم', en: 'Courts' },
      'departments': { ar: 'الأقسام', en: 'Departments' },
      'branches': { ar: 'الفروع', en: 'Branches' },
      'roles': { ar: 'الأدوار', en: 'Roles' },
      'permissions': { ar: 'الصلاحيات', en: 'Permissions' },
      'public_prosecutions': { ar: 'النيابات العامة', en: 'Public Prosecutions' },
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
      
      toast.success(isRTL ? 'تم تحديث الصلاحيات بنجاح!' : 'Permissions updated successfully!');
      
      // Revalidate the permissions data
      mutate(`/permissions/employee/${employeeId}`);
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث الصلاحيات. يرجى المحاولة مرة أخرى.' : 'Error updating permissions. Please try again.');
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
        <p>حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">لا توجد بيانات</p>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b last:border-0">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "غير محدد"}</span>
    </div>
  );


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            الدور الوظيفي
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <InfoRow label="الدور" value={employee.role_ar || employee.role_en} />
      
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            الصلاحيات ({permissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">{t('common.loading')}</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-destructive">{t('common.error')}</div>
            </div>
          ) : localPermissions.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">{t('common.noData')}</div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => (
                <div key={groupName} className="border border-border rounded-lg p-4 bg-muted/20">
                  {/* Group Header */}
                  <h3 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    {getGroupNameTranslation(groupName)}
                  </h3>
                  
                  {/* Permissions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupPermissions.map((permission) => {
                      const localPermission = localPermissions.find(p => p.id === permission.id);
                      return (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                        >
                          <Checkbox
                            checked={localPermission?.isPermissionForThisUser === 1}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                            id={`permission-${permission.id}`}
                          />
                          <span className="text-sm text-foreground">
                            {isRTL ? permission.permission_ar : permission.permission_en}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Button */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleUpdate}
          disabled={isSaving}
          className="cursor-pointer"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? (isRTL ? 'جاري التحديث...' : 'Updating...') : (isRTL ? 'تحديث الصلاحيات' : 'Update Permissions')}
        </Button>
      </div>
    </div>
  );
};

export default PermissionsTab;
