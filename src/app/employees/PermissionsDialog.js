import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, X, Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { assignPermissionsToEmployee, getEmployeePermissions } from "@/app/services/api/employees";
import useSWR from "swr";
import { toast } from 'react-toastify';
import { useLanguage } from "@/contexts/LanguageContext";

export default function PermissionsModal({ trigger,id }) {
    const { t } = useTranslations();
    const [open, setOpen] = useState(false);
    const [localPermissions, setLocalPermissions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const {isRTL} = useLanguage();

    // Fetch employee permissions using SWR
    const { data: permissionsData, error, isLoading } = useSWR(
        id ? `/permissions/employee/${id}` : null,
        () => getEmployeePermissions(id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    const permissions = permissionsData?.data || [];

    // Initialize local permissions when data is loaded
    React.useEffect(() => {
        if (permissions.length > 0) {
            setLocalPermissions(permissions);
        }
    }, [permissions]);

    const handleTogglePermission = (permissionId) => {
        setLocalPermissions((prev) =>
            prev.map((permission) =>
                permission.id === permissionId
                    ? { ...permission, isPermissionForThisUser: permission.isPermissionForThisUser === 1 ? 0 : 1 }
                    : permission
            )
        );
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };
    const handleSave = async () => {
        if (isSaving) return; // Prevent multiple submissions
        
        // Get only the IDs of permissions that are set to true (checked)
        const updatedPermissions = localPermissions
            .filter(permission => permission.isPermissionForThisUser === 1)
            .map(permission => permission.id);
        
        setIsSaving(true);
        
        try {
            const result = await assignPermissionsToEmployee(id, updatedPermissions);
            console.log('Saved permissions:', updatedPermissions);
            
            toast.success(t('messages.permissionsSavedSuccessfully') || 'Permissions saved successfully!');
            setOpen(false);
        } catch (error) {
            console.error('Error saving permissions:', error);
            toast.error(t('messages.errorSavingPermissions') || 'Error saving permissions. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* Trigger */}
            {trigger ? (
                <div onClick={() => setOpen(true)}>
                    {trigger}
                </div>
            ) : (
                <button
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-muted rounded text-right cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    {t('employees.permissions')}
                </button>
            )}

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleOverlayClick}
                >
                    <div
                        className="bg-card rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-border"
                        dir="rtl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-foreground">{t('employees.permissions')}</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {localPermissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                                        >
                                            <Checkbox
                                                checked={permission.isPermissionForThisUser === 1}
                                                onCheckedChange={() => handleTogglePermission(permission.id)}
                                                id={`permission-${permission.id}`}
                                            />
                                            <span className="text-sm text-foreground">
                                                {isRTL ? permission.permission_ar : permission.permission_en}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-6 border-t border-border bg-muted/30">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="cursor-pointer"
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="cursor-pointer"
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? (t('buttons.saving') || 'Saving...') : t('buttons.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}