"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WalletsFilterNew({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('wallets.searchByNameOrPhone') || "Search by client name or phone..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder={t('wallets.filterByStatus') || "Filter by status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all') || "All"}</SelectItem>
            <SelectItem value="active">{t('wallets.active') || "Active"}</SelectItem>
            <SelectItem value="suspended">{t('wallets.suspended') || "Suspended"}</SelectItem>
            <SelectItem value="closed">{t('wallets.closed') || "Closed"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
