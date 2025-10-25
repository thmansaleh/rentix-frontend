import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CircleX, Clock, AlertCircle } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import useSWR from "swr";
import { getEmployeeLogs } from "@/app/services/api/logs";

// Helper to format date from ISO string
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-AE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Helper to format time from ISO string
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ar-AE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper to get status badge color
const getStatusColor = (action) => {
  switch (action) {
    case "login":
      return "text-white bg-green-600";
    case "logout":
      return "text-white bg-blue-600";
    case "add":
      return "text-white bg-green-500";
    case "update":
      return "text-white bg-blue-500";
    case "delete":
      return "text-white bg-red-600";
    case "error":
    case "failed_login":
      return "text-white bg-red-500";
    case "warning":
      return "text-white bg-yellow-500";
    case "other":
      return "text-white bg-gray-500";
    default:
      return "text-gray-600 bg-gray-200";
  }
};

// Helper to translate action types
const getActionLabel = (action) => {
  const actionLabels = {
    login: "تسجيل دخول",
    logout: "تسجيل خروج",
    add: "إضافة",
    update: "تحديث",
    delete: "حذف",
    error: "خطأ",
    failed_login: "فشل تسجيل دخول",
    warning: "تحذير",
    other: "آخر"
  };
  return actionLabels[action] || action;
};

export default function ActivityLogModal({ trigger, employee }) {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const employeeId = employee?.id;

  // Fetch employee logs using SWR with the existing service function
  // Only fetch when modal is open and employeeId exists
  const { data, error, isLoading, mutate } = useSWR(
    open && employeeId ? `employee-logs-${employeeId}` : null,
    () => {
      return getEmployeeLogs(employeeId);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  // Show warning if employeeId is missing
  if (open && !employeeId) {
    console.warn('ActivityLogModal opened but employeeId is missing!');
  }

  // Extract logs from API response
  const logs = data?.data || [];

  // Sort logs
  const filteredLogs = logs.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">{t('admins.activityLogTitle')}</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <CircleX className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 p-4 border-b">
              <Select dir="rtl" value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t('admins.sort')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => mutate()}
                disabled={isLoading}
              >
                تحديث
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">جاري تحميل السجلات...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-8">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>حدث خطأ في تحميل السجلات. يرجى المحاولة مرة أخرى.</span>
                  </div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                  <Clock className="w-12 h-12 mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">لا توجد سجلات</h3>
                  <p className="text-sm text-center">لم يتم العثور على سجلات لهذا الموظف حتى الآن.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{log.employee_name}</h4>
                            <Badge className={getStatusColor(log.action)}>
                              {getActionLabel(log.action)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{log.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.created_at)} - {formatTime(log.created_at)}
                        </span>
                        <span className="text-gray-400">#{log.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {!isLoading && !error && data?.success && (
                  <span>عدد السجلات: {filteredLogs.length}</span>
                )}
              </div>
              <Button onClick={() => setOpen(false)}>إغلاق</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}