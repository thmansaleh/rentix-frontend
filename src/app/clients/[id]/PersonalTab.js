"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";

export default function PersonalTab({ client, formatDate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <User className="w-5 h-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2  gap-4">
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">الاسم بالعربية</label>
            <p className="text-sm">{client.name_ar}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">الاسم بالإنجليزية</label>
            <p className="text-sm">{client.name_en}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">تاريخ الميلاد</label>
            <p className="text-sm">{formatDate(client.date_of_birth)}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">البريد الإلكتروني</label>
            <p className="text-sm">{client.email}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">رقم الهاتف</label>
            <p className="text-sm">{client.phone}</p>
          </div>
        </CardContent>
      </Card>
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <MapPin className="w-5 h-5" />
            معلومات العنوان
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2  gap-4">
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">العنوان</label>
            <p className="text-sm">{client.address}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">المدينة</label>
            <p className="text-sm">{client.city}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium ">البلد</label>
            <p className="text-sm">{client.country}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
