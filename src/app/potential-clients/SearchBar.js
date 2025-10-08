"use client";

import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export function SearchBar({ onSearch, onAddNew }) {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm: searchTerm.trim(),
      status: status === "all" ? undefined : status,
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatus("all");
    onSearch({
      searchTerm: "",
      status: undefined,
    });
  };

  const hasFilters = searchTerm || (status !== "all");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("potentialClientsPage.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <div className="">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("potentialClientsPage.search.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("potentialClientsPage.search.allStatuses")}</SelectItem>
                <SelectItem value="new">{t("potentialClientsPage.status.new")}</SelectItem>
                <SelectItem value="Contacted">{t("potentialClientsPage.status.contacted")}</SelectItem>
                <SelectItem value="Qualified">{t("potentialClientsPage.status.qualified")}</SelectItem>
                <SelectItem value="Unqualified">{t("potentialClientsPage.status.notQualified")}</SelectItem>
                <SelectItem value="Converted to Client">{t("potentialClientsPage.status.convertToClient")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search and Clear Buttons */}
          <Button type="submit" variant="default">
            {t("potentialClientsPage.search.button")}
          </Button>
          {hasFilters && (
            <Button type="button" variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-1" />
              {t("potentialClientsPage.search.clear")}
            </Button>
          )}
        </form>
        
        {/* Add New Client Button */}
        <div className="flex-shrink-0">
          <Button 
            type="button" 
            onClick={onAddNew}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("potentialClientsPage.addButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
