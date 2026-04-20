import React, { useState } from 'react';
import { LogOut, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { changePassword } from '@/app/services/api/auth';

/**
 * Sidebar Footer Component
 * Displays user profile information and logout button
 */
const SidebarFooter = ({ user, userRole, isRTL, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      toast.error(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error(isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success(isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || (isRTL ? 'فشل تغيير كلمة المرور' : 'Failed to change password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer className="p-4 bg-sidebar border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-xl p-3 border border-sidebar-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(user?.employeeName || user?.name) ? (user.employeeName || user.name).charAt(0) : 'U'}
            </div>
            <div className="flex-1 transition-opacity duration-300">
              <p className="text-sidebar-foreground font-medium text-sm">
                {user?.employeeName || user?.name || (isRTL ? 'مستخدم' : 'User')}
              </p>
              <p className="text-sidebar-foreground/70 text-xs">
                {userRole || (isRTL ? 'مستخدم' : 'User')}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="text-sidebar-foreground/70 hover:text-blue-500 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              title={isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="text-sidebar-foreground/70 hover:text-red-600 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label={isRTL ? 'تسجيل الخروج' : 'Logout'}
              title={isRTL ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="bg-background rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">
              {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                    required
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-9"
                    placeholder={isRTL ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                    required
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-9"
                    placeholder={isRTL ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                    required
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-9"
                    placeholder={isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-2 flex items-center text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
                >
                  {loading ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border border-input text-sm font-medium rounded-md px-4 py-2 hover:bg-accent transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarFooter;

