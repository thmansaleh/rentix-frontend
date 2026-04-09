import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { FileText, Plus, Loader2 } from "lucide-react";
import { getContractsByCarId } from "../../services/api/contracts";
import ContractsTable from "@/app/contracts/ContractsTable";

export function ContractsTab({
  carId,
  isActive,
  isRTL,
  onAddContract,
  carStatus,
}) {
  const { data: contractsResponse, isLoading, mutate } = useSWR(
    isActive && carId ? `car-contracts-${carId}` : null,
    () => getContractsByCarId(carId),
    { revalidateOnFocus: false }
  );

  const contracts = contractsResponse?.data || [];

  return (
    <TabsContent value="contracts" className="space-y-4 flex-1 overflow-y-auto">
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {isRTL ? "عقود السيارة" : "Car Contracts"}
              </Label>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {contracts.length}{" "}
                  {isRTL ? "عقد مسجل" : "contract(s) recorded"}
                </p>
              )}
            </div>
            <Button size="sm" onClick={onAddContract} className="gap-2" disabled={carStatus !== 'available'}>
              <Plus className="w-4 h-4" />
              {isRTL ? "عقد جديد" : "New Contract"}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <ContractsTable contracts={contracts} onMutate={mutate} />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
