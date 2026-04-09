import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/useTranslations";

export function InfoField({ label, value, icon: Icon }) {
  const { t } = useTranslations();

  return (
    <Card className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </Label>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1 break-words">
            {value || (
              <span className="text-gray-400 italic">
                {t("clients.view.fields.notProvided")}
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
