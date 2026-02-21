import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye, Edit, Trash2, Plus } from "lucide-react";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "react-toastify";

const getStatusColor = (status) => {
  const colors = {
    draft: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300",
    active: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300",
    cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300",
  };
  return colors[status] || colors.draft;
};

const getStatusLabel = (status, isRTL) => {
  const labels = {
    draft:      isRTL ? "مسودة"   : "Draft",
    active:     isRTL ? "نشط"     : "Active",
    completed:  isRTL ? "مكتمل"   : "Completed",
    cancelled:  isRTL ? "ملغى"    : "Cancelled",
  };
  return labels[status] || status;
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount) return "0.00";
  return parseFloat(amount).toFixed(2);
};

export function ContractsTab({
  contracts,
  isRTL,
  onViewContract,
  onEditContract,
  onAddContract,
  onReloadContracts,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (contract) => {
    const confirmMsg = isRTL
      ? `هل أنت متأكد من حذف العقد رقم ${contract.contract_number || contract.id}؟`
      : `Are you sure you want to delete contract #${contract.contract_number || contract.id}?`;

    if (!confirm(confirmMsg)) return;

    setDeletingId(contract.id);
    try {
      await deleteContract(contract.id);
      toast.success(isRTL ? "تم حذف العقد بنجاح" : "Contract deleted successfully");
      onReloadContracts();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (isRTL ? "حدث خطأ أثناء حذف العقد" : "Error deleting contract")
      );
    } finally {
      setDeletingId(null);
    }
  };

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
              <p className="text-sm text-muted-foreground mt-1">
                {contracts.length}{" "}
                {isRTL ? "عقد مسجل" : "contract(s) recorded"}
              </p>
            </div>
            <Button size="sm" onClick={onAddContract} className="gap-2">
              <Plus className="w-4 h-4" />
              {isRTL ? "عقد جديد" : "New Contract"}
            </Button>
          </div>

          {contracts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "لا توجد عقود مسجلة لهذه السيارة"
                  : "No contracts recorded for this car"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? "رقم العقد" : "Contract #"}</TableHead>
                      <TableHead>{isRTL ? "العميل" : "Customer"}</TableHead>
                      <TableHead>{isRTL ? "تاريخ البدء" : "Start Date"}</TableHead>
                      <TableHead>{isRTL ? "تاريخ الانتهاء" : "End Date"}</TableHead>
                      <TableHead>{isRTL ? "المبلغ الإجمالي" : "Total"}</TableHead>
                      <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {contract.contract_number || `#${contract.id}`}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {contract.customer_name || "-"}
                            </div>
                            {contract.customer_phone && (
                              <div className="text-xs text-muted-foreground">
                                {contract.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(contract.start_date)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(contract.end_date)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatCurrency(contract.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(contract.status)}`}>
                            {getStatusLabel(contract.status, isRTL)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title={isRTL ? "عرض" : "View"}
                              onClick={() => onViewContract(contract.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title={isRTL ? "تعديل" : "Edit"}
                              onClick={() => onEditContract(contract.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              title={isRTL ? "حذف" : "Delete"}
                              disabled={deletingId === contract.id}
                              onClick={() => handleDelete(contract)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
