'use client';
import { useDispatch } from 'react-redux';
import { useAuth, usePermission, useUserRole, useUserDepartment } from '@/hooks/useAuth';
import { logoutWithRedux } from '@/app/services/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Briefcase, Building } from 'lucide-react';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    isAuthenticated, 
    jobId, 
    email, 
    permissions, 
    loading 
  } = useAuth();
  
  const roleAr = useUserRole('ar');
  const roleEn = useUserRole('en');
  const departmentAr = useUserDepartment('ar');
  const departmentEn = useUserDepartment('en');
  
  const hasTaskManagement = usePermission('إدارة المهام');

  const handleLogout = async () => {
    await dispatch(logoutWithRedux());
  };

  if (!isAuthenticated) {
    return null; // AuthProvider will handle showing login
  }

  return (
    <div className="max-w-2xl mx-auto p-4" dir="rtl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">الملف الشخصي</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {user && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">معرف الوظيفة: {jobId}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <Briefcase className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">{roleAr}</p>
                  <p className="text-sm text-gray-500">{roleEn}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <Building className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">{departmentAr}</p>
                  <p className="text-sm text-gray-500">{departmentEn}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">البريد الإلكتروني:</p>
                <p className="font-medium">{email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">الصلاحيات:</p>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission) => (
                    <Badge 
                      key={permission.permission_id} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {permission.permission_ar}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {hasTaskManagement && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ لديك صلاحية إدارة المهام
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;