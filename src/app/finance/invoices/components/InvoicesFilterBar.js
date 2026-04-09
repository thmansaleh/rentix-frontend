"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "../constants";

export default function InvoicesFilterBar({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  branchFilter,
  onBranchFilterChange,
  onSearch,
  language,
  isRTL,
  t,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder={
            language === "ar"
              ? "بحث برقم الفاتورة أو اسم العميل..."
              : "Search by invoice number or customer..."
          }
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ps-9"
        />
      </div>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.translationKey
                ? t(opt.translationKey)
                : language === "ar"
                ? opt.labelAr
                : opt.labelEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Branch filter */}
      <Select value={branchFilter} onValueChange={onBranchFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue
            placeholder={language === "ar" ? "اختر الفرع" : "Select Branch"}
          />
        </SelectTrigger>
 
      </Select>

      {/* Search button */}
      <Button onClick={onSearch} className="gap-2">
        <Search className="h-4 w-4" />
        {language === "ar" ? "بحث" : "Search"}
      </Button>
    </div>
  );
}
