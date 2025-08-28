import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

// Logs array
const logs = [
  { id: 1, action: "تسجيل دخول", timestamp: "2025-07-30 14:30:25", status: "نجح", description: "تم تسجيل الدخول بنجاح." },
  { id: 2, action: "تحديث الملف الشخصي", timestamp: "2025-07-30 13:45:12", status: "نجح", description: "تم تحديث بيانات الملف الشخصي." },
  { id: 3, action: "تغيير كلمة المرور", timestamp: "2025-07-30 12:20:08", status: "نجح", description: "تم تغيير كلمة المرور." },
  { id: 4, action: "محاولة تسجيل دخول فاشلة", timestamp: "2025-07-30 11:15:33", status: "فشل", description: "فشلت محاولة تسجيل الدخول." },
  { id: 5, action: "انشاء عقد", timestamp: "2025-07-30 16:00:00", status: "نجح", description: "تم إنشاء عقد جديد للعميل عبدالله هاتف رقم 08508408." },
  { id: 6, action: "اضافة عميل", timestamp: "2025-07-30 16:10:00", status: "نجح", description: "تمت إضافة العميل عبدالله هاتف رقم 08508408." },
  { id: 7, action: "حذف عميل", timestamp: "2025-07-30 16:20:00", status: "نجح", description: "تم حذف العميل عبدالله هاتف رقم 08508408 من النظام." },
  { id: 8, action: "حذف مستخدم", timestamp: "2025-07-30 15:20:10", status: "نجح", description: "تم حذف مستخدم من النظام." },
  { id: 9, action: "تعديل صلاحيات المستخدم", timestamp: "2025-07-30 14:10:05", status: "نجح", description: "تم تعديل صلاحيات المستخدم." }
];

const getStatusColor = (status) =>
  status === "نجح" ? "text-white bg-green-600" : status === "فشل" ? "text-white bg-red-500" : "text-gray-600";

// Helper to get subtitle
const getSubtitle = (a) => {
  if (a.action === "تسجيل دخول" || a.action === "محاولة تسجيل دخول فاشلة") {
    return a.timestamp.split(" ")[1]; // show only time
  }
  if (a.action === "تغيير كلمة المرور") {
    return `كلمة المرور الجديدة: ****** - ${a.timestamp.split(" ")[1]}`;
  }
  // For new actions, just show the time
  if (
    a.action === "انشاء عقد" ||
    a.action === "اضافة عميل" ||
    a.action === "حذف عميل"
  ) {
    return a.timestamp.split(" ")[1];
  }
  return a.timestamp.split(" ")[1];
};

export default function ActivityLogModal({ trigger }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const activities = logs
    .filter((a) => filter === "all" || (filter === "success" && a.status === "نجح") || (filter === "failed" && a.status === "فشل"))
    .sort((a, b) => (sortBy === "newest" ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp)));

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">{t('admins.activityLogTitle')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-2 p-4 border-b">
              <Select dir="rtl" value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32"><SelectValue placeholder={t('admins.filter')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admins.all')}</SelectItem>
                  <SelectItem value="success">{t('admins.success')}</SelectItem>
                  <SelectItem value="failed">{t('admins.failed')}</SelectItem>
                </SelectContent>
              </Select>
              <Select dir="rtl"  value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32"><SelectValue placeholder={t('admins.sort')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('admins.newest')}</SelectItem>
                  <SelectItem value="oldest">{t('admins.oldest')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activities.length === 0 ? (
                <div className="text-center text-gray-500">{t('admins.noActivities')}</div>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="py-2 border-b ">
                    <div className="flex justify-between items-center ">
                      <span>{a.action}</span>
                      <Badge className={getStatusColor(a.status)}>{a.status}</Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{getSubtitle(a)}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.description}</div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => setOpen(false)}>{t('admins.close')}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}