import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  Hash,
  Building2,
  FileText,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { formatDate } from "./utils";

function InfoField({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors duration-150">
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Label>
        <div className="text-sm font-medium text-foreground leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}

function DateField({ label, value }) {
  const parsed = value ? new Date(value) : null;
  const isExpired = parsed && parsed < new Date();
  const isSoonExpiring =
    parsed &&
    !isExpired &&
    parsed - new Date() < 1000 * 60 * 60 * 24 * 30; // within 30 days

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors duration-150">
      <div
        className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm
          ${isExpired
            ? "bg-red-50 dark:bg-red-950/30"
            : isSoonExpiring
            ? "bg-amber-50 dark:bg-amber-950/30"
            : "bg-background"
          }`}
      >
        <Calendar
          className={`w-4 h-4
            ${isExpired
              ? "text-red-500"
              : isSoonExpiring
              ? "text-amber-500"
              : "text-muted-foreground"
            }`}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium leading-snug
              ${isExpired
                ? "text-red-500"
                : isSoonExpiring
                ? "text-amber-500"
                : "text-foreground"
              }`}
          >
            {value ? formatDate(value) : <span className="text-muted-foreground">—</span>}
          </span>
          {isExpired && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              Expired
            </span>
          )}
          {isSoonExpiring && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              Expiring soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  };
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

export function RegistrationTab({ carData, t }) {
  return (
    <TabsContent value="registration" className="flex-1 overflow-y-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-6">

          {/* Registration Section */}
          <div className="space-y-3">
            <SectionHeader
              icon={ClipboardList}
              label={t("cars.tabs.registration")}
              color="blue"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="sm:col-span-2">
                <InfoField icon={Hash} label={t("cars.registration.number")}>
                  {carData.registration_number
                    ? <span className="font-mono tracking-wider text-base">{carData.registration_number}</span>
                    : <span className="text-muted-foreground">—</span>
                  }
                </InfoField>
              </div>

              <DateField
                label={t("cars.registration.startDate")}
                value={carData.registration_start}
              />
              <DateField
                label={t("cars.registration.endDate")}
                value={carData.registration_end}
              />

            </div>
          </div>

          {/* Insurance Section */}
          <div className="space-y-3">
            <SectionHeader
              icon={ShieldCheck}
              label={t("cars.tabs.insurance")}
              color="green"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <InfoField icon={Building2} label={t("cars.insurance.company")}>
                {carData.insurance_company || <span className="text-muted-foreground">—</span>}
              </InfoField>

              <InfoField icon={FileText} label={t("cars.insurance.policyNumber")}>
                {carData.insurance_policy_number
                  ? <span className="font-mono tracking-wider">{carData.insurance_policy_number}</span>
                  : <span className="text-muted-foreground">—</span>
                }
              </InfoField>

              <DateField
                label={t("cars.insurance.startDate")}
                value={carData.insurance_start}
              />
              <DateField
                label={t("cars.insurance.endDate")}
                value={carData.insurance_end}
              />

            </div>
          </div>

        </CardContent>
      </Card>
    </TabsContent>
  );
}