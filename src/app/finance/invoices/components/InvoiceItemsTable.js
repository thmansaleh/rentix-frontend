"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount } from "../utils/formatters";
import { ITEM_TYPES, DEFAULT_INVOICE_ITEM } from "../constants";

/**
 * Editable table of invoice line items.
 */
export default function InvoiceItemsTable({
  items,
  onItemsChange,
  language,
  t,
}) {
  const addItem = () => {
    onItemsChange([...items, { ...DEFAULT_INVOICE_ITEM }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onItemsChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{t("invoiceDetails")}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="me-1 h-3 w-3" />
          {t("addItem")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">
                {t("itemDescription")}
              </TableHead>
              <TableHead className="w-[80px]">
                {language === "ar" ? "الكمية" : "Qty"}
              </TableHead>
              <TableHead className="w-[120px]">
                {language === "ar" ? "سعر الوحدة" : "Unit Price"}
              </TableHead>
              <TableHead className="w-[120px]">
                {language === "ar" ? "النوع" : "Type"}
              </TableHead>
              <TableHead className="w-[100px] text-end">
                {t("total")}
              </TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((itm, idx) => {
              const lineTotal =
                parseFloat(itm.unit_price || 0) *
                (parseInt(itm.quantity) || 1);
              return (
                <TableRow key={idx}>
                  <TableCell>
                    <Input
                      value={itm.description}
                      onChange={(e) =>
                        updateItem(idx, "description", e.target.value)
                      }
                      placeholder={t("itemDescription")}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={itm.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", e.target.value)
                      }
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itm.unit_price}
                      onChange={(e) =>
                        updateItem(idx, "unit_price", e.target.value)
                      }
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={itm.item_type}
                      onValueChange={(v) => updateItem(idx, "item_type", v)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {language === "ar" ? type.labelAr : type.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-end font-medium">
                    {formatAmount(lineTotal, language)}
                  </TableCell>
                  <TableCell>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
