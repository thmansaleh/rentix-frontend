'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SessionSettings({ formik, isRtl }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Settings className="h-4 w-4 text-gray-500" />
        <h3 className="text-md font-medium text-gray-900">
          {isRtl ? "إعدادات الجلسة" : "Session Settings"}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Session Status Switch */}
        <div className={cn(
          "p-4 rounded-lg",
          formik.values.is_judgment_reserved ? "bg-red-50 border-2 border-red-200" : "bg-gray-50"
        )}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label 
                htmlFor="status" 
                className="text-sm font-medium text-gray-700"
              >
                {isRtl ? "حالة الجلسة" : "Session Status"}
              </Label>
              <p className="text-xs text-gray-500">
                {formik.values.status 
                  ? (isRtl ? "الجلسة نشطة" : "Session is active")
                  : (isRtl ? "الجلسة غير نشطة" : "Session is inactive")
                }
                {formik.values.is_judgment_reserved && (
                  <span className="block text-red-600 font-medium mt-1">
                    {isRtl ? "تم تعطيل الجلسة تلقائياً بسبب حجز الحكم" : "Session auto-disabled due to judgment reserved"}
                  </span>
                )}
              </p>
            </div>
            <Switch
              id="status"
              checked={formik.values.status}
              onCheckedChange={(checked) => 
                formik.setFieldValue("status", checked)
              }
              disabled={formik.values.is_judgment_reserved}
            />
          </div>
        </div>

        {/* Expert Session Switch */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label 
                htmlFor="is_expert_session" 
                className="text-sm font-medium text-gray-700"
              >
                {isRtl ? "جلسة خبير" : "Expert Session"}
              </Label>
              <p className="text-xs text-gray-500">
                {formik.values.is_expert_session 
                  ? (isRtl ? "هذه جلسة خبير" : "This is an expert session")
                  : (isRtl ? "ليست جلسة خبير" : "Not an expert session")
                }
              </p>
            </div>
            <Switch
              id="is_expert_session"
              checked={formik.values.is_expert_session}
              onCheckedChange={(checked) => 
                formik.setFieldValue("is_expert_session", checked)
              }
            />
          </div>
        </div>

        {/* Judgment Reserved Switch */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label 
                htmlFor="is_judgment_reserved" 
                className="text-sm font-medium text-gray-700"
              >
                {isRtl ? "حجز للحكم" : "Judgment Reserved"}
              </Label>
              <p className="text-xs text-gray-500">
                {formik.values.is_judgment_reserved 
                  ? (isRtl ? "الحكم محجوز" : "Judgment is reserved")
                  : (isRtl ? "الحكم غير محجوز" : "Judgment is not reserved")
                }
              </p>
            </div>
            <Switch
              id="is_judgment_reserved"
              checked={formik.values.is_judgment_reserved}
              onCheckedChange={(checked) => {
                formik.setFieldValue("is_judgment_reserved", checked);
                // If judgment is reserved, set status to inactive
                if (checked) {
                  formik.setFieldValue("status", false);
                }
              }}
            />
          </div>
        </div>

        {/* Has Ruling Switch */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label 
                htmlFor="has_ruling" 
                className="text-sm font-medium text-gray-700"
              >
                {isRtl ? "حكم صادر" : "Has Ruling"}
              </Label>
              <p className="text-xs text-gray-500">
                {formik.values.has_ruling 
                  ? (isRtl ? "يوجد حكم صادر" : "Ruling has been issued")
                  : (isRtl ? "لا يوجد حكم" : "No ruling issued")
                }
              </p>
            </div>
            <Switch
              id="has_ruling"
              checked={formik.values.has_ruling}
              onCheckedChange={(checked) => 
                formik.setFieldValue("has_ruling", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
