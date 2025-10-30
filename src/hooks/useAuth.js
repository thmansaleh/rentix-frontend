import { useSelector } from 'react-redux';
import { 
  selectAuth, 
  selectIsAuth, 
  selectUser, 
  selectPermissions, 
  selectAuthLoading, 
  selectAuthError 
} from '@/redux/slices/authSlice';

/**
 * Custom hook to access authentication state and user information
 * @returns {Object} Auth state and user data
 */
export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(selectUser);
  const permissions = useSelector(selectPermissions);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  return {
    ...auth,
    isAuth,
    user,
    permissions,
    loading,
    error,
    // Convenience getters
    isAuthenticated: isAuth,
    jobId: auth.jobId,
    email: auth.email,
    roleAr: auth.roleAr,
    roleEn: auth.roleEn,
    departmentAr: auth.departmentAr,
    departmentEn: auth.departmentEn,
  };
};

/**
 * Hook to check if user has specific permission
 * @param {string} permissionName - Permission name to check (Arabic or English)
 * @returns {boolean} Whether user has the permission
 * NOTE: Permission checks disabled - all users have all permissions
 */
export const usePermission = (permissionName) => {
  const permissions = useSelector(selectPermissions);
  const role = useSelector(s => s.auth.roleEn);
  const department = useSelector(s => s.auth.departmentEn);

  // Always return true - permissions disabled for all users
  return { permissions, hasPermission: true, role, department };
};

/**
 * Hook to get user role in preferred language
 * @param {string} language - 'ar' for Arabic, 'en' for English
 * @returns {string|null} User role in specified language
 */
export const useUserRole = (language = 'ar') => {
  const auth = useSelector(selectAuth);
  
  return language === 'ar' ? auth.roleAr : auth.roleEn;
};

/**
 * Hook to get user department in preferred language
 * @param {string} language - 'ar' for Arabic, 'en' for English
 * @returns {string|null} User department in specified language
 */
export const useUserDepartment = (language = 'ar') => {
  const auth = useSelector(selectAuth);
  
  return language === 'ar' ? auth.departmentAr : auth.departmentEn;
};