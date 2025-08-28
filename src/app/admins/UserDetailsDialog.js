import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserDetailsDialog({ trigger, admin }) {
  const t = useTranslations();
  
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-gray-600" />
            {t('admins.userDetails')}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold">{t('admins.username')}:</span> {admin.username}</div>
          <div><span className="font-semibold">{t('admins.password')}:</span> {admin.password}</div>
          <div><span className="font-semibold">{t('admins.name')}:</span> {admin.name}</div>
          <div><span className="font-semibold">{t('admins.email')}:</span> {admin.email}</div>
          <div><span className="font-semibold">{t('admins.role')}:</span> {admin.role}</div>
          <div><span className="font-semibold">{t('admins.department')}:</span> {admin.department}</div>
          <div><span className="font-semibold">{t('admins.status')}:</span> {admin.status}</div>
          <div><span className="font-semibold">{t('admins.lastLogin')}:</span> {admin.lastLogin}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
