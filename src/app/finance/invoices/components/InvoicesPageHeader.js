"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvoicesPageHeader({ t, onAddNew }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("pageDescription")}</p>
      </div>
      <Button onClick={onAddNew} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("addNewInvoice")}
      </Button>
    </div>
  );
}
