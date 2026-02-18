import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "./utils";

export function InsuranceTab({ carData, t }) {
  return (
    <TabsContent value="insurance" className="space-y-4 flex-1 overflow-y-auto">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.insurance.company")}
              </Label>
              <p className="text-base">{carData.insurance_company || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.insurance.policyNumber")}
              </Label>
              <p className="text-base font-semibold">
                {carData.insurance_policy_number || "-"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.insurance.startDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.insurance_start)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.insurance.endDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.insurance_end)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
