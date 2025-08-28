"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, CreditCard, Calendar } from "lucide-react";

export default function StatsCards({ client, formatDate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{client.total_bookings}</p>
              <p className="text-sm dark:text-white text-gray-600">إجمالي الحجوزات</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{client.active_bookings}</p>
              <p className="text-sm dark:text-white text-gray-600">الحجوزات النشطة</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{client.total_spent.toLocaleString()} د.إ</p>
              <p className="text-sm dark:text-white text-gray-600">إجمالي المدفوعات</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatDate(client.last_booking)}</p>
              <p className="text-sm dark:text-white text-gray-600">آخر حجز</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
