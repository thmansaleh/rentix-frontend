import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function PermissionsModal({ trigger }) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [checkedPermissions, setCheckedPermissions] = useState([]);

    // Create permissions list from translations
    const permissionsList = [
        t('admins.permissionsList.addCar'),
        t('admins.permissionsList.editCar'),
        t('admins.permissionsList.deleteCar'),
        t('admins.permissionsList.manageUsers'),
        t('admins.permissionsList.viewStats'),
        t('admins.permissionsList.changeSettings'),
        t('admins.permissionsList.addClient'),
        t('admins.permissionsList.editClient'),
        t('admins.permissionsList.deleteClient'),
        t('admins.permissionsList.addBooking'),
        t('admins.permissionsList.editBooking'),
        t('admins.permissionsList.deleteBooking'),
        t('admins.permissionsList.addContract'),
        t('admins.permissionsList.editContract'),
        t('admins.permissionsList.deleteContract'),
        t('admins.permissionsList.addFine'),
        t('admins.permissionsList.editFine'),
        t('admins.permissionsList.deleteFine'),
        t('admins.permissionsList.manageBills'),
        t('admins.permissionsList.managePayments'),
        t('admins.permissionsList.manageFleet'),
        t('admins.permissionsList.manageMaintenance'),
        t('admins.permissionsList.manageInsurance'),
        t('admins.permissionsList.manageNotifications'),
        t('admins.permissionsList.managePermissions'),
        t('admins.permissionsList.exportData'),
        t('admins.permissionsList.importData'),
        t('admins.permissionsList.viewLogs'),
        t('admins.permissionsList.changePassword'),
        t('admins.permissionsList.changeLanguage')
    ];

    const handleTogglePermission = (perm) => {
        setCheckedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
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
                    {t('admins.permissions')}
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
                            <h2 className="text-xl font-semibold text-foreground">{t('admins.permissions')}</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                {permissionsList.map((perm) => (
                                    <label
                                        key={perm}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                                    >
                                        <Checkbox
                                            checked={checkedPermissions.includes(perm)}
                                            onCheckedChange={() => handleTogglePermission(perm)}
                                            id={perm}
                                        />
                                        <span className="text-sm text-foreground">{perm}</span>
                                    </label>
                                ))}
                            </div>
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
                                onClick={() => setOpen(false)}
                                className="cursor-pointer"
                            >
                                {t('buttons.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}