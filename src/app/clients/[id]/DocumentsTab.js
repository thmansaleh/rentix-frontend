"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IdCard, BadgeCheck } from "lucide-react";

export default function DocumentsTab({ client, formatDate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <IdCard className="w-5 h-5" />
            الهوية / الجواز
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2  gap-4">
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">رقم الهوية / الجواز</label>
            <p className="text-sm font-mono">{client.id_number}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">تاريخ الانتهاء</label>
            <p className="text-sm">{formatDate(client.id_expiry)}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">تاريخ الإصدار</label>
            <p className="text-sm">{formatDate(client.id_issue)}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">بلد الإصدار</label>
            <p className="text-sm">{client.id_country}</p>
          </div>
        </CardContent>
      </Card>
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <BadgeCheck className="w-5 h-5" />
            رخصة القيادة
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2  gap-4">
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">رقم الرخصة</label>
            <p className="text-sm font-mono">{client.driver_license_number}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">تاريخ الإصدار</label>
            <p className="text-sm">{formatDate(client.driver_license_issue)}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">تاريخ الانتهاء</label>
            <p className="text-sm">{formatDate(client.driver_license_expiry)}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">بلد الإصدار</label>
            <p className="text-sm">{client.license_country}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium dark:text-white text-gray-700">مدينة الإصدار</label>
            <p className="text-sm">{client.license_city}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
