"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";

export default function HistoryTab() {
  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <Clock className="w-5 h-5" />
          سجل النشاطات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8  dark:text-white  text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا يوجد سجل للعرض</p>
          <p className="text-sm">سيتم عرض جميع أنشطة العميل هنا</p>
        </div>
      </CardContent>
    </Card>
  );
}
