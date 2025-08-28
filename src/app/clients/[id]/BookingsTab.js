"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car, FileText } from "lucide-react";

export default function BookingsTab() {
  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <Car className="w-5 h-5" />
          الحجوزات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد حجوزات للعرض</p>
          <p className="text-sm">سيتم عرض جميع حجوزات العميل هنا</p>
        </div>
      </CardContent>
    </Card>
  );
}
