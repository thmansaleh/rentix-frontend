import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { getStatusVariant, getStatusLabel } from "./utils";

export function BasicInfoTab({ carData, t }) {
  return (
    <TabsContent value="basic" className="space-y-4 flex-1 overflow-y-auto">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.plateNumber")}
              </Label>
              <p className="text-lg font-semibold">
                {carData.plate_number || "-"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.status")}
              </Label>
              <div>
                <Badge
                  variant={getStatusVariant(carData.status)}
                  className="text-sm"
                >
                  {getStatusLabel(carData.status, t)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.brand")}
              </Label>
              <p className="text-base">{carData.brand || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.model")}
              </Label>
              <p className="text-base">{carData.model || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.year")}
              </Label>
              <p className="text-base">{carData.year || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.color")}
              </Label>
              <div>
                {carData.color ? (
                  <Badge variant="outline" className="text-sm">
                    {carData.color}
                  </Badge>
                ) : (
                  <p className="text-base">-</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.mileage")}
              </Label>
              <p className="text-base">
                {carData.mileage
                  ? `${carData.mileage.toLocaleString()} km`
                  : "0 km"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.carPrice")}
              </Label>
              <p className="text-base font-semibold text-primary">
                {carData.car_price
                  ? `${parseFloat(carData.car_price).toLocaleString()}`
                  : "-"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("cars.dailyRentalPrice")}
              </Label>
              <p className="text-base font-semibold text-primary">
                {carData.daily_price
                  ? `${parseFloat(carData.daily_price).toFixed(2)}/day`
                  : "-"}
              </p>
            </div>

            {carData.notes && (
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {t("cars.notes")}
                </Label>
                <p className="text-base p-3 bg-muted rounded-md">
                  {carData.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
