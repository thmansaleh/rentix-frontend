import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "./utils";

export function RegistrationTab({ carData, t }) {
  return (
    <TabsContent value="registration" className="space-y-4 flex-1 overflow-y-auto">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.registration.number")}
              </Label>
              <p className="text-lg font-semibold">
                {carData.registration_number || "-"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.registration.startDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.registration_start)}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {t("cars.registration.endDate")}
              </Label>
              <p className="text-base">
                {formatDate(carData.registration_end)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
