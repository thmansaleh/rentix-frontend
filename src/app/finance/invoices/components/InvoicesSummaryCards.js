"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAmount } from "../utils/formatters";

export default function InvoicesSummaryCards({ stats, language, t }) {
  const cards = [
    {
      label: t("totalAmount"),
      value: formatAmount(stats.totalAmount, language),
      colorClass: "",
    },
    {
      label: language === "ar" ? "المدفوع" : "Total Paid",
      value: formatAmount(stats.paidAmount, language),
      colorClass: "text-green-600",
    },
    {
      label: t("statusPaid"),
      value: stats.paidCount,
      colorClass: "text-green-600",
    },
    {
      label: language === "ar" ? "غير مدفوعة" : "Unpaid",
      value: stats.unpaidCount,
      colorClass: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-xs">{card.label}</p>
            <p className={`text-xl font-bold ${card.colorClass}`}>
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
